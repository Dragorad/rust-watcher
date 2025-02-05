// src/config/directory.rs

use serde::{Deserialize, Serialize};
use std::fs;
use std::io::{self, ErrorKind};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DirectoryConfig {
    pub path: String,
    pub days: Vec<String>,
    pub hours: String,
    pub frequency: u32,
}

impl DirectoryConfig {
    pub fn new(path: String, days: Vec<String>, hours: String, frequency: u32) -> Self {
        DirectoryConfig {
            path,
            days,
            hours,
            frequency,
        }
    }
}

pub fn save_configs_to_file(configs: &Vec<DirectoryConfig>, file_path: &str) -> io::Result<()> {
    let data = serde_json::to_string_pretty(configs)?;
    fs::write(file_path, data)?;
    Ok(())
}

pub fn load_configs_from_file(file_path: &str) -> io::Result<Vec<DirectoryConfig>> {
    match fs::read_to_string(file_path) {
        Ok(data) => {
            let configs: Vec<DirectoryConfig> = serde_json::from_str(&data)?;
            Ok(configs)
        }
        Err(ref e) if e.kind() == ErrorKind::NotFound => Ok(Vec::new()), // Ако файлът не съществува, връщаме празен вектор
        Err(e) => Err(e),
    }
}
