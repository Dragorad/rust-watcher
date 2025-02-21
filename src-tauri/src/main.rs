mod config {
    pub mod directory_crud_manager;
    pub mod directory_paths_config;
    pub mod app_configs;
}

mod storage {
    pub mod json;
}

mod watcher {
    pub mod monitor;
}
mod utilities;

use tauri::{generate_context, Builder, RunEvent};
use tauri_plugin_log::{Builder as LogBuilder, LogLevel, Target, TargetKind};

use crate::config::directory_crud_manager::{
    add_directory, delete_directory, get_directories, update_directory,
};
use crate::config::directory_paths_config::{
    ensure_config_file_exists, load_network_and_local_configs, save_local_config,
    save_network_config,
};

use crate::config::app_configs::{initialize_config_files, load_app_config, save_app_config};


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
        // Използване на плъгините
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(log_plugin)
        .invoke_handler(tauri::generate_handler![
            add_directory,
            get_directories,
            update_directory,
            delete_directory,
            load_network_and_local_configs,
            save_network_config,
            save_local_config,
            load_app_config,
            save_app_config,
            ensure_config_file_exists
        ])
        .setup(|_app_handle| {
            utilities::log_message(LogLevel::Info, "Application has started");
            Ok(())
        })
        .on_window_event(|_app_handle, event| {
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
