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

export const addNewProjectFolders = (folders: string[]) => {
  folders.forEach((folder) => {
    console.log(folder);
    const alreadyExists = APP_SETTINGS.projectFolders.find((f) => f === folder);
    if (!alreadyExists) {
      APP_SETTINGS.projectFolders.push(folder);
    }
  });
  updateAppSettings();
  return true;
};

getAppSettings(true);
