import { ipcMain } from "electron";

export const attachListeners = () => {
  ipcMain.handle("SYSTEM:get-info", getSystemInfo);
  console.log("ATTACHED SYSTEM");
};

const getSystemInfo = () => {
  return {
    platform: process.platform,
  };
};
