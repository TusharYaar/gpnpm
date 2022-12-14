import fs from "fs";
import AppSettings from "./AppSettings";

import { APP_SETTINGS_FILE_PATH } from "../../constants";
import { updateStore } from "../../index";
import { ipcMain } from "electron";
import { Package } from "../../../types";

let APP_SETTINGS = new AppSettings();

export const attachListeners = () => {
  ipcMain.handle("STORAGE:get-store", () => APP_SETTINGS);
  console.log("ATTACHED STORAGE");
};

export const updateAppSettings = async (settings?: AppSettings) => {
  const modified = new Date();
  if (settings) {
    APP_SETTINGS.modified = modified;
    fs.writeFileSync(APP_SETTINGS_FILE_PATH, JSON.stringify({ ...settings, modified }, null, 4));
  } else {
    fs.writeFileSync(APP_SETTINGS_FILE_PATH, JSON.stringify(APP_SETTINGS, null, 4));
  }
  if (updateStore) updateStore(APP_SETTINGS);
};

export const getAppSettings = (readFromFile = false, callback?: () => void) => {
  if (!readFromFile) return APP_SETTINGS;
  const settingsExist = fs.existsSync(APP_SETTINGS_FILE_PATH);
  let settings: AppSettings;
  if (settingsExist) {
    const buffer = fs.readFileSync(APP_SETTINGS_FILE_PATH, "utf-8");
    settings = JSON.parse(buffer.toString()) as AppSettings;
  } else {
    settings = new AppSettings();
    updateAppSettings();
  }
  APP_SETTINGS = { ...APP_SETTINGS, ...settings };
  if (callback) callback();
};

export const addNewFoldersToStorage = (folders: string[]) => {
  const unique = new Set([...APP_SETTINGS.folders, ...folders]);
  APP_SETTINGS.folders = Array.from(unique);
  updateAppSettings();
};

export const addNewPackages = (packages: { [key: string]: string }, file: string) => {
  // console.log(Object.values(packages));
  for (const [key, value] of Object.entries(packages)) {
    if (APP_SETTINGS.allPackages[key]) {
      if (APP_SETTINGS.allPackages[key].usedIn.findIndex((f) => f.file === file) === -1)
        APP_SETTINGS.allPackages[key].usedIn.push({ file, version: value });
    } else APP_SETTINGS.allPackages[key] = { usedIn: [{ file, version: value }], npm: null };
  }

  updateAppSettings();
};

export const addScannedFoldersToStorage = (folders: string[]) => {
  if (APP_SETTINGS.scannedFolders) APP_SETTINGS.scannedFolders.push(...folders);
  else APP_SETTINGS.scannedFolders = folders;
  updateAppSettings();
};

export const addNewProjectToStorage = (projects: string[]) => {
  if (APP_SETTINGS.projects) APP_SETTINGS.projects.push(...projects);
  else APP_SETTINGS.projects = projects;

  updateAppSettings();
};

export const addPackageDetails = (pack: string, details: any) => {
  if (APP_SETTINGS.allPackages[pack]) APP_SETTINGS.allPackages[pack].npm = details;
  else
    APP_SETTINGS.allPackages[pack] = {
      usedIn: [],
      npm: details,
    };
  updateStore(APP_SETTINGS);
};

getAppSettings(true);
