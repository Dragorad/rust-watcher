// src-tauri/src/config/app_configs.rs
use std::path::{Path, PathBuf};
use serde_json::json;
use std::fs;
use std::io::{self, ErrorKind};
use serde::{Deserialize, Serialize};
use tauri::command;
use tauri_plugin_log::LogLevel;
use crate::utilities;

#[derive(Serialize, Deserialize)]
pub struct AppConfig {
    pub global_config_path: String,
    pub local_config_path: String,
    pub last_update: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DirectoryConfig {
    pub path: String,
    pub days: Vec<String>,
    pub hours: String,
    pub frequency: u32,
}

impl DirectoryConfig {
    pub fn new(path: &str, days: Vec<String>, hours: &str, frequency: u32) -> Self {
        DirectoryConfig {
            path: path.to_string(),
            days,
            hours: hours.to_string(),
            frequency,
        }
    }
}

pub fn initialize_config_files() -> Result<(), String> {
    utilities::log_message(LogLevel::Info, "Започва инициализация на конфигурационните файлове");
    
    let current_dir = std::env::current_dir()
        .map_err(|e| format!("Грешка при взимане на текущата директория: {}", e))?;
    let config_dir = current_dir.join("config_files");
    
    utilities::log_message(LogLevel::Info, &format!("Конфигурационна директория: {:?}", config_dir));

    // Създаваме основната директория
    if !config_dir.exists() {
        fs::create_dir_all(&config_dir)
            .map_err(|e| format!("Грешка при създаване на директория: {}", e))?;
    }

    // Създаваме поддиректории за глобална и локална конфигурация
    let global_dir = config_dir.join("global");
    let local_dir = config_dir.join("local");

    fs::create_dir_all(&global_dir)
        .map_err(|e| format!("Грешка при създаване на global директория: {}", e))?;
    fs::create_dir_all(&local_dir)
        .map_err(|e| format!("Грешка при създаване на local директория: {}", e))?;

    // Създаваме конфигурационните файлове
    let global_config = global_dir.join("config.json");
    let local_config = local_dir.join("config.json");

    let app_config_path = config_dir.join("app_config.json");
    utilities::log_message(LogLevel::Info, &format!("Път до конфигурационния файл: {:?}", app_config_path));

    if !app_config_path.exists() {
        utilities::log_message(LogLevel::Info, "Създаване на app_config.json");
        let app_config = json!({
            "global_config_path": global_config.to_string_lossy().to_string(),
            "local_config_path": local_config.to_string_lossy().to_string(),
            "last_update": chrono::Local::now().to_rfc3339()
        });
        
        let config_content = serde_json::to_string_pretty(&app_config)
            .map_err(|e| format!("Грешка при сериализация: {}", e))?;
        
        fs::write(&app_config_path, config_content)
            .map_err(|e| format!("Грешка при създаване на app_config.json: {}", e))?;
        
        utilities::log_message(LogLevel::Info, "app_config.json създаден успешно");

        // Създаваме празни конфигурационни файлове
        let empty_config = json!({
            "directories": [],
            "settings": {},
            "history": {
                "created": chrono::Local::now().to_rfc3339(),
                "lastModified": chrono::Local::now().to_rfc3339()
            }
        });

        let empty_config_content = serde_json::to_string_pretty(&empty_config)
            .map_err(|e| format!("Грешка при сериализация: {}", e))?;

        fs::write(&global_config, &empty_config_content)
            .map_err(|e| format!("Грешка при създаване на global config: {}", e))?;
        fs::write(&local_config, &empty_config_content)
            .map_err(|e| format!("Грешка при създаване на local config: {}", e))?;

        utilities::log_message(LogLevel::Info, "Конфигурационните файлове са създадени успешно");
    }

    utilities::log_message(LogLevel::Info, "Инициализацията завърши успешно");
    Ok(())
}

#[tauri::command]
pub async fn load_app_config() -> Result<AppConfig, String> {
    utilities::log_message(LogLevel::Info, "Започва зареждане на app конфигурация");

    let current_dir = std::env::current_dir()
        .map_err(|e| {
            utilities::log_message(LogLevel::Error, &format!("Грешка при взимане на текущата директория: {}", e));
            format!("Грешка при взимане на текущата директория: {}", e)
        })?;

    let config_path = current_dir.join("config_files").join("app_config.json");
    utilities::log_message(LogLevel::Info, &format!("Опит за зареждане от: {:?}", config_path));

    if !config_path.exists() {
        let msg = format!("Конфигурационният файл не съществува: {:?}", config_path);
        utilities::log_message(LogLevel::Error, &msg);
        return Err(msg);
    }

    let content = fs::read_to_string(&config_path)
        .map_err(|e| {
            utilities::log_message(LogLevel::Error, &format!("Грешка при четене на файла: {}", e));
            format!("Грешка при четене на конфигурацията: {}", e)
        })?;

    utilities::log_message(LogLevel::Info, &format!("Прочетено съдържание: {}", content));

    let config: AppConfig = serde_json::from_str(&content)
        .map_err(|e| {
            utilities::log_message(LogLevel::Error, &format!("Грешка при парсване на JSON: {}", e));
            format!("Грешка при парсване на конфигурацията: {}", e)
        })?;

    utilities::log_message(LogLevel::Info, "Конфигурацията е заредена успешно");
    Ok(config)
}

#[tauri::command]
pub async fn save_app_config(config: AppConfig) -> Result<(), String> {
    let current_dir = std::env::current_dir()
        .map_err(|e| format!("Грешка при взимане на текущата директория: {}", e))?;
    let config_path = current_dir.join("config_files").join("app_config.json");
    
    utilities::log_message(LogLevel::Info, &format!("Запазване на конфигурация в: {:?}", config_path));

    let content = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Грешка при сериализация на конфигурацията: {}", e))?;
    
    fs::write(&config_path, content)
        .map_err(|e| format!("Грешка при запис на конфигурацията: {}", e))?;

    utilities::log_message(LogLevel::Info, "Конфигурацията е запазена успешно");
    Ok(())
}

#[command]
pub fn load_network_and_local_configs(
    network_config_path: PathBuf,
    local_config_path: PathBuf,
) -> Result<(Vec<DirectoryConfig>, Vec<DirectoryConfig>), String> {
    utilities::log_message(LogLevel::Info, "Зареждане на мрежови и локални конфигурации");
    
    let network_configs = load_configs_from_file(&network_config_path)
        .map_err(|e| e.to_string())?;
    let local_configs = load_configs_from_file(&local_config_path)
        .map_err(|e| e.to_string())?;

    utilities::log_message(LogLevel::Info, "Конфигурациите са заредени успешно");
    Ok((network_configs, local_configs))
}

#[command]
pub fn save_network_config(
    configs: Vec<DirectoryConfig>,
    network_config_path: PathBuf,
) -> Result<(), String> {
    utilities::log_message(LogLevel::Info, "Запазване на мрежова конфигурация");
    save_configs_to_file(&configs, &network_config_path).map_err(|e| e.to_string())
}

#[command]
pub fn save_local_config(
    configs: Vec<DirectoryConfig>,
    local_config_path: PathBuf,
) -> Result<(), String> {
    utilities::log_message(LogLevel::Info, "Запазване на локална конфигурация");
    save_configs_to_file(&configs, &local_config_path).map_err(|e| e.to_string())
}

fn save_configs_to_file(configs: &Vec<DirectoryConfig>, file_path: &PathBuf) -> io::Result<()> {
    utilities::log_message(LogLevel::Info, &format!("Запазване на конфигурации в: {:?}", file_path));
    
    // Четем съществуващата конфигурация за да запазим history
    let existing_config = if file_path.exists() {
        match fs::read_to_string(file_path) {
            Ok(content) => serde_json::from_str::<serde_json::Value>(&content)?,
            Err(_) => json!({})
        }
    } else {
        json!({})
    };

    // Създаваме нова конфигурация със запазена история
    let new_config = json!({
        "directories": configs,
        "settings": existing_config.get("settings").unwrap_or(&json!({})),
        "history": {
            "created": existing_config.get("history").and_then(|h| h.get("created"))
                .unwrap_or(&json!(chrono::Local::now().to_rfc3339())),
            "lastModified": chrono::Local::now().to_rfc3339()
        }
    });

    let data = serde_json::to_string_pretty(&new_config)?;
    fs::write(file_path, &data)?;

    utilities::log_message(LogLevel::Info, "Конфигурациите са запазени успешно");
    Ok(())
}

fn load_configs_from_file(file_path: &PathBuf) -> io::Result<Vec<DirectoryConfig>> {
    utilities::log_message(LogLevel::Info, &format!("Зареждане на конфигурации от: {:?}", file_path));
    
    match fs::read_to_string(file_path) {
        Ok(data) => {
            let configs: Vec<DirectoryConfig> = serde_json::from_str(&data)?;
            utilities::log_message(LogLevel::Info, "Конфигурациите са заредени успешно");
            Ok(configs)
        }
        Err(ref e) if e.kind() == ErrorKind::NotFound => {
            utilities::log_message(LogLevel::Info, "Файлът не съществува, връщане на празен вектор");
            Ok(Vec::new())
        }
        Err(e) => {
            utilities::log_message(LogLevel::Error, &format!("Грешка при четене на файл: {}", e));
            Err(e)
        }
    }
}

#[command]
pub async fn ensure_config_file_exists(directory: String, is_global: bool) -> Result<String, String> {
    let file_name = if is_global { "global_config.json" } else { "local_config.json" };
    let path = Path::new(&directory).join(file_name);

    utilities::log_message(LogLevel::Info, &format!("Проверка за конфигурационен файл: {}", path.display()));

    if !Path::new(&directory).exists() {
        fs::create_dir_all(&directory)
            .map_err(|e| format!("Грешка при създаване на директория: {}", e))?;
        utilities::log_message(LogLevel::Info, &format!("Създадена е директория: {}", directory));
    }

    if !path.exists() {
        let timestamp = chrono::Local::now().to_rfc3339();
        let default_config = if is_global {
            json!({
                "directories": [],
                "settings": {
                    "isGlobal": true,
                    "defaultGlobalPath": directory
                },
                "history": {
                    "created": timestamp,
                    "lastModified": timestamp
                }
            })
        } else {
            json!({
                "directories": [],
                "settings": {
                    "isGlobal": false,
                    "defaultLocalPath": directory
                },
                "history": {
                    "created": timestamp,
                    "lastModified": timestamp
                }
            })
        };

        fs::write(&path, serde_json::to_string_pretty(&default_config).unwrap())
            .map_err(|e| format!("Грешка при създаване на конфигурационен файл: {}", e))?;
        
        utilities::log_message(LogLevel::Info, &format!("Създаден е нов конфигурационен файл: {}", path.display()));

        let app_config = load_app_config().await?;
        let updated_config = AppConfig {
            global_config_path: if is_global { path.to_string_lossy().to_string() } else { app_config.global_config_path },
            local_config_path: if !is_global { path.to_string_lossy().to_string() } else { app_config.local_config_path },
            last_update: timestamp
        };
        save_app_config(updated_config).await?;
        
        utilities::log_message(LogLevel::Info, &format!("Обновена е основната конфигурация с нов път: {}", path.display()));
    } else {
        utilities::log_message(LogLevel::Info, &format!("Използва се съществуващ конфигурационен файл: {}", path.display()));
    }

    Ok(path.to_string_lossy().into_owned())
}