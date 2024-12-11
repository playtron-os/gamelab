use serde_json;

#[tauri::command]
pub async fn validate_json(data: &str) -> Result<String, String> {
    let result = serde_json::from_str::<serde_json::Value>(data);
    match result {
        Ok(_) => return Ok("".to_string()),
        Err(e) => return Ok(e.to_string()),
    }
}
