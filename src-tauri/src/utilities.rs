use log::{debug, error, info, warn};
use tauri_plugin_log::LogLevel;

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
