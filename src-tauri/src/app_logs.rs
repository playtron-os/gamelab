use std::collections::{hash_map::Entry, HashMap};
use tauri::{AppHandle, Manager, State};
use tokio::{
    fs::{create_dir_all, File, OpenOptions},
    io::AsyncWriteExt,
    sync::Mutex,
};

#[derive(Default, Debug)]
pub struct LogStreamState {
    open_files: HashMap<String, File>,
}

#[tauri::command]
pub async fn app_log_init(
    app: AppHandle,
    state: State<'_, Mutex<LogStreamState>>,
    app_id: String,
) -> Result<(), String> {
    log::info!("Opening log file for {}", app_id);
    let mut state = state.lock().await;
    let dir = app.path().app_log_dir().map_err(|err| err.to_string())?;
    let dir = dir.join("games");
    if !dir.exists() {
        create_dir_all(&dir).await.map_err(|err| err.to_string())?;
    }
    let file_name = format!("{app_id}.log");
    let file_name = dir.join(file_name);
    let new_file = OpenOptions::new()
        .truncate(true)
        .write(true)
        .create(true)
        .open(file_name)
        .await
        .map_err(|err| err.to_string())?;

    let entry = state.open_files.entry(app_id);

    match entry {
        Entry::Vacant(entry) => {
            entry.insert(new_file);
        }
        Entry::Occupied(mut entry) => {
            entry.insert(new_file);
        }
    }

    Ok(())
}

#[tauri::command]
pub async fn app_log_deinit(
    state: State<'_, Mutex<LogStreamState>>,
    app_id: String,
) -> Result<(), String> {
    log::warn!("Dropping log file for {}", app_id);
    let mut state = state.lock().await;
    let _ = state.open_files.remove(&app_id);
    Ok(())
}

#[tauri::command]
pub async fn app_log_stream(
    state: State<'_, Mutex<LogStreamState>>,
    app_id: String,
    content: String,
) -> Result<(), String> {
    let mut state = state.lock().await;
    let file = state
        .open_files
        .get_mut(&app_id)
        .ok_or("Log not initialized")?;
    file.write(content.as_bytes())
        .await
        .map_err(|err| err.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn app_log_show(app: AppHandle, app_id: String) -> Result<(), String> {
    let dir = app.path().app_log_dir().map_err(|err| err.to_string())?;
    let dir = dir.join("games");

    if !dir.exists() {
        create_dir_all(&dir).await.map_err(|err| err.to_string())?;
    }

    let file_name = format!("{app_id}.log");
    let file_name = dir.join(file_name);

    #[cfg(target_os = "windows")]
    let command: &[&str] = &["start", file_name.to_str().unwrap()];
    #[cfg(target_os = "macos")]
    let command: &[&str] = &["open", file_name.to_str().unwrap()];
    #[cfg(target_os = "linux")]
    let command: &[&str] = &["xdg-open", file_name.to_str().unwrap()];

    if let Err(err) = tokio::process::Command::new(command[0])
        .args(&command[1..])
        .output()
        .await
    {
        log::error!("Failed to open the file {:?} {:?}", file_name, err);
    }

    Ok(())
}
