import "./App.css";
import { Suspense, useEffect, useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { path } from "@tauri-apps/api";
import { exists, mkdir } from "@tauri-apps/plugin-fs";
import { open } from "@tauri-apps/plugin-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "./lib/utils";
import { download } from "@tauri-apps/plugin-upload";
import { Progress } from "./components/ui/progress";
import AnimatedDownloadIcon from "./components/animated-download";
import { AlignJustify, Minus, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { getCurrentWindow } from "@tauri-apps/api/window";
import SettingsDialog from "./components/settigns-dialog";
import { hideLauncher } from "./commands";
import { useTray } from "./hooks/useTray";
import { getData } from "./lib/store";
import { SETTINGS_STORE, TRAY_ACTIVE_KEY } from "./constants/store";

type statusTypes =
  | "PENDING"
  | "FAILED"
  | "CANCELLED"
  | "PAUSED"
  | "PROCESSING"
  | "READY"
  | "ERROR"
  | "READY_TO_INSTALL";

function App() {
  const [selectedPath, setSelectedPath] = useState("");
  const [fullPath, setFullPath] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<statusTypes>("READY_TO_INSTALL");
  const [totalSize, setTotalSize] = useState(0);
  const [progress, setProgres] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverMenu, setHoverMenu] = useState(false);
  const [trayActive, setTrayActive] = useState(false);

  const gameName = "eljuego";

  useTray(trayActive);

  useEffect(() => {
    const getTrayActive = async () => {
      const tray = await getData(SETTINGS_STORE, TRAY_ACTIVE_KEY);
      setTrayActive(tray === "0");
    };

    getTrayActive();
  }, []);

  useEffect(() => {
    const getPath = async () => {
      const basePath = await path.documentDir();
      setFullPath(await path.join(basePath, "carpeta"));
    };

    getPath();
  }, []);

  const selectFile = async () => {
    const file = await open({
      multiple: false,
      directory: true,
    });

    if (file) setSelectedPath(file);
  };

  const handleClick = async () => {
    let file;

    setIsOpen(false);
    const finalPath = await path.join(
      selectedPath ? selectedPath : fullPath,
      gameName
    );
    const fileExists = await exists(finalPath);

    if (!fileExists) {
      file = await mkdir(finalPath);
    }

    console.log("Descarga iniciada");

    const finalArchive = await path.join(finalPath, "0.0.1.zip");

    let totalDownloaded = 0;

    setStatus("PENDING");

    download(
      "http://192.168.1.139:3000/api/videogame",
      finalArchive,
      ({ progress, total }) => {
        if (totalSize === 0) setTotalSize(total);
        totalDownloaded += progress;
        console.log(`Downloaded ${totalDownloaded} of ${total} bytes`);
        setProgres((totalDownloaded / total) * 100);
      }
    )
      .then(() => {
        console.log("¡Descarga completada!");
        setStatus("READY");
      })
      .catch((err) => {
        console.error("Error al descargar:", err);
        setStatus("ERROR");
      });
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Suspense fallback={<div>Loading...</div>}>
        <div
          data-tauri-drag-region
          className="w-full fixed rounded-t-md flex justify-end py-2 gap-4 px-4 z-50 top-0 right-0"
        >
          <SettingsDialog
            trayActive={trayActive}
            setTrayActive={setTrayActive}
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
              const currentWindow = getCurrentWindow();
              // currentWindow.close();
              hideLauncher();
            }}
          >
            <X size={20} />
          </button>
        </div>
        <main className="h-full w-full flex flex-col items-center justify-center gap-4">
          {status === "PENDING" && (
            <Progress value={progress} className="w-1/2" />
          )}
          <div className="absolute bottom-14 right-16 flex gap-2">
            <Dialog
              open={isOpen}
              onOpenChange={() => setIsOpen((open) => !open)}
              modal={false}
            >
              <DialogTrigger asChild>
                <button
                  className="min-w-56! bg-yellow-300 hover:bg-neutral-900 flex justify-between items-center gap-4 pl-3 pr-6 py-3 rounded-full cursor-pointer! transition-colors duration-200 text-black hover:text-yellow-300"
                  onMouseEnter={() => {
                    setIsHovered(true);
                  }}
                  onMouseLeave={() => {
                    setIsHovered(false);
                  }}
                >
                  <AnimatedDownloadIcon isHovered={isHovered} />
                  <p className="w-full text-xl font-bold text-center select-none">
                    {status === "READY" && "Jugar"}
                    {status === "READY_TO_INSTALL" && "Instalar juego"}
                    {status === "PENDING" && "Iniciando descarga"}
                  </p>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900">
                <DialogHeader>
                  <DialogTitle className="uppercase text-center text-sm">
                    Choose install location
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-2">
                  <p className="text-foreground/75 font-normal">Folder</p>
                  <div className="flex gap-2 mt-1">
                    <p className="w-full text-sm border-2 border-neutral-500 rounded-md px-4 py-2">
                      {selectedPath ? selectedPath : fullPath}
                    </p>
                    <Button
                      variant={"ghost"}
                      size={"sm"}
                      className="px-6 hover:bg-neutral-300! hover:text-black transition-colors duration-[400ms]"
                      onClick={selectFile}
                    >
                      Browse
                    </Button>
                  </div>
                  <p className="text-xs text-foreground/75 mt-4">
                    Path: {selectedPath ? selectedPath : fullPath}\{gameName}
                  </p>
                  <Button onClick={handleClick}>Añadir</Button>
                </div>
              </DialogContent>
            </Dialog>
            <DropdownMenu
              open={hoverMenu}
              onOpenChange={() => setHoverMenu((open) => !open)}
              modal={false}
            >
              <DropdownMenuTrigger
                className={cn(
                  "rounded-full p-3 size-14 flex items-center justify-center transition-colors duration-200",
                  hoverMenu
                    ? "bg-neutral-800 text-neutral-200"
                    : "bg-neutral-700 text-neutral-400"
                )}
              >
                <AlignJustify className="" strokeWidth={2.5} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="top"
                className="mb-3 bg-neutral-800 space-y-2"
                onMouseLeave={() => setHoverMenu(false)}
              >
                <div className="w-full text-left p-2 hover:bg-neutral-400/20 rounded-sm text-sm cursor-default">
                  Ajustes del juego
                </div>
                {/* <GameSettings
                isOpen={gameSettingsOpen}
                setIsOpen={setGameSettingsOpen}
              /> */}
                <div className="p-2 hover:bg-neutral-400/20 rounded-sm text-sm cursor-default">
                  Buscar actualizaciones
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </main>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
