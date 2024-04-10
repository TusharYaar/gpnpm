import { app } from "electron";
import { join } from "path";

export const APP_SETTINGS_FILE_NAME = "settings.json";
export const APP_SETTINGS_FILE_PATH = join(app.getPath("appData"), "gpnpm", APP_SETTINGS_FILE_NAME);
export const APP_DATA_FILE_NAME = "app_data.json";
export const APP_DATA_FILE_PATH = join(app.getPath("appData"), "gpnpm", APP_DATA_FILE_NAME);
export const EXCLUDED_FOLDERS = [".git", ".vscode", "node_modules"];
