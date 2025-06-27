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
import { useTranslation } from "react-i18next";
import { Switch } from "./ui/switch";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { saveData } from "@/lib/store";
import {
  ALLOW_SILENT_UPDATES_KEY,
  SETTINGS_STORE,
  TRAY_ACTIVE_KEY,
} from "@/constants/store";

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

const langs = [
  { name: "Deutsch", iso: "de" },
  { name: "English", iso: "en" },
  { name: "Español", iso: "es" },
  { name: "Norsk", iso: "no" },
] as const;

type LanguagesISO = (typeof langs)[number]["iso"];

type Props = {
  trayActive: boolean;
  setTrayActive: (active: boolean) => void;
  allowSilentUpdates: boolean;
  setAllowSilentUpdates: (allow: boolean) => void;
};

const SettingsDialog = ({
  trayActive,
  setTrayActive,
  allowSilentUpdates,
  setAllowSilentUpdates,
}: Props) => {
  const { t, i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [langSelectionOpen, setLangSelectionOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<SettingsTabs>("General");

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
                {t("GAME_SETTINGS.TITLE")}
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
                {t(`GAME_SETTINGS.${tab.toUpperCase()}.LABEL`)}
              </button>
            ))}
          </div>
          {/* Outlet Section */}
          <div className="bg-neutral-800 col-span-7 rounded-r-xl pl-8 pt-8 pb-2 select-none">
            {currentTab === "General" && (
              <>
                <h1 className="text-lg mb-5">
                  {t("GAME_SETTINGS.GENERAL.LABEL")}
                </h1>
                <div className="max-h-[385px] overflow-y-auto pr-8 pb-4 scrollbar-container">
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-400">
                      {t("GAME_SETTINGS.GENERAL.CLIENT_LANGUAGE")}
                    </p>
                    <div className="bg-neutral-700/60 w-full py-2.5 px-4 rounded-md flex items-center justify-between">
                      <p className="text-sm">
                        {t("GAME_SETTINGS.GENERAL.SELECT_LANGUAGE")}
                      </p>
                      <Select
                        value={i18n.language}
                        onValueChange={(value: LanguagesISO) =>
                          i18n.changeLanguage(value)
                        }
                        open={langSelectionOpen}
                        onOpenChange={() =>
                          setLangSelectionOpen((open) => !open)
                        }
                      >
                        <SelectTrigger
                          className="px-3 border-none"
                          size="sm"
                          selected={langSelectionOpen}
                        >
                          <SelectValue placeholder={i18n.language} />
                        </SelectTrigger>
                        <SelectContent
                          className="bg-[#353535] w-60 p-0"
                          side="bottom"
                          sideOffset={10}
                          align="end"
                        >
                          <SelectGroup className="space-y-2">
                            {langs.map((lang) => (
                              <SelectItem
                                className="focus:bg-neutral-700/90 aria-selected:text-yellow-300"
                                key={lang.iso}
                                value={lang.iso}
                                aria-selected={lang.iso === i18n.language}
                                selected={lang.iso === i18n.language}
                                onSelect={() => i18n.changeLanguage(lang.iso)}
                              >
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2 mt-5 text-sm">
                    <p className="text-neutral-400">
                      {t("GAME_SETTINGS.GENERAL.CLOSE_SETTINGS")}
                    </p>
                    <div className="bg-neutral-700/60 w-full p-4 rounded-md space-y-4">
                      <p>{t("GAME_SETTINGS.GENERAL.CLOSE_WINDOW")}</p>
                      <RadioGroup
                        defaultValue="0"
                        value={trayActive ? "0" : "1"}
                        onValueChange={(value) => {
                          setTrayActive(value === "0");
                          saveData(SETTINGS_STORE, TRAY_ACTIVE_KEY, value);
                        }}
                      >
                        <RadioGroupItem
                          id="minimize"
                          value="0"
                          className="data-[state=checked]:border-yellow-300"
                        >
                          <label htmlFor="minimize">
                            {t("GAME_SETTINGS.GENERAL.MINIMIZE_WINDOW")}{" "}
                            <span className="ml-1.5 bg-neutral-500/70 px-1 rounded-sm">
                              {t("GAME_SETTINGS.GENERAL.RECOMENDED")}
                            </span>
                          </label>
                        </RadioGroupItem>
                        <RadioGroupItem
                          id="close"
                          value="1"
                          className="data-[state=checked]:border-yellow-300"
                        >
                          <label htmlFor="close">
                            {t("GAME_SETTINGS.GENERAL.CLOSE_WINDOW")}
                          </label>
                        </RadioGroupItem>
                      </RadioGroup>
                    </div>
                  </div>
                  <div className="space-y-2 mt-5">
                    <p className="text-sm text-neutral-400">
                      {t("GAME_SETTINGS.GENERAL.LAUNCHER_UPDATE")}
                    </p>
                    <div className="bg-neutral-700/60 w-full p-4 rounded-md flex items-center gap-4">
                      <div className="space-y-1">
                        <p className="text-sm">
                          {t("GAME_SETTINGS.GENERAL.ALLOW_SILENT_UPDATES")}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {t("GAME_SETTINGS.GENERAL.ALLOW_SILENT_UPDATES_TEXT")}
                        </p>
                      </div>
                      <Switch
                        checked={allowSilentUpdates}
                        onCheckedChange={(val: boolean) => {
                          setAllowSilentUpdates(val);
                          saveData(
                            SETTINGS_STORE,
                            ALLOW_SILENT_UPDATES_KEY,
                            val ? "1" : "0"
                          );
                        }}
                        className="outline-2 outline-neutral-500 hover:data-[state=unchecked]:outline-neutral-400 data-[state=checked]:outline-green-300/75"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {currentTab === "Download" && (
              <>
                <h1 className="text-lg">{t("GAME_SETTINGS.DOWNLOAD.LABEL")}</h1>
                <div>
                  <p>Download Speed</p>
                </div>
              </>
            )}
            {currentTab === "Notifications" && (
              <>
                <h1 className="text-lg">
                  {t("GAME_SETTINGS.NOTIFICATIONS.LABEL")}
                </h1>
              </>
            )}
            {currentTab === "Tools" && (
              <>
                <h1 className="text-lg">{t("GAME_SETTINGS.TOOLS.LABEL")}</h1>
              </>
            )}
            {currentTab === "About" && (
              <>
                <h1 className="text-lg">{t("GAME_SETTINGS.ABOUT.LABEL")}</h1>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
