import { useEffect, useState } from "react";
import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { Button, buttonVariants } from "./components/ui/button";
import { path } from "@tauri-apps/api";
import { BaseDirectory, create, exists } from "@tauri-apps/plugin-fs";
import { open } from "@tauri-apps/plugin-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "./lib/utils";

function App() {
  const [selectedPath, setSelectedPath] = useState("");
  const [fullPath, setFullPath] = useState("");

  const gameName = "eljuego";

  useEffect(() => {
    const getPath = async () => {
      const basePath = await path.documentDir();
      setFullPath(await path.join(basePath, "carpeta"));
      console.log(fullPath);
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
    const fileName = "pruebas.txt";
    const existsFile = await exists(fileName, {
      baseDir: BaseDirectory.AppData,
    });

    if (!existsFile) {
      await create(fileName, { baseDir: BaseDirectory.AppData });
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="min-h-svh w-full flex items-center justify-center gap-4">
        <Dialog>
          <DialogTrigger className={cn(buttonVariants())}>
            Install
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
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </ThemeProvider>
  );
}

export default App;
