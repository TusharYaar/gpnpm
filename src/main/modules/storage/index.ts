import fs from "fs";
import AppSettings from "./AppSettings";

import { APP_SETTINGS_FILE_PATH } from "../../constants";
import { updateStore } from "../../index";
import { ipcMain } from "electron";

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
  for (const _package in packages) {
    if (APP_SETTINGS.allPackages[_package]) {
      if (!APP_SETTINGS.allPackages[_package].includes(file)) APP_SETTINGS.allPackages[_package].push(file);
    } else APP_SETTINGS.allPackages[_package] = [file];
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

getAppSettings(true);
