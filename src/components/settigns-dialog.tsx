import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Cog, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type SettingsTabs =
  | "General"
  | "Download"
  | "Notifications"
  | "Tools"
  | "About";

const tabs: SettingsTabs[] = [
  "General",
  "Download",
  "Notifications",
  "Tools",
  "About",
];

type Languages = "Español" | "English" | "Norsk" | "Deutsch";

const langs: Languages[] = ["Deutsch", "English", "Español", "Norsk"];

const SettingsDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langSelectionOpen, setLangSelectionOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<SettingsTabs>("General");
  const [currentLang, setCurrentLang] = useState<Languages>("English");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => setIsOpen((open) => !open)}
      modal={false}
    >
      <DialogTrigger asChild>
        <button className="bg-transparent hover:bg-black/30 p-1 rounded-md text-white">
          <Cog size={20} />
        </button>
      </DialogTrigger>
      <DialogContent
        className="min-w-full min-h-full bg-black/30 flex items-center justify-center rounded-sm"
        showCloseButton={false}
      >
        <div
          className="absolute bg-transparent w-full h-10 top-0"
          data-tauri-drag-region
        />
        <div className="bg-neutral-800 w-2/3 h-[475px] rounded-xl border border-white/40 relative grid grid-cols-10">
          {/* Close Button */}
          <button
            className="absolute right-2 top-2 hover:bg-neutral-700/80 p-1 rounded-sm transition-colors duration-200 text-neutral-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
          {/* Navigation Section */}
          <div className="bg-neutral-900/50 col-span-3 rounded-l-xl px-4 py-8 space-y-1">
            <DialogHeader>
              <DialogTitle className="text-neutral-300/75 text-lg px-4 pb-2">
                Settings
              </DialogTitle>
            </DialogHeader>
            {tabs.map((tab) => (
              <button
                key={tab}
                className={cn(
                  "text-sm p-2 pl-4 rounded-md w-full text-left",
                  currentTab === tab
                    ? "bg-neutral-700/60"
                    : "hover:bg-neutral-700/30"
                )}
                onClick={() => currentTab !== tab && setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Outlet Section */}
          <div className="bg-neutral-800 col-span-7 rounded-r-xl px-8 pt-8 pb-2">
            {currentTab === "General" && (
              <>
                <h1 className="text-lg mb-5">General</h1>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-400">Client Language</p>
                  <div className="bg-neutral-700/60 w-full py-2.5 px-4 rounded-md flex items-center justify-between">
                    <p className="text-sm">Language Selection</p>
                    <Select
                      value={currentLang}
                      onValueChange={(value: Languages) =>
                        setCurrentLang(value)
                      }
                      open={langSelectionOpen}
                      onOpenChange={() => setLangSelectionOpen((open) => !open)}
                    >
                      <SelectTrigger
                        className="px-3 border-none"
                        size="sm"
                        selected={langSelectionOpen}
                      >
                        <SelectValue placeholder={currentLang} />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800" side="left">
                        <SelectGroup>
                          {langs.map((lang) => (
                            <SelectItem
                              className="focus:bg-neutral-700/60 aria-selected:text-yellow-300"
                              key={lang}
                              value={lang}
                              aria-selected={lang === currentLang}
                            >
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
            {currentTab === "Download" && (
              <>
                <h1 className="text-lg">Download</h1>
                <div>
                  <p>Download Speed</p>
                </div>
              </>
            )}
            {currentTab === "Notifications" && (
              <>
                <h1 className="text-lg">Notifications</h1>
              </>
            )}
            {currentTab === "Tools" && (
              <>
                <h1 className="text-lg">Tools</h1>
              </>
            )}
            {currentTab === "About" && (
              <>
                <h1 className="text-lg">About</h1>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
