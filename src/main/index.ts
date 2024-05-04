import { app, BrowserWindow } from "electron";

import * as PROJECT from "./modules/project";
import * as SYSTEM from "./modules/system";
import * as STORAGE from "./modules/storage";

import { join } from "path";
import "./menu";
import AppSettings from "./modules/storage/AppSettings";
import { SystemCurrentStateType, Notification } from "../types";

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}
// app.disableHardwareAcceleration();

let mainWindow: BrowserWindow;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    minHeight: 300,
    minWidth: 400,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    icon: join(__dirname, "/assets/gpnpm_logo.png"),
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.once("ready-to-show", () => {
    PROJECT.runOnReady();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  STORAGE.attachListeners();
  PROJECT.attachListeners();
  SYSTEM.attachListeners();
  sendUpdateState("ready");
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

export const sendUpdateState = <T>(state: SystemCurrentStateType["state"], data?: T) => {
  if (mainWindow)
    mainWindow.webContents.send("SYSTEM:update-current-state", {
      state,
      data: data ? data : null,
    } as SystemCurrentStateType);
};

export const sendInstruction = <T>(data: { instruction: string; data: T }) => {
  if (mainWindow) mainWindow.webContents.send("SYSTEM:instruction", data);
};

export const updateStore = (store: AppSettings) => {
  if (mainWindow) mainWindow.webContents.send("SYSTEM:update-store", store);
};

export const throwError = (error: string | object) => {
  if (mainWindow) mainWindow.webContents.send("SYSTEM:error", error);
};

export const updateProgressBar = (progress: number) => {
  // TODO: Add mode for windows
  if (progress > 1) progress = 1;
  if (progress < 0) progress = -1;
  if (mainWindow) mainWindow.setProgressBar(progress);
};

export const sendNotification = (data: Notification) => {
  if (mainWindow) mainWindow.webContents.send("SYSTEM:new-notification", data);
};

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
process.on("uncaughtException", (error) => {
  throwError(error);
});
