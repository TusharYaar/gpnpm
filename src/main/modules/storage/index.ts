import fs from "fs";
import AppSettings from "./AppSettings";

import { APP_SETTINGS_FILE_PATH } from "../../constants";

let APP_SETTINGS = new AppSettings();

export const updateAppSettings = async (settings?: AppSettings) => {
  const modified = new Date();
  if (settings) {
    APP_SETTINGS.modified = modified;
    fs.writeFileSync(APP_SETTINGS_FILE_PATH, JSON.stringify({ ...settings, modified }, null, 4));
  } else {
    fs.writeFileSync(APP_SETTINGS_FILE_PATH, JSON.stringify(APP_SETTINGS, null, 4));
  }
};

export const getAppSettings = (readFromFile = false) => {
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
  APP_SETTINGS = settings;
};

export const addNewFoldersToStorage = (folders: string[]) => {
  console.log(folders);
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

getAppSettings(true);
