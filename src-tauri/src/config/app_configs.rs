// src-tauri/src/config/app_configs.rs
use std::path::Path;
use serde_json::json;
use std::fs;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct AppConfig {
    pub global_config_path: String,
    pub local_config_path: String,
    pub last_update: String,
}

pub fn initialize_config_files() -> Result<(), String> {
    let config_dir = Path::new("config_files");

    // Създаване на директорията ако не съществува
    if !config_dir.exists() {
        fs::create_dir_all(config_dir)
            .map_err(|e| format!("Грешка при създаване на директория: {}", e))?;
    }

    // Създаване на app_config.json
    let app_config_path = config_dir.join("app_config.json");
    if !app_config_path.exists() {
        let app_config = json!({
            "global_config_path": "",
            "local_config_path": "",
            "last_update": ""
        });
        fs::write(&app_config_path, serde_json::to_string_pretty(&app_config).unwrap())
            .map_err(|e| format!("Грешка при създаване на app_config.json: {}", e))?;
    }

    Ok(())
}

#[tauri::command]
pub async fn load_app_config() -> Result<AppConfig, String> {
    let config_path = Path::new("config_files").join("app_config.json");
    let content = fs::read_to_string(&config_path)
        .map_err(|e| format!("Грешка при четене на конфигурацията: {}", e))?;
    
    serde_json::from_str(&content)
        .map_err(|e| format!("Грешка при парсване на конфигурацията: {}", e))
}

#[tauri::command]
pub async fn save_app_config(config: AppConfig) -> Result<(), String> {
    let config_path = Path::new("config_files").join("app_config.json");
    let content = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Грешка при сериализация на конфигурацията: {}", e))?;
    
    fs::write(&config_path, content)
        .map_err(|e| format!("Грешка при запис на конфигурацията: {}", e))
}