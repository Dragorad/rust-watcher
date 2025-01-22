use std::collections::HashSet;
use std::fs;
use std::path::Path;
use std::time::{SystemTime, UNIX_EPOCH, Duration};

use crate::config::directory::DirectoryConfig;
use crate::logging::logger::log_message;

pub async fn start_watching(config: DirectoryConfig) {
    let mut known_files = HashSet::new();

    loop {
        // Получаване на текущия ден от седмицата
        let current_day = get_current_weekday();
        // Получаване на текущия час
        let current_hour = get_current_hour();

        // Проверка дали текущият ден и час са в зададените интервали
        if config.days.contains(&current_day) && is_within_hours(&config.hours, current_hour) {
            let path = Path::new(&config.path);
            if path.exists() {
                let entries = fs::read_dir(path).unwrap();
                for entry in entries {
                    let entry = entry.unwrap();
                    let file_path = entry.path();

                    if !known_files.contains(&file_path) {
                        log_message(&format!("New file detected: {:?}", file_path)).unwrap();
                        // Тук можете да добавите логика за изпращане на нотификация
                        known_files.insert(file_path);
                    }
                }
            } else {
                log_message(&format!("Directory does not exist: {}", config.path)).unwrap();
            }
        }

        // Пауза за определеното време
        tokio::time::sleep(Duration::from_secs(config.frequency as u64)).await;
    }
}

// Получаване на текущия ден от седмицата
fn get_current_weekday() -> String {
    let start = SystemTime::now();
    let since_the_epoch = start.duration_since(UNIX_EPOCH).expect("Time went backwards");
    let days_since_epoch = (since_the_epoch.as_secs() / 86400) % 7;
    // Преобразуване на дни в седмицата (Подразбирайки, че началото на епохата е четвъртък)
    match days_since_epoch {
        0 => "Thursday".to_string(),
        1 => "Friday".to_string(),
        2 => "Saturday".to_string(),
        3 => "Sunday".to_string(),
        4 => "Monday".to_string(),
        5 => "Tuesday".to_string(),
        _ => "Wednesday".to_string(),
    }
}

// Получаване на текущия час
fn get_current_hour() -> u32 {
    let start = SystemTime::now();
    let since_the_epoch = start.duration_since(UNIX_EPOCH).expect("Time went backwards");
    let in_seconds = since_the_epoch.as_secs();
    let hours = (in_seconds / 3600) % 24;
    hours as u32
}

fn is_within_hours(hours: &str, current_hour: u32) -> bool {
    let parts: Vec<&str> = hours.split('-').collect();
    if parts.len() == 2 {
        if let (Ok(start), Ok(end)) = (parts[0].parse::<u32>(), parts[1].parse::<u32>()) {
            return current_hour >= start && current_hour < end;
        }
    }
    false
}