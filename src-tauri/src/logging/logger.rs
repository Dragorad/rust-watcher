// src/logging/logger.rs

use std::fs::OpenOptions;
use std::io::prelude::*;
use std::io::Result;

pub fn log_message(message: &str) -> Result<()> {
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open("app.log")?;
    writeln!(file, "{}", message)?;
    Ok(())
}