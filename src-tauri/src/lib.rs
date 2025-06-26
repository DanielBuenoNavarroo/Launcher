mod common;

use crate::common::MAIN_WINDOW_LABEL;

use lazy_static::lazy_static;
use std::fs;
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager, PhysicalPosition, Runtime, WebviewWindow};

lazy_static! {
    static ref PREVIOUS_MONITOR_NAME: Mutex<Option<String>> = Mutex::new(None);
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn create_dir() -> Result<(), String> {
    fs::File::create("prueba.txt").expect("Error al crear el archivo");
    Ok(())
}

#[tauri::command]
async fn show_launcher<R: Runtime>(app_handle: AppHandle<R>) {
    if let Some(window) = app_handle.get_webview_window(MAIN_WINDOW_LABEL) {
        move_window_to_active_monitor(&window);

        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();

        let _ = app_handle.emit("show-coco", ());
    }
}

#[tauri::command]
async fn hide_launcher<R: Runtime>(app: AppHandle<R>) {
    if let Some(window) = app.get_webview_window(MAIN_WINDOW_LABEL) {
        if let Err(err) = window.hide() {
            log::error!("Failed to hide the window: {}", err);
        } else {
            log::debug!("Window successfully hidden.");
        }
    } else {
        log::error!("Main window not found.");
    }
}

fn move_window_to_active_monitor<R: Runtime>(window: &WebviewWindow<R>) {
    let available_monitors = match window.available_monitors() {
        Ok(monitors) => monitors,
        Err(e) => {
            log::error!("Failed to get monitors: {}", e);
            return;
        }
    };

    let cursor_position = match window.cursor_position() {
        Ok(pos) => Some(pos),
        Err(e) => {
            log::error!("Failed to get cursor position: {}", e);
            None
        }
    };

    let target_monitor = if let Some(cursor_position) = cursor_position {
        let cursor_x = cursor_position.x.round() as i32;
        let cursor_y = cursor_position.y.round() as i32;

        available_monitors.into_iter().find(|monitor| {
            let monitor_position = monitor.position();
            let monitor_size = monitor.size();

            cursor_x >= monitor_position.x
                && cursor_x <= monitor_position.x + monitor_size.width as i32
                && cursor_y >= monitor_position.y
                && cursor_y <= monitor_position.y + monitor_size.height as i32
        })
    } else {
        None
    };

    let monitor = match target_monitor.or_else(|| window.primary_monitor().ok().flatten()) {
        Some(monitor) => monitor,
        None => {
            log::error!("No monitor found!");
            return;
        }
    };

    if let Some(name) = monitor.name() {
        let previous_monitor_name = PREVIOUS_MONITOR_NAME.lock().unwrap();

        if let Some(ref prev_name) = *previous_monitor_name {
            if name.to_string() == *prev_name {
                log::debug!("Currently on the same monitor");

                return;
            }
        }
    }

    let monitor_position = monitor.position();
    let monitor_size = monitor.size();

    // Get the current size of the window
    let window_size = match window.inner_size() {
        Ok(size) => size,
        Err(e) => {
            log::error!("Failed to get window size: {}", e);
            return;
        }
    };

    let window_width = window_size.width as i32;
    let window_height = window_size.height as i32;

    let window_x = monitor_position.x + (monitor_size.width as i32 - window_width) / 2;
    let window_y = monitor_position.y + (monitor_size.height as i32 - window_height) / 2;

    if let Err(e) = window.set_position(PhysicalPosition::new(window_x, window_y)) {
        log::error!("Failed to move window: {}", e);
    }

    if let Some(name) = monitor.name() {
        log::debug!("Window moved to monitor: {}", name);

        let mut previous_monitor = PREVIOUS_MONITOR_NAME.lock().unwrap();
        *previous_monitor = Some(name.to_string());
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            create_dir,
            show_launcher,
            hide_launcher
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
