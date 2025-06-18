import "./App.css";
import { useEffect, useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { Button, buttonVariants } from "./components/ui/button";
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
import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";

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

  const gameName = "eljuego";

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
      <main className="min-h-svh w-full flex flex-col items-center justify-center gap-4">
        <Dialog open={isOpen} onOpenChange={() => setIsOpen((open) => !open)}>
          <DialogTrigger asChild>
            <button className={cn(buttonVariants())}>Install</button>
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
        {status === "PENDING" && (
          <Progress value={progress} className="w-1/2" />
        )}
        <button className="bg-yellow-300 flex justify-between items-center gap-4 pl-3 pr-6 py-3 rounded-full">
          <div className="bg-black size-8 rounded-full relative overflow-hidden">
            {/* <ArrowDown
              className="text-yellow-300 absolute left-1/2 top-1/2 transform -translate-1/2"
              size={17}
              strokeWidth={5}
            />
            <ArrowDown
              className="text-yellow-300 absolute left-1/2 top-[-100%] transform -translate-x-1/2"
              size={17}
              strokeWidth={5}
              style={{ animationDelay: "0.5s" }}
            /> */}
            <motion.div
              className="absolute left-1/2 top-1/2 text-yellow-300 -translate-1/2"
              animate={{
                y: ["-150%", "15%", "0", "0", "-15%", "150%"],
                opacity: 1,
              }}
              transition={{
                duration: 1.6,
                times: [0, 0.3, 0.5, 1.1, 1.2, 1.5],
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            >
              <ArrowDown size={17} strokeWidth={5} />
            </motion.div>
          </div>
          <p className="text-black text-xl font-bold">Actualizar juego</p>
        </button>
      </main>
    </ThemeProvider>
  );
}

export default App;
