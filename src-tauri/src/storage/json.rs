// src/storage/json.rs

use serde::{Deserialize, Serialize};
use std::fs;
use std::io::{self, ErrorKind};

pub fn save_to_file<T: Serialize>(data: &T, file_path: &str) -> io::Result<()> {
    let json_data = serde_json::to_string_pretty(data)?;
    fs::write(file_path, json_data)?;
    Ok(())
}

pub fn load_from_file<T: for<'de> Deserialize<'de>>(file_path: &str) -> io::Result<T> {
    match fs::read_to_string(file_path) {
        Ok(data) => {
            let result: T = serde_json::from_str(&data)?;
            Ok(result)
        }
        Err(ref e) if e.kind() == ErrorKind::NotFound => {
            Err(io::Error::new(ErrorKind::NotFound, "File not found"))
        }
        Err(e) => Err(e),
    }
}
