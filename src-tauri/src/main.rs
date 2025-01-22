// src/main.rs

mod config {
    pub mod directory;
}

mod storage {
    pub mod json;
}

mod watcher {
    pub mod monitor;
}

mod logging {
    pub mod logger;
}

use tauri::command;
use crate::config::directory::{DirectoryConfig, save_configs_to_file, load_configs_from_file};
use crate::watcher::monitor::start_watching;

const CONFIG_FILE: &str = "directory_configs.json";

#[command]
fn add_directory(path: String, days: Vec<String>, hours: String, frequency: u32) -> Result<(), String> {
    let mut configs = load_configs_from_file(CONFIG_FILE).map_err(|e| e.to_string())?;
    let new_config = DirectoryConfig::new(path, days, hours, frequency);
    configs.push(new_config);
    save_configs_to_file(&configs, CONFIG_FILE).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
async fn start_watching_command() -> Result<(), String> {
    let configs = load_configs_from_file(CONFIG_FILE).map_err(|e| e.to_string())?;
    for config in configs {
        start_watching(config).await;
    }
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add_directory, start_watching_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}