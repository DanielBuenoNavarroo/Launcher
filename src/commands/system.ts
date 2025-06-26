import { invoke } from "@tauri-apps/api/core";

export function showLauncher(): Promise<void> {
  return invoke("show_launcher");
}

export function hideLauncher(): Promise<void> {
  return invoke("hide_launcher");
}
