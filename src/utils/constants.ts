export const APP_SETTINGS_FILE_NAME = "settings.json";
// export const APP_DATA_FILE_NAME = "app_data.json";
// export const APP_DATA_FILE_PATH = join(app.getPath("appData"), "gpnpm", APP_DATA_FILE_NAME);
export const EXCLUDED_FOLDERS = [".git", ".vscode", "node_modules"];

export const DependencyUpgradeTypeMap = {
  GREATER_THAN_EQAUL: />=\d+\.\d+\.\d+/,
  LESSER_THAN_EQAUL: /<=\d+\.\d+\.\d+/,
  PATCH: /~\d+\.\d+\.\d+/,
  MINOR: /\^\d+\.\d+\.\d+/,
  ANY: /\*/,
  GREATER_THAN: />\d+\.\d+\.\d+/,
  LESSER_THAN: /<\d+\.\d+\.\d+/,
  EXACT: /.*/,
} as const;

export const NotificationTypes = {
  SETTINGS_UPDATE: "SETTINGS_UPDATE",
  APP_UPDATE_AVAILABLE: "APP_UPDATE_AVAILABLE",
  PROJECT_UPDATE_AVAILABLE: "PROJECT_UPDATE_AVAILABLE",
  NEW_PROJECT_DETECTED: "NEW_PROJECT_DETECTED",
  NEW_PROJECT_ADDED: "NEW_PROJECT_ADDED",
  PACKAGE_UPDATE_AVAILABLE: "PACKAGE_UPDATE_AVAILABLE",
} as const;