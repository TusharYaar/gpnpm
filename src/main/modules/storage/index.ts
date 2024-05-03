import fs from "fs";
import AppSettings from "./AppSettings";
import { join } from "path";

import { APP_SETTINGS_FILE_NAME } from "../../../utils/constants";
import { sendNotification, throwError, updateStore } from "../../index";
import { ipcMain, app } from "electron";
import { Package, Project } from "../../../types";

export const APP_SETTINGS_FILE_PATH = join(app.getPath("appData"), "gpnpm", APP_SETTINGS_FILE_NAME);
let APP_SETTINGS = new AppSettings();

export const attachListeners = () => {
  ipcMain.handle("STORAGE:get-store", getAppSettings);
  ipcMain.on("STORAGE:update-store", (_, settings: Partial<AppSettings>) => updateAppSettings(settings));
  console.log("ATTACHED STORAGE");
  getAppSettings();
};

export const updateAppSettings = async (settings: Partial<AppSettings>) => {
  try {
    const modified = new Date().toISOString();
    if (settings) {
      const updated = { ...APP_SETTINGS, ...settings, modified };
      fs.writeFileSync(APP_SETTINGS_FILE_PATH, JSON.stringify(updated, null, 4));
      APP_SETTINGS = updated;
      sendNotification({
        title: "Settings Updated",
        description: `App settings were updated: ${Object.keys(settings).join(", ")}`,
        silent: true,
        type: "SETTINGS_UPDATE",
      });
    } else throw Error("Unable to modify App Settings");
  } catch (e) {
    sendNotification({
      title: "Unable to update settings",
      description: "Unable to update settings",
      silent: false,
      type: "SETTINGS_UPDATE",
    });
    throw Error("Unable to modify App Settings");
  } finally {
    updateStore(APP_SETTINGS);
  }
};

export const getAppSettings = (): AppSettings => {
  let settings = new AppSettings();
  if (APP_SETTINGS.isInitialValue) {
    const settingsExist = fs.existsSync(APP_SETTINGS_FILE_PATH);
    if (settingsExist) {
      const buffer = fs.readFileSync(APP_SETTINGS_FILE_PATH, "utf-8");
      settings = JSON.parse(buffer.toString()) as AppSettings;
      const version = typeof settings.version === "number" ? settings.version : parseFloat(settings.version);
      if (version < AppSettings.latestVersion) {
        settings = updateSettingsFile(settings, version);
        updateAppSettings(settings);
      }
    } else {
      settings.isInitialValue = false;
      updateAppSettings(settings);
    }
    APP_SETTINGS = settings;
    return settings;
  } else return APP_SETTINGS;
};

export const addNewPackages = (packages: Record<string, string>, project: string, packageJsonLocation: string) => {
  try {
    const { allPackages } = getAppSettings();
    for (const [key, version] of Object.entries(packages)) {
      if (allPackages[key]) {
        allPackages[key] = {
          ...allPackages[key],
          usedIn: allPackages[key].usedIn.concat({
            project,
            packageJsonLocation,
            version,
          }),
        };
      } else {
        allPackages[key] = {
          usedIn: [
            {
              project,
              packageJsonLocation,
              version,
            },
          ],
        };
      }
    }
    updateAppSettings({ allPackages });
  } catch (e) {
    throwError(e);
  }
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
  packageJsonLocation: null | string,
  iconLocation: null | string
) => {
  const { projects } = getAppSettings();
  const _project: Project = {
    lastCheckForUpdates: null,
    projectLocation: project,
    title,
    dependencies,
    devDependencies,
    markdownLocation,
    packageJsonLocation,
    scripts,
    iconLocation,
    notify: false,
    description: "",
  };
  updateAppSettings({ projects: projects.concat(_project) });
};

export const addPackagesNPMDetails = (packages: Package["npm"][]) => {
  const { allPackages } = getAppSettings();

  // if (allPackages[details.name]) {
  for (const pack of packages) {
    allPackages[pack.name] = {
      ...allPackages[pack.name],
      npm: pack,
      latest: pack.versions[pack.versions.length - 1],
    };
  }
  updateAppSettings({ allPackages });
};

// export const updatePackageUsedInDetails = (pack: string, details: Package["usedIn"]) => {
// if (APP_SETTINGS.allPackages[pack])
//   APP_SETTINGS.allPackages[pack] = {
//     ...APP_SETTINGS.allPackages[pack],
//     usedIn: details,
//   };
// else
//   APP_SETTINGS.allPackages[pack] = {
//     latest: null,
//     usedIn: details,
//     npm: null,
//   };
// };

export const updateProjectDetails = (project: string, details: Partial<Project>) => {
  const { projects } = getAppSettings();
  const _projects = projects.map((pro) => (pro.projectLocation === project ? { ...pro, ...details } : pro));
  updateAppSettings({
    projects: _projects,
  });
};

const updateSettingsFile = (settings: Partial<AppSettings>, version: number) => {
  const tempNewSettings = new AppSettings();
  const newSettings = { ...settings, version: AppSettings.latestVersion };
  if (version < AppSettings.latestVersion) {
    newSettings.settings = {
      ...tempNewSettings.settings,
      ...settings.settings,
    };
  }

  return newSettings as AppSettings;
};