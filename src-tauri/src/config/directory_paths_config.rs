use serde::{Deserialize, Serialize};
use std::fs;
use std::io::{self, ErrorKind};
use std::path::PathBuf;
use tauri::command;
use crate::utilities::log_message;
use tauri_plugin_log::LogLevel;

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

#[command]
pub fn load_network_and_local_configs(
    network_config_path: PathBuf,
    local_config_path: PathBuf,
) -> Result<(Vec<DirectoryConfig>, Vec<DirectoryConfig>), String> {
    let network_configs =
        load_configs_from_file(&network_config_path).map_err(|e| e.to_string())?;
    let local_configs = load_configs_from_file(&local_config_path).map_err(|e| e.to_string())?;

    Ok((network_configs, local_configs))
}

#[command]
pub fn save_network_config(
    configs: Vec<DirectoryConfig>,
    network_config_path: PathBuf,
) -> Result<(), String> {
    save_configs_to_file(&configs, &network_config_path).map_err(|e| e.to_string())
}

#[command]
pub fn save_local_config(
    configs: Vec<DirectoryConfig>,
    local_config_path: PathBuf,
) -> Result<(), String> {
    save_configs_to_file(&configs, &local_config_path).map_err(|e| e.to_string())
}

fn save_configs_to_file(configs: &Vec<DirectoryConfig>, file_path: &PathBuf) -> io::Result<()> {
    let data = serde_json::to_string_pretty(configs)?;
    fs::write(file_path, data)?;
    Ok(())
}

fn load_configs_from_file(file_path: &PathBuf) -> io::Result<Vec<DirectoryConfig>> {
    match fs::read_to_string(file_path) {
        Ok(data) => {
            let configs: Vec<DirectoryConfig> = serde_json::from_str(&data)?;
            Ok(configs)
        }
        Err(ref e) if e.kind() == ErrorKind::NotFound => Ok(Vec::new()), // Ако файлът не съществува, връщаме празен вектор
        Err(e) => Err(e),
    }
}


#[command]
pub fn ensure_config_file_exists(directory: PathBuf, is_global: bool) -> Result<(), String> {
    let file_name = if is_global {
        "global_config.json"
    } else {
        "local_config.json"
    };

    let mut file_path = directory;
    file_path.push(file_name);

    if !file_path.exists() {
        match fs::File::create(&file_path) {
            Ok(_) => log_message(LogLevel::Info, &format!("Created file: {:?}", file_path)),
            Err(e) => {
                log_message(LogLevel::Error, &format!("Failed to create file: {:?}, Error: {}", file_path, e));
                return Err(e.to_string());
            }
        }
    } else {
        log_message(LogLevel::Info, &format!("File already exists: {:?}", file_path));
    }
    Ok(())
}