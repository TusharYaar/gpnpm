import { ipcMain, IpcMainEvent, shell } from "electron";

import { exec } from "child_process";
export const attachListeners = () => {
  ipcMain.handle("SYSTEM:get-info", getSystemInfo);
  ipcMain.on("SYSTEM:open-external-link", openExternalLink);
  ipcMain.on("SYSTEM:run-command", runCommandInTerminal);
  ipcMain.on("SYSTEM:open-directory", openDirectory);
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

const openDirectory = (event: IpcMainEvent, link: string) => {
  shell.showItemInFolder(link);
};

const runCommandInTerminal = (event: IpcMainEvent, command: string) => {
  console.log("calling", command);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};
