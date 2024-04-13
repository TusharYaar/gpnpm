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
  ipcMain.handle("PROJECT:open-dialog", (_, type: "file" | "directory", allowMultiple: boolean) =>
    handleOpenDialog(type, allowMultiple)
  );
  ipcMain.handle("PROJECT:get-file", (_, file: string, type?: string) => getFile(file, type));
  ipcMain.on("PROJECT:scan-folders-for-projects", (_, folders: string[]) => scanFolderForProjects(folders));
  ipcMain.on("PROJECT:add-new-projects", (_, folders: string[]) => handleAddProjects(folders));
  ipcMain.on("PROJECT:update", (_, project: string, updates: Partial<Project>) =>
    updateProjectDetails(project, updates)
  );
  console.log("ATTACHED PROJECTS");
};

const handleOpenDialog = async (type: "file" | "directory", allowMultiple = false) => {
  //
  const properties = [];
  properties.push(type === "file" ? "openFile" : "openDirectory");
  console.log(properties);
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
  addScanFoldersToStorage(folders);
  sendUpdateState("searching_for_projects");
  try {
    for (const folder of folders) {
      let projects = await searchForFile("package.json", folder);
      projects = projects.map((pro) => dirname(pro));
      sendInstruction({ instruction: "select-new-projects", data: projects });
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

    const icon = await searchForFile("icon.png", folder);

    if (icon.length > 0) {
      console.log(icon);
      addNewProjectToStorage(folder, title, dependencies, devDependencies, scripts, markdown, json, icon[0]);
    } else addNewProjectToStorage(folder, title, dependencies, devDependencies, scripts, markdown, json, null);
  }
  sendUpdateState("idle");
  checkForPackageDetails();
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
