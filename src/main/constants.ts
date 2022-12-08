import { app } from "electron";
import path from "path";

export const APP_SETTINGS_FILE_NAME = "settings.json";
export const APP_SETTINGS_FILE_PATH = path.join(app.getPath("appData"), "gpnpm", APP_SETTINGS_FILE_NAME);

export const EXCLUDED_FOLDERS = [".git", ".vscode", "node_modules"];
