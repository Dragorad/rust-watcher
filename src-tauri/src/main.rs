mod config {
    pub mod directory;
}

mod storage {
    pub mod json;
}

mod watcher {
    pub mod monitor;
}
mod utilities;

use tauri::{Builder, generate_context, RunEvent};
use tauri_plugin_log::{Target, Builder as LogBuilder, LogLevel, TargetKind};

use crate::config::directory::{load_configs_from_file, save_configs_to_file, DirectoryConfig};
use tauri::command;

const CONFIG_FILE: &str = "directory_configs.json";

#[command]
fn add_directory(
    path: String,
    days: Vec<String>,
    hours: String,
    frequency: u32,
) -> Result<(), String> {
    let mut configs = load_configs_from_file(CONFIG_FILE).map_err(|e| e.to_string())?;
    let new_config = DirectoryConfig::new(path, days, hours, frequency);
    configs.push(new_config);
    save_configs_to_file(&configs, CONFIG_FILE).map_err(|e| e.to_string())?;
    Ok(())
}


fn main() {
    let log_plugin = LogBuilder::new()
        .clear_targets()
        .target(Target::new(TargetKind::Stdout))
        .target(Target::new(TargetKind::Folder {
            path: std::path::PathBuf::from("logs"),
            file_name: Some("app.log".to_string()),
        }))
        .build();

    Builder::default()
        .plugin(log_plugin)
        .setup(|_app_handle| {
            utilities::log_message(LogLevel::Info, "Application has started");
            Ok(())
        })
        .on_window_event(|app_handle, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                utilities::log_message(LogLevel::Info, "Window close requested");
            }
        })
        .build(generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| match event {
            RunEvent::Exit => {
                println!("Application is shutting down");
                utilities::log_message(LogLevel::Info, "Application is shutting down");
            }
            RunEvent::ExitRequested { api, .. } => {
                println!("Exit requested");
                utilities::log_message(LogLevel::Info, "Exit requested");
                api.prevent_exit();
            }
            _ => {}
        });
}
