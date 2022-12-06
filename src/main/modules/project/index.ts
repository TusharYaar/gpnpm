import { ipcMain, dialog } from "electron";

export const attachListeners = () => {
  console.log("attached");
  ipcMain.on("PROJECT:open-dialog", openChooseDirectoryDialog);
};

export const openChooseDirectoryDialog = async () => {
  const directory = await dialog.showOpenDialog({ properties: ["openDirectory", "multiSelections"] });
  console.log(directory);
  if (directory.canceled) console.log("cancelled");
};
