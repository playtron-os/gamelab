// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use regex::{Captures, Regex};
use std::{env, fs};
use tauri::Manager;
use tauri_plugin_log::{Target, TargetKind};
use tokio::sync::Mutex;

mod app_logs;
mod autotest;
mod eula;
mod ssh;
mod validators;
use app_logs::*;
use autotest::*;
use eula::*;
use ssh::*;
use validators::*;

// Regex to match ${...} pattern from the .env file to properly replace values
lazy_static::lazy_static! {
    static ref VARIABLE_REGEX: Regex = Regex::new(r"\$\{[^}]*}").unwrap();
}

/// Initializes the ENV to the default values of each environment variable in .env
pub fn initialize_default_env() {
    let mut envfiles = vec![include_str!("../.env").to_owned()];

    if let Ok(current_dir) = env::current_dir() {
        let local_env_path = current_dir.join(".env.local");

        if let Ok(content) = fs::read_to_string(local_env_path) {
            envfiles.insert(0, content);
        }
    }

    for file in envfiles {
        for line in file.split('\n') {
            if !line.starts_with('#') {
                let [key, value]: [&str; 2] = line
                    .split('=')
                    .collect::<Vec<&str>>()
                    .try_into()
                    .unwrap_or(["", ""]);

                if !key.is_empty() && !value.is_empty() && std::env::var(key).is_err() {
                    let value = value.replace('\"', "");
                    let parsed_value =
                        VARIABLE_REGEX.replace_all(value.as_str(), |caps: &Captures| {
                            let var_key = caps[0].replace("${", "").replace('}', "");
                            std::env::var(var_key).expect("Environment variable should be defined")
                        });

                    std::env::set_var(key, parsed_value.to_string());
                }
            }
        }
    }
}

fn main() {
    initialize_default_env();

    let log_level = if env::var("GAMELAB_LOG_LEVEL").is_ok_and(|val| val.to_lowercase() == "debug")
    {
        log::LevelFilter::Trace
    } else {
        log::LevelFilter::Info
    };

    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            app.handle()
                .plugin(tauri_plugin_updater::Builder::new().build())?;
            app.manage(Mutex::new(LogStreamState::default()));
            Ok(())
        })
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            initialize_device_connection,
            app_log_init,
            app_log_deinit,
            app_log_stream,
            app_log_show,
            download_eula,
            validate_json,
            autotest_start,
            autotest_poll,
            autotest_stop,
        ])
        .plugin(
            tauri_plugin_log::Builder::new()
                .filter(|metadata| !metadata.target().starts_with("russh"))
                .level(log_level)
                .rotation_strategy(tauri_plugin_log::RotationStrategy::KeepAll)
                .with_colors(
                    tauri_plugin_log::fern::colors::ColoredLevelConfig::new()
                        .info(tauri_plugin_log::fern::colors::Color::Green),
                )
                .targets([
                    Target::new(TargetKind::Stderr),
                    Target::new(TargetKind::LogDir { file_name: None }),
                    Target::new(TargetKind::Webview),
                ])
                .build(),
        )
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
