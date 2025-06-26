import { showLauncher } from "@/commands";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { resolveResource } from "@tauri-apps/api/path";
import { TrayIcon, TrayIconOptions } from "@tauri-apps/api/tray";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";

const TRAY_ID = "LAUNCHER_TRAY";

export const useTray = (active: boolean) => {
  useEffect(() => {
    if (active) {
      updateTrayMenu();
    } else {
      TrayIcon.getById(TRAY_ID).then((tray) => tray?.close());
    }
  }, [active]);

  const getTrayById = () => {
    return TrayIcon.getById(TRAY_ID);
  };

  const createTrayIcon = async () => {
    const tray = await getTrayById();

    if (!tray) {
      const menu = await getTrayMenu();

      const iconPath = await resolveResource("icons/icon.ico");

      const options: TrayIconOptions = {
        id: TRAY_ID,
        icon: iconPath,
        iconAsTemplate: false,
        menu,
      };

      await TrayIcon.new(options);
    }
  };

  const getTrayMenu = async () => {
    const items = await Promise.all([
      MenuItem.new({
        text: "Show Launcher",
        action: () => {
          showLauncher();
        },
      }),
      PredefinedMenuItem.new({ item: "Separator" }),
      MenuItem.new({
        text: "Quit",
        action: () => {
          const currentWindow = getCurrentWindow();
          currentWindow.close();
        },
      }),
    ]);

    return Menu.new({ items });
  };

  const updateTrayMenu = async () => {
    const tray = await getTrayById();

    if (!tray) {
      console.log("no tray");
      return createTrayIcon();
    }

    const menu = await getTrayMenu();

    tray.setMenu(menu);
  };
};
