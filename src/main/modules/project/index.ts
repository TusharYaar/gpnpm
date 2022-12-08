import { ipcMain, dialog } from "electron";
import { readdir, lstat } from "node:fs/promises";
import { join as pathJoin } from "path";

import { EXCLUDED_FOLDERS } from "../../constants";

export const attachListeners = () => {
  ipcMain.handle("PROJECT:open-folder-dialog", handleOpenFolderDialog);
  ipcMain.on("PROJECT:add-folders", (event, folders: string[]) => handleAddFolders(folders));
  console.log("ATTACHED PROJECTS");
};

const handleOpenFolderDialog = async () => {
  //
  const result = await dialog.showOpenDialog({ properties: ["openDirectory", "multiSelections"] });
  if (result.canceled) return result;
  const allPacakges = [];
  for (const _path in result.filePaths) {
    const packages = await searchForFile("package.json", result.filePaths[_path]);
    console.log({ packages });
    allPacakges.push(...packages);
    return { cancelled: false, filePaths: allPacakges };
  }
};

export const searchForFile = async (file: string, path: string) => {
  console.log(path);
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

const handleAddFolders = (folders: string[]) => {
  console.log(folders);
};
