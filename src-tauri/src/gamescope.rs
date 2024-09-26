use std::process::Command;

fn get_app_window_id(window_label: &str) -> String {
    let formatted_window_label = format!("'{}'", window_label);
    let window_label = formatted_window_label.as_str();
    let cmd = "xwininfo";
    let args = [
        "-display",
        "$DISPLAY",
        "-root",
        "-tree",
        "|",
        "grep",
        window_label,
        "|",
        "grep",
        "'playtron-labs'",
        "|",
        "awk",
        "'{print $1}'",
    ];

    let formatted_command = format!("{} {}", cmd, args.join(" "));
    log::debug!("{}", formatted_command);
    let output = Command::new("sh")
        .arg("-c")
        .arg(formatted_command)
        .output()
        .expect("failed to get app window id");

    let output = String::from_utf8_lossy(&output.stdout);
    let mut lines = output.lines();
    let window_id = lines.next().unwrap_or("").to_string();

    println!("window id: {}", window_id);
    window_id
}

fn set_window_steam_game_xprop(window_id: &str, steam_game_id: &str) {
    let cmd = "xprop";
    let args = [
        "-display",
        "$DISPLAY",
        "-id",
        window_id,
        "-f",
        "STEAM_GAME",
        "32c",
        "-set",
        "STEAM_GAME",
        steam_game_id,
    ];

    let formatted_command = format!("{} {}", cmd, args.join(" "));
    Command::new("sh")
        .arg("-c")
        .arg(formatted_command)
        .output()
        .expect("failed to set window steam game xprop");
}

// Special gamescope value for the main/base app window
const MAIN_STEAM_GAME: &str = "769";

#[tauri::command]
pub fn initialize_gamescope_window(window_label: &str, steam_game_id: Option<&str>) {
    log::info!("Initializing gamescope window {}", window_label);
    let window_id = get_app_window_id(window_label);
    set_window_steam_game_xprop(&window_id, steam_game_id.unwrap_or(MAIN_STEAM_GAME));
}
