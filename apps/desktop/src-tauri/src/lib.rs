//! Tauri shell. Commands stay thin: they translate between the UI and `app_core`.

#[tauri::command]
fn greet(name: &str) -> String {
    app_core::greet(name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
