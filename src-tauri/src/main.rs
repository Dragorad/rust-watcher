
// mod config {
//     pub mod directory_crud_manager;
//     pub mod directory_paths_config;
//     pub mod app_configs;
// }

// mod storage {
//     pub mod json;
// }

// mod watcher {
//     pub mod monitor;
// }
// mod utilities;

// use tauri::{generate_context, Builder, RunEvent};
// use tauri_plugin_log::{Builder as LogBuilder, LogLevel, Target, TargetKind};
// use tauri_plugin_fs::FsExt;

// use crate::config::directory_crud_manager::{
//     add_directory, delete_directory, get_directories, update_directory,
// };
// use crate::config::directory_paths_config::{
//     ensure_config_file_exists, load_network_and_local_configs, save_local_config,
//     save_network_config,
// };

// use crate::config::app_configs::{initialize_config_files, load_app_config, save_app_config};

// fn main() {
//     let log_plugin = LogBuilder::new()
//         .clear_targets()
//         .target(Target::new(TargetKind::Stdout))
//         .target(Target::new(TargetKind::Folder {
//             path: std::path::PathBuf::from("logs"),
//             file_name: Some("app.log".to_string()),
//         }))
//         .build();

//     Builder::default()
//         .plugin(tauri_plugin_dialog::init())
//         .plugin(tauri_plugin_fs::init())
//         .plugin(log_plugin)
//         .setup(|app| {
//             // Конфигуриране на достъпа до файловата система
//             let scope = app.fs_scope();
            
//             // Разрешаваме достъп до config_files директорията
//             scope.allow_directory("config_files", true)?;
            
//             utilities::log_message(LogLevel::Info, "Application has started");
//             Ok(())
//         })
//         .invoke_handler(tauri::generate_handler![
//             add_directory,
//             get_directories,
//             update_directory,
//             delete_directory,
//             load_network_and_local_configs,
//             save_network_config,
//             save_local_config,
//             load_app_config,
//             save_app_config,
//             ensure_config_file_exists
//         ])
//         .on_window_event(|_app_handle, event| {
//             if let tauri::WindowEvent::CloseRequested { api, .. } = event {
//                 utilities::log_message(LogLevel::Info, "Window close requested");
//             }
//         })
//         .build(generate_context!())
//         .expect("error while building tauri application")
//         .run(|_app_handle, event| match event {
//             RunEvent::Exit => {
//                 println!("Application is shutting down");
//                 utilities::log_message(LogLevel::Info, "Application is shutting down");
//             }
//             RunEvent::ExitRequested { api, .. } => {
//                 println!("Exit requested");
//                 utilities::log_message(LogLevel::Info, "Exit requested");
//                 api.prevent_exit();
//             }
//             _ => {}
//         });
// }


mod config {
    pub mod app_configs;
    pub mod directory_crud_manager;
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
use tauri_plugin_fs::FsExt;

// Импортираме всички нужни функции от app_configs
use crate::config::app_configs::{
    initialize_config_files,
    load_app_config,
    save_app_config,
    load_network_and_local_configs,
    save_network_config,
    save_local_config,
    ensure_config_file_exists
};

// Импортираме CRUD операциите
use crate::config::directory_crud_manager::{
    add_directory,
    get_directories,
    update_directory,
    delete_directory,
};

fn setup_logging() -> tauri_plugin_log::Builder {
    LogBuilder::new()
        .clear_targets()
        .target(Target::new(TargetKind::Stdout))
        .target(Target::new(TargetKind::Folder {
            path: std::path::PathBuf::from("logs"),
            file_name: Some("app.log".to_string()),
        }))
}

fn main() {
    let log_plugin = setup_logging().build();

    Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(log_plugin)
        .setup(|app| {
            // Инициализация на конфигурацията
            if let Err(e) = initialize_config_files() {
                utilities::log_message(LogLevel::Error, &format!("Грешка при инициализация: {}", e));
                return Err(e.into());
            }
            
            // Конфигуриране на достъпа до файловата система
            let scope = app.fs_scope();
            scope.allow_directory("config_files", true)?;
            
            utilities::log_message(LogLevel::Info, "Приложението е стартирано успешно");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Команди за конфигурация
            load_app_config,
            save_app_config,
            load_network_and_local_configs,
            save_network_config,
            save_local_config,
            ensure_config_file_exists,
            
            // CRUD операции
            add_directory,
            get_directories,
            update_directory,
            delete_directory,
        ])
        .on_window_event(|_app_handle, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                utilities::log_message(LogLevel::Info, "Заявка за затваряне на прозореца");
            }
        })
        .build(generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| match event {
            RunEvent::Exit => {
                utilities::log_message(LogLevel::Info, "Приложението се затваря");
            }
            RunEvent::ExitRequested { api, .. } => {
                utilities::log_message(LogLevel::Info, "Заявка за изход");
                api.prevent_exit();
            }
            _ => {}
        });
}