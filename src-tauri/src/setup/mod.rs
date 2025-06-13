use tauri::{App, WebviewWindow};

#[cfg(target_os = "windows")]
mod windows;

#[cfg(target_os = "windows")]
pub use windows::*;

pub fn default(app: &mut App, main_window: WebviewWindow, settings_window: WebviewWindow) {
    #[cfg(debug_assertions)]
    main_window.open_devtools();

    platform(app, main_window.clone(), settings_window.clone());
}
