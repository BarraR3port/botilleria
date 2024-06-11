// Prevents additional console window on Windows in release
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;
use tauri_plugin_log::fern::colors::{Color, ColoredLevelConfig};
use tauri_plugin_log::{RotationStrategy, TimezoneStrategy};
use tauri_plugin_log::{Target, TargetKind};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .format(move |out, message, record| {
                    let timezone_strategy = TimezoneStrategy::UseLocal.clone();
                    let format = time::format_description::parse(
                        "[[[year]-[month]-[day]][[[hour]:[minute]:[second]]",
                    )
                    .unwrap();
                    out.finish(format_args!(
                        "{}[{}][BOTILLERÍA] {}",
                        timezone_strategy.get_now().format(&format).unwrap(),
                        record.level(),
                        message
                    ))
                })
                .with_colors(ColoredLevelConfig {
                    error: Color::Red,
                    warn: Color::Yellow,
                    debug: Color::Blue,
                    info: Color::BrightGreen,
                    trace: Color::Cyan,
                })
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir { file_name: None }),
                    Target::new(TargetKind::Webview),
                ])
                .rotation_strategy(RotationStrategy::KeepAll)
                .build(),
        )
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
                //window.close_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
