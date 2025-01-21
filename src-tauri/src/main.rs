// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::command;

#[command]
fn add_directory(path: String, days: Vec<String>, hours: String, frequency: u32) {
    println!("Adding directory: {}", path);
    println!("Days: {:?}", days);
    println!("Hours: {}", hours);
    println!("Frequency: {} seconds", frequency);
    // Тук можете да добавите логика за съхранение на данните или стартиране на наблюдението
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}