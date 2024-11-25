#[tauri::command]
pub async fn download_eula(eula_url: String) -> Result<String, String> {
    let body = reqwest::get(eula_url)
        .await
        .map_err(|err| format!("Failed to get EULA response {err:?}"))?
        .text()
        .await
        .map_err(|err| format!("Failed to read EULA response {err:?}"))?;

    Ok(body)
}
