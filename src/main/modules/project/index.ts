import { ipcMain, dialog, IpcMainInvokeEvent } from "electron";
import { readdir, lstat } from "node:fs/promises";
import { join as pathJoin } from "path";
import fs from "fs";
import { EXCLUDED_FOLDERS } from "../../constants";
import {
  addNewFoldersToStorage,
  addNewPackages,
  addNewProjectToStorage,
  addPackageDetails,
  addScannedFoldersToStorage,
  getAppSettings,
} from "../storage";
import { sendUpdateState } from "../../index";
import axios from "axios";
import { NPMRegistryPackageResponse, Package } from "../../../types";

export const attachListeners = () => {
  ipcMain.handle("PROJECT:open-folder-dialog", handleOpenFolderDialog);
  ipcMain.on("PROJECT:add-folders", handleAddFolders);
  console.log("ATTACHED PROJECTS");
};

const handleOpenFolderDialog = async () => {
  //
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
  sendUpdateState("idle");
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
  const projects = [];
  for (const index in folders) {
    const file = getPackageJSON(pathJoin(folders[index], "package.json"));
    if (file !== null) {
      addNewPackages(file.dependencies, pathJoin(folders[index], "package.json"));
      projects.push(pathJoin(folders[index], "package.json"));
    }
  }
  addNewProjectToStorage(projects);
  sendUpdateState("idle");
  return true;
};

const getPackageJSON = (path: string) => {
  const exists = fs.existsSync(path);
  if (exists) {
    const buffer = fs.readFileSync(path, "utf-8");
    const _file = JSON.parse(buffer.toString());
    return _file;
  } else return null;
};

export const checkForPackageDetails = async (updateAll = false) => {
  const { allPackages } = getAppSettings();
  let index = 0;
  for (const pack in allPackages) {
    ++index;
    if (allPackages[pack].npm && !updateAll) continue;
    sendUpdateState(`fetching_package_details`, {
      total: Object.keys(allPackages).length,
      current: index,
      package: pack,
    });
    const details = await fetchPackageDetails(pack);
    addPackageDetails(pack, details);
  }
  sendUpdateState("idle");
};

// TODO: Move the function to utils
const sortVersion = (a: string, b: string) => {
  const aver = a.split(".");
  const bver = b.split(".");

  for (let i = 0; i < 3; i++) {
    if (+aver[i] - +bver[i] !== 0) return +aver[i] - +bver[i];
  }
  return 0;
};

export const fetchPackageDetails = async (pack: string) => {
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
