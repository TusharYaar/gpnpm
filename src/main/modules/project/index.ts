import { ipcMain, dialog } from "electron";
import { readdir, lstat } from "node:fs/promises";
import { join as pathJoin, basename, dirname } from "path";
import fs from "fs";
import { EXCLUDED_FOLDERS } from "../../utils/constants";
import {
  addNewPackages,
  addNewProjectToStorage,
  addPackageNPMDetails,
  addScanFoldersToStorage,
  getAppSettings,
  updatePackageUsedInDetails,
  updateProjectDetails,
} from "../storage";
import { sendInstruction, sendUpdateState, throwError } from "../../index";
import axios from "axios";
import { NPMRegistryPackageResponse, Package, Project } from "../../../types";
import { getPackageLatestReleases, sanitizeVersion, sortVersion } from "../../../utils/functions";

export const attachListeners = () => {
  ipcMain.on("PROJECT:open-folder-dialog", handleOpenFolderDialog);
  ipcMain.handle("PROJECT:get-file", (_, file: string) => getFile(file));
  ipcMain.on("PROJECT:add-new-projects", (_, folders: string[]) => handleAddProjects(folders));
  ipcMain.on("PROJECT:update-title", (_, args: [string, string]) => updateProjectTitle(...args));
  ipcMain.on("PROJECT:update-notification", (_, args: [string, string]) => updateProjectTitle(...args));
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
    addScanFoldersToStorage(result.filePaths);
    sendUpdateState("searching_for_projects");
    for (const _path of result.filePaths) {
      await scanFolderForProjects(_path);
    }
  } catch (e) {
    throwError(e);
  } finally {
    sendUpdateState("idle");
  }
};

export const scanFolderForProjects = async (folder: string) => {
  try {
    let projects = await searchForFile("package.json", folder);
    projects = projects.map((pro) => dirname(pro));
    console.log(projects);
    sendInstruction({ instruction: "select-new-projects", data: projects });
  } catch (e) {
    console.log(e);
    throw e;
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

const handleAddProjects = (folders: string[]) => {
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
      addNewPackages(file.dependencies, json);
      dependencies = Object.entries(file.dependencies).reduce((prev, [key, value]) => {
        return {
          ...prev,
          [key]: {
            currect: value,
          },
        };
      }, {});
    }
    if (file !== null && file.devDependencies) {
      // // file.devDependencies, project;
      addNewPackages(file.devDependencies, json);
      devDependencies = Object.entries(file.devDependencies).reduce((prev, [key, value]) => {
        return {
          ...prev,
          [key]: {
            currect: value,
          },
        };
      }, {});
    }
    if (file !== null && file.scripts) scripts = file.scripts;

    if (file !== null) {
      const markdownFile = pathJoin(folder, "README.md");
      markdown = fs.existsSync(markdownFile) ? markdownFile : null;
    }
    addNewProjectToStorage(folder, title, dependencies, devDependencies, scripts, markdown, json);
  }
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

export const checkAvaliblePackageUpdateInProjects = async () => {
  const { allPackages } = getAppSettings();
  const total = Object.keys(allPackages).length;
  let index = 0;
  for (const pack in allPackages) {
    ++index;
    const usedIn: (typeof allPackages)[0]["usedIn"] = {};

    for (const [key, value] of Object.entries(allPackages[pack].usedIn)) {
      usedIn[key] = {
        ...value,
        updates: getPackageLatestReleases(sanitizeVersion(value.version), allPackages[pack].npm.versions),
      };
    }
    sendUpdateState(`fetching_package_details`, {
      total,
      current: index,
      package: pack,
    });
    updatePackageUsedInDetails(pack, usedIn);
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
