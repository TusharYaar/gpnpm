import fs from "fs";
import AppSettings from "./AppSettings";

import { APP_SETTINGS_FILE_PATH } from "../../utils/constants";
import { throwError, updateStore } from "../../index";
import { ipcMain } from "electron";
import { Package, Project } from "../../../types";

let APP_SETTINGS = new AppSettings();

export const attachListeners = () => {
  ipcMain.handle("STORAGE:get-store", getAppSettings);
  console.log("ATTACHED STORAGE");
};

export const updateAppSettings = async (settings: Partial<AppSettings>) => {
  try {
    const modified = new Date();
    if (settings) {
      const updated = { ...APP_SETTINGS, ...settings, ...modified };
      fs.writeFileSync(APP_SETTINGS_FILE_PATH, JSON.stringify(updated, null, 4));
      APP_SETTINGS = { ...updated };
    } else throw Error("Unable to modify App Settings");
  } catch (e) {
    throw Error("Unable to modify App Settings");
  } finally {
    updateStore(APP_SETTINGS);
  }
};

export const getAppSettings = (): AppSettings => {
  if (APP_SETTINGS.isInitialValue) {
    let settings: AppSettings;
    const settingsExist = fs.existsSync(APP_SETTINGS_FILE_PATH);
    if (settingsExist) {
      const buffer = fs.readFileSync(APP_SETTINGS_FILE_PATH, "utf-8");
      settings = JSON.parse(buffer.toString()) as AppSettings;
    } else {
      settings = new AppSettings();
      settings.isInitialValue = false;
      updateAppSettings(settings);
    }
    return settings;
  } else return APP_SETTINGS;
};

export const addNewPackages = (packages: { [key: string]: string }, file: string) => {
  try {
    for (const [key, value] of Object.entries(packages)) {
      if (APP_SETTINGS.allPackages[key]) {
        if (APP_SETTINGS.allPackages[key].usedIn[file]) {
          APP_SETTINGS.allPackages[key].usedIn[file] = {
            ...APP_SETTINGS.allPackages[key].usedIn[file],
            version: value,
          };
        } else {
          APP_SETTINGS.allPackages[key].usedIn[file] = {
            version: value,
            updates: null,
          };
        }
      } else
        APP_SETTINGS.allPackages[key] = {
          usedIn: { [file]: { version: value, updates: null } },
          npm: null,
          latest: null,
        };
    }
  } catch (e) {
    throwError(e);
  }
};

export const addScanFoldersToStorage = (folders: string[]) => {
  const unique = new Set(folders);
  if (APP_SETTINGS.scanFolders)
    for (const folder in APP_SETTINGS.scanFolders) unique.add(APP_SETTINGS.scanFolders[folder]);
  updateAppSettings({ scanFolders: Array.from(unique) });
};

export const addNewProjectToStorage = (
  project: string,
  title = "",
  dependencies: Project["dependencies"],
  devDependencies: Project["dependencies"],
  scripts: {
    [key: string]: string;
  },
  markdownLocation: null | string,
  packageJsonLocation: null | string
) => {
  const { projects } = getAppSettings();
  const _project: Project = {
    projectLocation: project,
    title,
    dependencies,
    devDependencies,
    markdownLocation,
    packageJsonLocation,
    scripts,
    iconLocation: "",
    notify: false,
  };
  updateAppSettings({ projects: projects.concat(_project) });
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
      usedIn: {},
      npm: details,
      latest: details.versions[details.versions.length - 1],
    };
};

export const updatePackageUsedInDetails = (pack: string, details: Package["usedIn"]) => {
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
};

export const updatePackageDetails = (pack: string, details: Package) => {
  APP_SETTINGS.allPackages[pack] = details;
};

export const updateProjectDetails = (project: string, details: Partial<Project>) => {
  if (APP_SETTINGS.projects[project] !== undefined)
    APP_SETTINGS.projects[project] = {
      ...APP_SETTINGS.projects[project],
      ...details,
    };
  // updateAppSettings({
  //   projects,
  // });
};
