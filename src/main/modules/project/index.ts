import { ipcMain, dialog, IpcMainInvokeEvent } from "electron";
import { readdir, lstat } from "node:fs/promises";
import { join as pathJoin } from "path";
import fs from "fs";
import { EXCLUDED_FOLDERS } from "../../utils/constants";
import {
  addNewFoldersToStorage,
  addNewPackages,
  addNewProjectToStorage,
  addPackageNPMDetails,
  addScannedFoldersToStorage,
  getAppSettings,
  updateAppSettings,
  updatePackageUsedInDetails,
} from "../storage";
import { sendUpdateState, throwError } from "../../index";
import axios from "axios";
import { NPMRegistryPackageResponse, Package } from "../../../types";
import { getPackageLatestReleases, sanitizeVersion, sortVersion } from "../../../utils/functions";

export const attachListeners = () => {
  ipcMain.handle("PROJECT:open-folder-dialog", handleOpenFolderDialog);
  ipcMain.on("PROJECT:add-folders", handleAddFolders);
  console.log("ATTACHED PROJECTS");
};

const handleOpenFolderDialog = async () => {
  //
  try {
    sendUpdateState("wait_for_choose_folders");
    const result = await dialog.showOpenDialog({ properties: ["openDirectory", "multiSelections"] });
    if (result.canceled || result.filePaths.length === 0) {
      sendUpdateState("idle");
      return result;
    }
    addScannedFoldersToStorage(result.filePaths);
    sendUpdateState("searching_for_projects");
    const allPackages = [];
    for (const _path in result.filePaths) {
      const packages = await searchForFile("package.json", result.filePaths[_path]);
      allPackages.push(...packages);
      return { cancelled: false, filePaths: allPackages };
    }
  } catch (e) {
    throwError(e);
  } finally {
    sendUpdateState("idle");
  }
};

export const searchForFile = async (file: string, path: string) => {
  const projects: string[] = [];
  const list = await readdir(path);
  if (list.includes(file)) return [pathJoin(path, file)];
  for (const index in list) {
    const _file = list[index];
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

const handleAddFolders = (_event: IpcMainInvokeEvent, folders: string[]) => {
  sendUpdateState("getting_dependencies");
  addNewFoldersToStorage(folders);
  for (const index in folders) {
    const project = pathJoin(folders[index], "package.json");
    const file = getFile(project, "json");

    let dependencies = {};
    let devDependencies = {};
    let scripts = {};
    let markdown = null;
    if (file !== null && file.dependencies) {
      addNewPackages(file.dependencies, project);
      dependencies = file.dependencies;
    }
    if (file !== null && file.devDependencies) {
      devDependencies = file.devDependencies;
      addNewPackages(file.devDependencies, project);
    }
    if (file !== null && file.scripts) scripts = file.scripts;

    if (file !== null) {
      const markdownFile = pathJoin(folders[index], "README.md");
      markdown = fs.existsSync(markdownFile) ? markdownFile : null;
    }
    addNewProjectToStorage(project, dependencies, devDependencies, scripts, markdown);
  }

  updateAppSettings();
  sendUpdateState("idle");
  checkForPackageDetails();
  return true;
};

const getFile = (path: string, type?: string) => {
  const exists = fs.existsSync(path);
  if (exists) {
    const buffer = fs.readFileSync(path, "utf-8");
    if (type === "json") return JSON.parse(buffer);
    return buffer;
  } else return null;
};

export const checkForPackageDetails = async (updateAll = false) => {
  const { allPackages } = getAppSettings();
  const total = Object.keys(allPackages).length;
  let index = 0;
  for (const pack in allPackages) {
    ++index;
    let details: Package["npm"];
    if (!allPackages[pack].npm || updateAll) {
      sendUpdateState(`fetching_package_details`, {
        total,
        current: index,
        package: pack,
      });
      details = await fetchPackageDetailsFromRegistry(pack);
      addPackageNPMDetails(pack, details);
    }
  }
  updateAppSettings();
  sendUpdateState("idle");
  checkAvaliblePackageUpdateInProjects();
};

export const fetchPackageDetailsFromRegistry = async (pack: string) => {
  const { data } = await axios.get<NPMRegistryPackageResponse>(`https://registry.npmjs.org/${pack}`);
  const myPack: Package["npm"] = {
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

// export const fetchLatestPackageVersionFromRegistry = async (pack: string) => {
//   const data = await axios.get(`https://registry.npmjs.org/${pack}/latest`);
// };

export const checkAvaliblePackageUpdateInProjects = async () => {
  const { allPackages } = getAppSettings();
  const total = Object.keys(allPackages).length;
  let index = 0;
  for (const pack in allPackages) {
    ++index;

    const usedIn = allPackages[pack].usedIn.map((project) => ({
      ...project,
      updates: getPackageLatestReleases(sanitizeVersion(project.version), allPackages[pack].npm.versions),
    }));
    sendUpdateState(`fetching_package_details`, {
      total,
      current: index,
      package: pack,
    });
    updatePackageUsedInDetails(pack, usedIn, index === total);
  }
  sendUpdateState("idle");
};
