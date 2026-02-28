use std::net::IpAddr;

use serde::{Deserialize, Serialize};

use crate::ssh::ssh_exec;

const DEFAULT_AUTOTEST_DIR: &str = "$HOME/autotest";
const DEFAULT_OUTPUT_DIR: &str = "/tmp/gamelab_autotest";

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameEntry {
    pub name: String,
    pub game_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AutotestGameResult {
    pub game_name: String,
    pub game_id: String,
    pub status: String,
    pub message: String,
    pub elapsed_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AutotestManifestEntry {
    pub game_name: String,
    pub game_id: String,
    pub suite_filename: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AutotestPollResult {
    pub status: String,
    pub total: usize,
    pub completed: usize,
    pub results: Vec<AutotestGameResult>,
    pub manifest: Vec<AutotestManifestEntry>,
}

/// Convert a game name to PascalCase.
///
/// Matches Python's `_to_pascal_case`: split on non-alphanumeric chars, then
/// capitalize each word (uppercase first char, lowercase rest — matching
/// Python `str.capitalize()`).
fn to_pascal_case(name: &str) -> String {
    let mut result = String::new();
    let mut in_word = false;
    let mut word = String::new();

    for c in name.chars() {
        if c.is_ascii_alphanumeric() {
            word.push(c);
            in_word = true;
        } else {
            if in_word && !word.is_empty() {
                // Python str.capitalize(): first char upper, rest lower
                let mut chars = word.chars();
                if let Some(first) = chars.next() {
                    result.push(first.to_ascii_uppercase());
                    for ch in chars {
                        result.push(ch.to_ascii_lowercase());
                    }
                }
                word.clear();
            }
            in_word = false;
        }
    }
    // Flush last word
    if !word.is_empty() {
        let mut chars = word.chars();
        if let Some(first) = chars.next() {
            result.push(first.to_ascii_uppercase());
            for ch in chars {
                result.push(ch.to_ascii_lowercase());
            }
        }
    }
    result
}

/// Generate a Python variable name: `{Store}{PascalCaseName}`.
///
/// Matches Python's `_make_var_name` from gen_tests.py.
fn make_var_name(store: &str, game_name: &str) -> String {
    let pascal = to_pascal_case(game_name);
    let pascal = if pascal.is_empty() {
        "Unknown".to_string()
    } else {
        pascal
    };
    let name = format!("{}{}", store, pascal);
    if name.starts_with(|c: char| c.is_ascii_digit()) {
        format!("Game{}", name)
    } else {
        name
    }
}

fn generate_runner_script(autotest_dir: &str, output_dir: &str) -> String {
    format!(
        r#"#!/usr/bin/env bash
set -euo pipefail

AUTOTEST_DIR="{autotest_dir}"
OUTPUT_DIR="{output_dir}"
PID_FILE="$OUTPUT_DIR/runner.pid"
STATUS_FILE="$OUTPUT_DIR/run.status"

export DISPLAY=:0
echo $$ > "$PID_FILE"
rm -f "$STATUS_FILE" "$OUTPUT_DIR/results.tsv"

cd "$AUTOTEST_DIR"
poetry run python gen_tests.py --suites
poetry run robot \
    --listener ResultsListener.py:"$OUTPUT_DIR":"$OUTPUT_DIR/manifest.txt" \
    --outputdir "$OUTPUT_DIR" \
    Tests/InstalledGames.robot || true

echo "DONE" > "$STATUS_FILE"
rm -f "$PID_FILE"
"#
    )
}

fn parse_results_tsv(tsv: &str) -> Vec<AutotestGameResult> {
    let mut results = Vec::new();
    for line in tsv.lines() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        let parts: Vec<&str> = line.splitn(5, '\t').collect();
        if parts.len() >= 4 {
            results.push(AutotestGameResult {
                status: parts[0].to_string(),
                elapsed_ms: parts[1].parse().unwrap_or(0),
                game_name: parts[2].to_string(),
                game_id: parts[3].to_string(),
                message: parts.get(4).unwrap_or(&"").to_string(),
            });
        }
    }
    results
}

fn parse_manifest(manifest: &str) -> Vec<AutotestManifestEntry> {
    let mut entries = Vec::new();
    for line in manifest.lines() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        let parts: Vec<&str> = line.splitn(4, '\t').collect();
        if parts.len() >= 3 {
            entries.push(AutotestManifestEntry {
                game_name: parts[0].to_string(),
                game_id: parts[1].to_string(),
                suite_filename: parts[2].to_string(),
            });
        }
    }
    entries
}

#[tauri::command]
pub async fn autotest_start(
    address: String,
    games: Vec<GameEntry>,
    username: Option<String>,
    password: Option<String>,
    autotest_dir: Option<String>,
    output_dir: Option<String>,
) -> Result<(), String> {
    let address: IpAddr = address
        .parse()
        .map_err(|_| "IP address is invalid".to_string())?;

    if games.is_empty() {
        return Err("No games provided".to_string());
    }

    let username = username.unwrap_or_else(|| String::from("playtron"));
    let password = password.unwrap_or_else(|| String::from("playtron"));
    let autotest_dir = autotest_dir.unwrap_or_else(|| String::from(DEFAULT_AUTOTEST_DIR));
    let output_dir = output_dir.unwrap_or_else(|| String::from(DEFAULT_OUTPUT_DIR));
    let tests_dir = format!("{autotest_dir}/Tests");

    log::info!(
        "Starting device-side autotest for {} games on {}",
        games.len(),
        address
    );

    // Kill any existing runner (process group + PID for thorough cleanup)
    let kill_cmd = format!(
        "if [ -f {output_dir}/runner.pid ]; then PID=$(cat {output_dir}/runner.pid); kill -- -$(ps -o pgid= -p $PID | tr -d ' ') 2>/dev/null; kill $PID 2>/dev/null; rm -f {output_dir}/runner.pid; fi"
    );
    let _ = ssh_exec(address, username.clone(), password.clone(), &kill_cmd).await;

    // Build installed game entries with var_name deduplication
    let mut installed_entries: Vec<(String, String, String)> = Vec::new(); // (var_name, game_id, game_name)
    for game in &games {
        let store = game.game_id.split('_').next().unwrap_or("Unknown");
        let var_name = make_var_name(store, &game.name);
        installed_entries.push((var_name, game.game_id.clone(), game.name.clone()));
    }
    // Deduplicate variable names (preserving insertion order = click order)
    let mut seen = std::collections::HashSet::new();
    for entry in &mut installed_entries {
        let base = entry.0.clone();
        if seen.contains(&entry.0) {
            let mut counter = 2u32;
            loop {
                let candidate = format!("{}{}", base, counter);
                if !seen.contains(&candidate) {
                    entry.0 = candidate;
                    break;
                }
                counter += 1;
            }
        }
        seen.insert(entry.0.clone());
    }

    // Sanitize game names/IDs to prevent heredoc delimiter injection
    for entry in &installed_entries {
        for content in [&entry.0, &entry.1, &entry.2] {
            if content.contains("GAMELAB_") && content.contains("_EOF") {
                return Err("Game data contains reserved delimiter sequence".to_string());
            }
        }
    }

    // Generate Installed.py content
    let mut installed_py = String::from("# Auto-generated by GameLAB autotest\n");
    for (var_name, game_id, _) in &installed_entries {
        installed_py.push_str(&format!("{} = \"{}\"\n", var_name, game_id));
    }
    installed_py.push_str("\nInstalledGames = [\n");
    for (var_name, _, _) in &installed_entries {
        installed_py.push_str(&format!("    {},\n", var_name));
    }
    installed_py.push_str("]\n");

    // Generate manifest.txt (4 columns: game_name, game_id, suite_filename, var_name)
    let mut manifest_lines = Vec::new();
    for (var_name, game_id, game_name) in &installed_entries {
        manifest_lines.push(format!(
            "{}\t{}\tInstalledGames.robot\t{}",
            game_name, game_id, var_name
        ));
    }
    let manifest_content = manifest_lines.join("\n");

    // Build all file writes as a single chained command
    let mut write_parts = Vec::new();

    // Create directories
    write_parts.push(format!("mkdir -p {output_dir} {tests_dir}"));

    // Write Tests/Installed.py
    write_parts.push(format!(
        "cat > {tests_dir}/Installed.py << 'GAMELAB_INSTALLED_EOF'\n{installed_py}\nGAMELAB_INSTALLED_EOF"
    ));

    // Write manifest.txt
    write_parts.push(format!(
        "cat > {output_dir}/manifest.txt << 'GAMELAB_MANIFEST_EOF'\n{manifest_content}\nGAMELAB_MANIFEST_EOF"
    ));

    // Write runner.sh
    let runner_script = generate_runner_script(&autotest_dir, &output_dir);
    write_parts.push(format!(
        "cat > {output_dir}/runner.sh << 'GAMELAB_RUNNER_EOF'\n{runner_script}\nGAMELAB_RUNNER_EOF"
    ));
    write_parts.push(format!("chmod +x {output_dir}/runner.sh"));

    // Clean previous results
    write_parts.push(format!("rm -f {output_dir}/results.tsv {output_dir}/run.status {output_dir}/runner.pid"));

    let write_cmd = write_parts.join("\n");
    let write_result = ssh_exec(address, username.clone(), password.clone(), &write_cmd).await?;
    if write_result.exit_code != Some(0) {
        return Err(format!(
            "Failed to write test files to device: {}",
            write_result.stderr
        ));
    }

    // Launch runner detached via nohup
    // < /dev/null is critical: without it the SSH channel blocks waiting for stdin EOF
    let launch_cmd = format!(
        "nohup bash {output_dir}/runner.sh > {output_dir}/runner_stdout.log 2>&1 < /dev/null &"
    );
    let launch_result = ssh_exec(address, username.clone(), password.clone(), &launch_cmd).await?;
    if launch_result.exit_code != Some(0) {
        return Err(format!(
            "Failed to launch runner on device: {}",
            launch_result.stderr
        ));
    }

    log::info!("Device-side autotest runner launched successfully");
    Ok(())
}

#[tauri::command]
pub async fn autotest_poll(
    address: String,
    username: Option<String>,
    password: Option<String>,
    output_dir: Option<String>,
) -> Result<AutotestPollResult, String> {
    let address: IpAddr = address
        .parse()
        .map_err(|_| "IP address is invalid".to_string())?;

    let username = username.unwrap_or_else(|| String::from("playtron"));
    let password = password.unwrap_or_else(|| String::from("playtron"));
    let output_dir = output_dir.unwrap_or_else(|| String::from(DEFAULT_OUTPUT_DIR));

    // Single SSH call that reads all state files with delimited sections
    let poll_cmd = format!(
        r#"echo "===RESULTS_START==="
cat {output_dir}/results.tsv 2>/dev/null || true
echo "===RESULTS_END==="
echo "===MANIFEST_START==="
cat {output_dir}/manifest.txt 2>/dev/null || true
echo "===MANIFEST_END==="
echo "===STATUS_START==="
cat {output_dir}/run.status 2>/dev/null || echo "NONE"
echo "===STATUS_END==="
echo "===PID_START==="
if [ -f {output_dir}/runner.pid ]; then
  if kill -0 $(cat {output_dir}/runner.pid) 2>/dev/null; then
    echo "ALIVE"
  else
    echo "DEAD"
  fi
else
  echo "NONE"
fi
echo "===PID_END===""#
    );

    let result = ssh_exec(address, username, password, &poll_cmd).await?;
    let output = result.stdout;

    // Parse sections from output
    let results_tsv = extract_section(&output, "===RESULTS_START===", "===RESULTS_END===");
    let manifest_txt = extract_section(&output, "===MANIFEST_START===", "===MANIFEST_END===");
    let status_raw = extract_section(&output, "===STATUS_START===", "===STATUS_END===");
    let pid_raw = extract_section(&output, "===PID_START===", "===PID_END===");

    let status_str = status_raw.trim();
    let pid_str = pid_raw.trim();

    let results = parse_results_tsv(&results_tsv);
    let manifest = parse_manifest(&manifest_txt);

    let status = if status_str == "DONE" {
        "done"
    } else if status_str == "STOPPED" {
        "aborted"
    } else if pid_str == "ALIVE" {
        "running"
    } else if pid_str == "DEAD" {
        // PID file exists but process is dead — runner crashed
        "aborted"
    } else {
        // No PID file, no status file — nothing running
        "none"
    };

    Ok(AutotestPollResult {
        status: status.to_string(),
        total: manifest.len(),
        completed: results.len(),
        results,
        manifest,
    })
}

#[tauri::command]
pub async fn autotest_stop(
    address: String,
    username: Option<String>,
    password: Option<String>,
    output_dir: Option<String>,
) -> Result<(), String> {
    let address: IpAddr = address
        .parse()
        .map_err(|_| "IP address is invalid".to_string())?;

    let username = username.unwrap_or_else(|| String::from("playtron"));
    let password = password.unwrap_or_else(|| String::from("playtron"));
    let output_dir = output_dir.unwrap_or_else(|| String::from(DEFAULT_OUTPUT_DIR));

    let stop_cmd = format!(
        r#"if [ -f {output_dir}/runner.pid ]; then PID=$(cat {output_dir}/runner.pid); kill -- -$(ps -o pgid= -p $PID | tr -d ' ') 2>/dev/null; kill $PID 2>/dev/null; rm -f {output_dir}/runner.pid; fi; echo "STOPPED" > {output_dir}/run.status"#
    );

    let result = ssh_exec(address, username, password, &stop_cmd).await?;
    if result.exit_code != Some(0) {
        return Err(format!("Failed to stop runner: {}", result.stderr));
    }

    log::info!("Autotest runner stopped on device");
    Ok(())
}

fn extract_section(output: &str, start_marker: &str, end_marker: &str) -> String {
    if let Some(start) = output.find(start_marker) {
        let after_start = &output[start + start_marker.len()..];
        if let Some(end) = after_start.find(end_marker) {
            return after_start[..end].trim().to_string();
        }
    }
    String::new()
}
