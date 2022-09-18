import { app } from "electron";
import fs from "fs";
import path from "path";
import AppSettings from "./AppSettings";

export let APP_SETTINGS = new AppSettings();
const APP_SETTINGS_FILE_NAME = "settings.json";
const APP_SETTINGS_FILE_PATH = path.join(app.getPath("appData"), "gpnpm", APP_SETTINGS_FILE_NAME);

export const updateAppSettings = async (settings?: AppSettings) => {
  const modified = new Date();
  if (settings) {
    APP_SETTINGS.modified = modified;
    fs.writeFileSync(APP_SETTINGS_FILE_PATH, JSON.stringify({ ...settings, modified }));
  } else {
    fs.writeFileSync(APP_SETTINGS_FILE_PATH, JSON.stringify({ APP_SETTINGS }));
  }
};

export const getAppSettings = () => {
  const settingsExist = fs.existsSync(APP_SETTINGS_FILE_PATH);
  let settings: AppSettings;

  if (settingsExist) {
    const buffer = fs.readFileSync(APP_SETTINGS_FILE_PATH, "utf-8");
    settings = JSON.parse(buffer.toString()) as AppSettings;
  } else {
    settings = new AppSettings();
    fs.writeFile(APP_SETTINGS_FILE_PATH, JSON.stringify(settings), () => console.log("created"));
  }
  APP_SETTINGS = settings;
  return settings;
};

export const addNewProjectFolder = (folder: string) => {
  const alreadyExists = APP_SETTINGS.projectFolders.findIndex((f) => f === folder);
  if (alreadyExists) return false;
  else APP_SETTINGS.addProjectFolder(folder);
  updateAppSettings();
  return true;
};
