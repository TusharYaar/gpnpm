import { ipcMain, dialog } from "electron";
import { readdir, lstat } from "node:fs/promises";
import { join as pathJoin, basename, dirname } from "path";
import fs from "fs";
import { EXCLUDED_FOLDERS } from "../../../utils/constants";
import {
  addNewPackages,
  addNewProjectToStorage,
  addPackagesNPMDetails,
  getAppSettings,
  updateAppSettings,
  updateProjectDetails,
} from "../storage";
import { sendInstruction, sendUpdateState, throwError, updateProgressBar } from "../../index";
import axios from "axios";
import { NPMRegistryPackageResponse, Package, Project } from "../../../types";
import { determineUpgradeType, getPackageLatestReleases, sanitizeVersion, sortVersion } from "../../../utils/functions";
import { differenceInSeconds } from "date-fns";

export const attachListeners = () => {
  ipcMain.handle("PROJECT:open-dialog", (_, type: "file" | "directory", allowMultiple: boolean) =>
    handleOpenDialog(type, allowMultiple)
  );
  ipcMain.handle("PROJECT:get-file", (_, file: string, type?: string) => getFile(file, type));
  ipcMain.on("PROJECT:scan-folders-for-projects", (_, folders: string[]) => scanFolderForProjects(folders));
  ipcMain.on("PROJECT:add-new-projects", (_, folders: string[]) => handleAddProjects(folders));
  ipcMain.on("PROJECT:update", (_, project: string, updates: Partial<Project>) =>
    updateProjectDetails(project, updates)
  );
  ipcMain.on("PROJECT:check-for-packages-update", () => checkForPackageDetails());
  console.log("ATTACHED PROJECTS");
};

export const runOnReady = async () => {
  const { scanFolders, settings, lastUpdatesScan } = getAppSettings();

  const current = new Date();
  // if (!lastFolderScan || differenceInSeconds(current, new Date(lastFolderScan)) > settings.projectScanInterval) {
  await scanFolderForProjects(scanFolders);
  // updateAppSettings({ lastFolderScan: current.toISOString() });
  // }
  if (!lastUpdatesScan || differenceInSeconds(current, new Date(lastUpdatesScan)) > settings.projectScanInterval) {
    await checkAvaliblePackageUpdateInProjects();
  }
};
const handleOpenDialog = async (type: "file" | "directory", allowMultiple = false) => {
  //
  const properties = [];
  properties.push(type === "file" ? "openFile" : "openDirectory");
  if (allowMultiple) properties.push("multiSelections");
  try {
    sendUpdateState("wait_for_choose_folders");
    const result = await dialog.showOpenDialog({ properties });
    sendUpdateState("idle");
    return result.filePaths;
  } catch (e) {
    throwError(e);
  } finally {
    sendUpdateState("idle");
  }
};

export const scanFolderForProjects = async (folders: string[]) => {
  const { scanFolders, projects } = getAppSettings();
  const unique = new Set(scanFolders.concat(...folders));
  updateAppSettings({ scanFolders: Array.from(unique) });
  sendUpdateState("searching_for_projects");
 const old_projects = projects.map((p) => p.projectLocation);
  try {
    for (const folder of folders) {
      let new_projects = await searchForFile("package.json", folder);
      new_projects = new_projects.map((pro) => dirname(pro)).filter((pro) => !old_projects.includes(pro));
      sendInstruction({ instruction: "select-new-projects", data: new_projects });
    }
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    sendUpdateState("idle");
  }
};

export const searchForFile = async (file: string, path: string) => {
  const projects: string[] = [];
  const list = await readdir(path);
  if (list.includes(file)) return [pathJoin(path, file)];
  for (const _file of list) {
    if (EXCLUDED_FOLDERS.includes(_file)) continue;
    const isDirectory = (await lstat(pathJoin(path, _file))).isDirectory();
    if (isDirectory) {
      const innerProjects = await searchForFile(file, pathJoin(path, _file));
      if (innerProjects.length > 0) {
        projects.push(...innerProjects);
      }
    }
  }
  return projects;
};

const handleAddProjects = async (folders: string[]) => {
  sendUpdateState("getting_dependencies");
  for (const folder of folders) {
    const title = basename(folder);
    const json = pathJoin(folder, "package.json");
    const file = getFile(json, "json");

    let dependencies: Project["dependencies"] = {};
    let devDependencies: Project["devDependencies"] = {};
    let scripts = {};
    let markdown = null;
    if (file !== null && file.dependencies) {
      addNewPackages(file.dependencies, folder, json);
      dependencies = Object.entries(file.dependencies).reduce((prev, [key, value]) => {
        return {
          ...prev,
          [key]: {
            current: sanitizeVersion(value as string),
            rawValue: value as string,
            upgradeType: determineUpgradeType(value as string),
          },
        };
      }, dependencies);
    }
    if (file !== null && file.devDependencies) {
      addNewPackages(file.devDependencies, folder, json);
      devDependencies = Object.entries(file.devDependencies).reduce((prev, [key, value]) => {
        return {
          ...prev,
          [key]: {
            current: sanitizeVersion(value as string),
            rawValue: value as string,
            upgradeType: determineUpgradeType(value as string),
          },
        };
      }, devDependencies);
    }
    if (file !== null && file.scripts) scripts = file.scripts;

    if (file !== null) {
      const markdownFile = pathJoin(folder, "README.md");
      markdown = fs.existsSync(markdownFile) ? markdownFile : null;
    }

    const icon = await searchForFile("icon.png", folder);

    if (icon.length > 0) {
      addNewProjectToStorage(folder, title, dependencies, devDependencies, scripts, markdown, json, icon[0]);
    } else addNewProjectToStorage(folder, title, dependencies, devDependencies, scripts, markdown, json, null);
  }
  sendUpdateState("idle");
  // checkForPackageDetails();
  return true;
};

const getFile = (path: string, type?: string) => {
  const exists = fs.existsSync(path);
  if (exists) {
    const buffer = fs.readFileSync(path);
    if (type === "markdown") return buffer.toString("utf-8");
    else if (type === "image") return `data:image/png;base64,${buffer.toString("base64")}`;
    else if (type === "json") return JSON.parse(buffer.toString("utf-8"));

    return buffer;
  } else return null;
};

export const checkForPackageDetails = async (packages = [] as string[]) => {
  let progress = 0;

  try {
    const { allPackages, settings } = getAppSettings();
    sendUpdateState("fetching_package_details", { current: 0, total: 100 });
    let packagesToUpdate = [];
    if (packages.length > 0) {
      packagesToUpdate = [...packages];
    } else {
      packagesToUpdate = Object.entries(allPackages).filter((pack) => {
        return (
          pack[1].npm === undefined ||
          pack[1].npm.lastUpdated === undefined ||
          differenceInSeconds(new Date(), new Date(pack[1].npm.lastUpdated)) > settings.npmScanInterval
        );
      });
    }

    const promises = packagesToUpdate.map((pack) => fetchPackageDetailsFromRegistry(pack[0]));
    promises.map((p) =>
      p
        .then(() => {
          sendUpdateState("fetching_package_details", { current: ++progress, total: packagesToUpdate.length });
          updateProgressBar(progress / packagesToUpdate.length);
        })
        .catch(() => {
          console.log("Unableto update a package ");
          // Show some error in windows
          // updateProgressBar(progress / packagesToUpdate.length);
        })
    );
    const status = await Promise.allSettled(promises);

    const responses = status
      .filter((status) => status.status === "fulfilled")
      .map((status) => status.status === "fulfilled" && status.value);
    // TODO: Send Notify user of failed packages
    // const failed = status.filter(status => status.status === "rejected").map(status => status.status === "rejected" && status.reason);

    addPackagesNPMDetails(responses);
  } catch (e) {
    console.log(e);
  } finally {
    updateProgressBar(-1);
    sendUpdateState("idle");
  }
  checkAvaliblePackageUpdateInProjects();
};

export const fetchPackageDetailsFromRegistry = async (pack: string) => {
  const { data } = await axios.get<NPMRegistryPackageResponse>(`https://registry.npmjs.org/${pack}`);
  const myPack: Package["npm"] = {
    lastUpdated: new Date().toISOString(),
    name: pack,
    "dist-tags": data["dist-tags"],
    description: data.description,
    _id: data._id,
    _rev: data._rev,
    license: data?.license,
    versions: Object.keys(data.versions)
      .filter((key) => key.match(/^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}$/))
      .sort(sortVersion),
    keywords: data?.keywords,
    homepage: data?.homepage,
  };
  return myPack;
};

export const checkAvaliblePackageUpdateInProjects = async () => {
  const { projects, allPackages } = getAppSettings();

  for (const project of projects) {
    const dependencies: (typeof project)["dependencies"] = {};
    const devDependencies: (typeof project)["devDependencies"] = {};
    for (const dependency in project.dependencies) {
      if (allPackages[dependency] !== undefined && allPackages[dependency].npm !== undefined) {
        const versions = getPackageLatestReleases(
          sanitizeVersion(project.dependencies[dependency].current),
          allPackages[dependency].npm.versions
        );
        dependencies[dependency] = {
          ...project.dependencies[dependency],
          ...versions,
        };
      }
    }
    for (const dependency in project.devDependencies) {
      if (allPackages[dependency] !== undefined && allPackages[dependency].npm !== undefined) {
        const versions = getPackageLatestReleases(
          project.devDependencies[dependency].current,
          allPackages[dependency].npm.versions
        );
        devDependencies[dependency] = {
          ...project.devDependencies[dependency],
          ...versions,
        };
      }
    }
    const lastCheckForUpdates = new Date().toISOString();
    updateProjectDetails(project.projectLocation, { lastCheckForUpdates, dependencies, devDependencies });
  }
  sendUpdateState("idle");
};

export const updateProjectTitle = async (pack: string, title: string) => {
  try {
    updateProjectDetails(pack, { title });
  } catch (e) {
    console.log(e);
  }
};

export const updateProjectNotification = async () => {
  //
};
