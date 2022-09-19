import { dialog } from "electron";
import { addNewProjectFolders } from "./storage";

export const openChooseDirectoryDialog = async () => {
  const directory = await dialog.showOpenDialog({ properties: ["openDirectory", "multiSelections"] });
  console.log(directory);
  if (directory.canceled) return;
  else addNewProjectFolders(directory.filePaths);
};
