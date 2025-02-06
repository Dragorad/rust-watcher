mod config {
    pub mod directory_crud_manager;
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

use crate::config::directory_crud_manager::{
    add_directory, get_directories, update_directory, delete_directory,
};

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
        .invoke_handler(tauri::generate_handler![
            add_directory,
            get_directories,
            update_directory,
            delete_directory
        ])
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