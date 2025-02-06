// use serde::{Deserialize, Serialize};
// use std::fs;
// use std::io::{self, ErrorKind};
// use std::path::PathBuf;
// use tauri::command;
// use crate::utilities::log_message;
// use tauri_plugin_log::LogLevel;

// #[derive(Serialize, Deserialize, Debug, Clone)]
// pub struct DirectoryConfig {
//     pub path: String,
//     pub days: Vec<String>,
//     pub hours: String,
//     pub frequency: u32,
// }

// impl DirectoryConfig {
//     pub fn new(path: &str, days: Vec<String>, hours: &str, frequency: u32) -> Self {
//         DirectoryConfig {
//             path: path.to_string(),
//             days,
//             hours: hours.to_string(),
//             frequency,
//         }
//     }
// }

// fn load_all_configs(global_config_path: &PathBuf, local_config_path: &PathBuf) -> io::Result<Vec<DirectoryConfig>> {
//     let global_configs = load_configs_from_file(global_config_path)?;
//     let local_configs = load_configs_from_file(local_config_path)?;

//     let mut all_configs = global_configs;
//     all_configs.extend(local_configs);

//     Ok(all_configs)
// }

// #[command]
// pub fn add_directory(
//     path: String,
//     days: Vec<String>,
//     hours: String,
//     frequency: u32,
//     local_config_path: PathBuf,
// ) -> Result<(), String> {
//     let mut configs = load_configs_from_file(&local_config_path).map_err(|e| e.to_string())?;
//     let new_config = DirectoryConfig::new(&path, days, &hours, frequency);
//     configs.push(new_config);
//     save_configs_to_file(&configs, &local_config_path).map_err(|e| e.to_string())?;
//     log_message(LogLevel::Info, &format!("Added directory: {}", path));
//     Ok(())
// }

// #[command]
// pub fn get_directories(global_config_path: PathBuf, local_config_path: PathBuf) -> Result<Vec<DirectoryConfig>, String> {
//     let configs = load_all_configs(&global_config_path, &local_config_path).map_err(|e| e.to_string())?;
//     log_message(LogLevel::Info, "Fetched directory list");
//     Ok(configs)
// }

// #[command]
// pub fn update_directory(
//     index: usize,
//     path: String,
//     days: Vec<String>,
//     hours: String,
//     frequency: u32,
//     local_config_path: PathBuf,
// ) -> Result<(), String> {
//     let mut configs = load_configs_from_file(&local_config_path).map_err(|e| e.to_string())?;
//     if index < configs.len() {
//         configs[index] = DirectoryConfig::new(&path, days, &hours, frequency);
//         save_configs_to_file(&configs, &local_config_path).map_err(|e| e.to_string())?;
//         log_message(LogLevel::Info, &format!("Updated directory at index {}: {}", index, path));
//         Ok(())
//     } else {
//         Err("Index out of bounds".to_string())
//     }
// }

// #[command]
// pub fn delete_directory(index: usize, local_config_path: PathBuf) -> Result<(), String> {
//     let mut configs = load_configs_from_file(&local_config_path).map_err(|e| e.to_string())?;
//     if index < configs.len() {
//         let removed = configs.remove(index);
//         save_configs_to_file(&configs, &local_config_path).map_err(|e| e.to_string())?;
//         log_message(LogLevel::Info, &format!("Deleted directory: {}", removed.path));
//         Ok(())
//     } else {
//         Err("Index out of bounds".to_string())
//     }
// }

// pub fn save_configs_to_file(configs: &Vec<DirectoryConfig>, file_path: &PathBuf) -> io::Result<()> {
//     let data = serde_json::to_string_pretty(configs)?;
//     fs::write(file_path, data)?;
//     Ok(())
// }

// pub fn load_configs_from_file(file_path: &PathBuf) -> io::Result<Vec<DirectoryConfig>> {
//     match fs::read_to_string(file_path) {
//         Ok(data) => {
//             let configs: Vec<DirectoryConfig> = serde_json::from_str(&data)?;
//             Ok(configs)
//         }
//         Err(ref e) if e.kind() == ErrorKind::NotFound => Ok(Vec::new()), // Ако файлът не съществува, връщаме празен вектор
//         Err(e) => Err(e),
//     }
// }

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
pub fn get_directories(config_path: PathBuf) -> Result<Vec<DirectoryConfig>, String> {
    println!("Loading directories from: {:?}", config_path);
    let configs = load_configs_from_file(&config_path).map_err(|e| {
        println!("Error loading directories: {}", e);
        e.to_string()
    })?;
    log_message(LogLevel::Info, "Fetched directory list");
    Ok(configs)
}

#[command]
pub fn add_directory(
    path: String,
    days: Vec<String>,
    hours: String,
    frequency: u32,
    config_path: PathBuf,
) -> Result<(), String> {
    println!("Adding directory to: {:?}", config_path);
    let mut configs = load_configs_from_file(&config_path).map_err(|e| {
        println!("Error loading directories: {}", e);
        e.to_string()
    })?;
    let new_config = DirectoryConfig::new(&path, days, &hours, frequency);
    configs.push(new_config);
    save_configs_to_file(&configs, &config_path).map_err(|e| {
        println!("Error saving directories: {}", e);
        e.to_string()
    })?;
    log_message(LogLevel::Info, &format!("Added directory: {}", path));
    Ok(())
}

#[command]
pub fn update_directory(
    index: usize,
    path: String,
    days: Vec<String>,
    hours: String,
    frequency: u32,
    config_path: PathBuf,
) -> Result<(), String> {
    println!("Updating directory in: {:?}", config_path);
    let mut configs = load_configs_from_file(&config_path).map_err(|e| {
        println!("Error loading directories: {}", e);
        e.to_string()
    })?;
    if index < configs.len() {
        configs[index] = DirectoryConfig::new(&path, days, &hours, frequency);
        save_configs_to_file(&configs, &config_path).map_err(|e| {
            println!("Error saving directories: {}", e);
            e.to_string()
        })?;
        log_message(LogLevel::Info, &format!("Updated directory at index {}: {}", index, path));
        Ok(())
    } else {
        Err("Index out of bounds".to_string())
    }
}

#[command]
pub fn delete_directory(index: usize, config_path: PathBuf) -> Result<(), String> {
    println!("Deleting directory from: {:?}", config_path);
    let mut configs = load_configs_from_file(&config_path).map_err(|e| {
        println!("Error loading directories: {}", e);
        e.to_string()
    })?;
    if index < configs.len() {
        let removed = configs.remove(index);
        save_configs_to_file(&configs, &config_path).map_err(|e| {
            println!("Error saving directories: {}", e);
            e.to_string()
        })?;
        log_message(LogLevel::Info, &format!("Deleted directory: {}", removed.path));
        Ok(())
    } else {
        Err("Index out of bounds".to_string())
    }
}

pub fn save_configs_to_file(configs: &Vec<DirectoryConfig>, file_path: &PathBuf) -> io::Result<()> {
    let data = serde_json::to_string_pretty(configs)?;
    fs::write(file_path, data)?;
    Ok(())
}

pub fn load_configs_from_file(file_path: &PathBuf) -> io::Result<Vec<DirectoryConfig>> {
    match fs::read_to_string(file_path) {
        Ok(data) => {
            let configs: Vec<DirectoryConfig> = serde_json::from_str(&data)?;
            Ok(configs)
        }
        Err(ref e) if e.kind() == ErrorKind::NotFound => Ok(Vec::new()), // Ако файлът не съществува, връщаме празен вектор
        Err(e) => Err(e),
    }
}