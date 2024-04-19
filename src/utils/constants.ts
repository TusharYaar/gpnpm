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
