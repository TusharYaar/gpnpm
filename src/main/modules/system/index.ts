import { ipcMain, IpcMainEvent, shell } from "electron";

export const attachListeners = () => {
  ipcMain.handle("SYSTEM:get-info", getSystemInfo);
  ipcMain.on("SYSTEM:open-external-link", openExternalLink);
  console.log("ATTACHED SYSTEM");
};

const getSystemInfo = () => {
  return {
    platform: process.platform,
  };
};

const openExternalLink = (event: IpcMainEvent, link: string) => {
  shell.openExternal(link);
};
