use tauri_plugin_log::LogLevel;
use log::{info, warn, error, debug};

pub fn log_message(level: LogLevel, message: &str) {
    match level {
        LogLevel::Info => info!("{}", message),
        LogLevel::Warn => warn!("{}", message),
        LogLevel::Error => error!("{}", message),
        LogLevel::Debug => debug!("{}", message),
        // Може да добавите и други нива, ако е необходимо
        _ => info!("{}", message),
    }
}