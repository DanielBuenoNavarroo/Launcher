import { Minus, X } from "lucide-react";
import SettingsDialog from "./settigns-dialog";
import { hideLauncher } from "@/commands";
import { getCurrentWindow } from "@tauri-apps/api/window";

type Props = {
  trayActive: boolean;
  setTrayActive: (active: boolean) => void;
  allowSilentUpdates: boolean;
  setAllowSilentUpdates: (allow: boolean) => void;
};

const TopBar = ({
  trayActive,
  setTrayActive,
  allowSilentUpdates,
  setAllowSilentUpdates,
}: Props) => {
  return (
    <div
      data-tauri-drag-region
      className="w-full fixed rounded-t-md flex justify-end py-2 gap-4 px-4 z-50 top-0 right-0"
    >
      <SettingsDialog
        trayActive={trayActive}
        setTrayActive={setTrayActive}
        allowSilentUpdates={allowSilentUpdates}
        setAllowSilentUpdates={setAllowSilentUpdates}
      />
      <button
        className="bg-transparent hover:bg-black/30 p-1 rounded-md text-white"
        onClick={() => {
          const currentWindow = getCurrentWindow();
          currentWindow.minimize();
        }}
      >
        <Minus size={20} />
      </button>
      <button
        className="bg-transparent hover:bg-red-500/80 p-1 rounded-md text-white"
        onClick={() => {
          if (trayActive) {
            hideLauncher();
          } else {
            const currentWindow = getCurrentWindow();
            currentWindow.close();
          }
        }}
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default TopBar;
