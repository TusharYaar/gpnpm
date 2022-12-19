import fs from "fs";
import AppSettings from "./AppSettings";

import { APP_SETTINGS_FILE_PATH } from "../../utils/constants";
import { throwError, updateStore } from "../../index";
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
  try {
    for (const [key, value] of Object.entries(packages)) {
      if (APP_SETTINGS.allPackages[key]) {
        if (APP_SETTINGS.allPackages[key].usedIn.findIndex((f) => f.file === file) === -1)
          APP_SETTINGS.allPackages[key].usedIn.push({ file, version: value });
      } else APP_SETTINGS.allPackages[key] = { usedIn: [{ file, version: value }], npm: null, latest: null };
    }
  } catch (e) {
    throwError(e);
  }
  updateAppSettings();
};

export const addScannedFoldersToStorage = (folders: string[]) => {
  const unique = new Set(folders);

  if (APP_SETTINGS.scannedFolders)
    for (const folder in APP_SETTINGS.scannedFolders) unique.add(APP_SETTINGS.scannedFolders[folder]);
  APP_SETTINGS.scannedFolders = Array.from(unique);
  updateAppSettings();
};

export const addNewProjectToStorage = (
  project: string,
  dependencies: {
    [key: string]: string;
  },
  devDependencies: {
    [key: string]: string;
  },
  scripts: {
    [key: string]: string;
  },
  markdownLocation: null | string
) => {
  if (APP_SETTINGS.projects[project]) {
    APP_SETTINGS.projects[project] = {
      ...APP_SETTINGS.projects[project],
      dependencies,
      devDependencies,
      markdownLocation,
    };
  } else {
    APP_SETTINGS.projects[project] = {
      scripts: scripts,
      dependencies,
      devDependencies,
      markdownLocation,
    };
  }
};

export const addPackageNPMDetails = (pack: string, details: Package["npm"]) => {
  if (APP_SETTINGS.allPackages[pack]) {
    APP_SETTINGS.allPackages[pack] = {
      ...APP_SETTINGS.allPackages[pack],
      npm: details,
      latest: details.versions[details.versions.length - 1],
    };
  } else
    APP_SETTINGS.allPackages[pack] = {
      usedIn: [],
      npm: details,
      latest: details.versions[details.versions.length - 1],
    };
};

export const updatePackageUsedInDetails = (pack: string, details: Package["usedIn"], shouldUpdateStore = false) => {
  if (APP_SETTINGS.allPackages[pack])
    APP_SETTINGS.allPackages[pack] = {
      ...APP_SETTINGS.allPackages[pack],
      usedIn: details,
    };
  else
    APP_SETTINGS.allPackages[pack] = {
      latest: null,
      usedIn: details,
      npm: null,
    };
  if (shouldUpdateStore) updateAppSettings();
};

export const updatePackageDetails = (pack: string, details: Package, shouldUpdateStore = false) => {
  APP_SETTINGS.allPackages[pack] = details;
  if (shouldUpdateStore) updateAppSettings();
};

getAppSettings(true);
