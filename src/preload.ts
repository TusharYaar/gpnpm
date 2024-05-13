// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { DependencyUpdate, Project } from "./types";
import AppSettings from "./main/modules/storage/AppSettings";

contextBridge.exposeInMainWorld("projectAPI", {
  openDialog: (file: "file" | "directory", allowMultiple: boolean) =>
    ipcRenderer.invoke("PROJECT:open-dialog", file, allowMultiple),
  getFile: (file: string, type?: string) => ipcRenderer.invoke("PROJECT:get-file", file, type),
  updateProject: (project: string, updates: Partial<Project>) => ipcRenderer.send("PROJECT:update", project, updates),
  addNewProjects: (projects: string[]) => ipcRenderer.send("PROJECT:add-new-projects", projects),
  scanFoldersForProjects: (folders: string[]) => ipcRenderer.send("PROJECT:scan-folders-for-projects", folders),
  checkForPackagesUpdate: () => ipcRenderer.send("PROJECT:check-for-packages-update"),
  checkForPackagesUpdateInProject: (projects?: string[]) =>
    ipcRenderer.send("PROJECT:check-package-update-in-project", projects),
  updateProjectDependencies: (project: string, updates: DependencyUpdate[]) =>
    ipcRenderer.send("PROJECT:update-dependencies", project, updates),
});

contextBridge.exposeInMainWorld("systemAPI", {
  getSystemInfo: () => ipcRenderer.invoke("SYSTEM:get-info"),
  openExternalLink: (link: string) => ipcRenderer.send("SYSTEM:open-external-link", link),
  runCommandInTerminal: (command: string) => ipcRenderer.send("SYSTEM:run-command", command),
  getStore: () => ipcRenderer.invoke("STORAGE:get-store"),
  updateStore: (settings: Partial<AppSettings>) => ipcRenderer.send("STORAGE:update-store", settings),
  openDirectory: (link: string) => ipcRenderer.send("SYSTEM:open-directory", link),
  onUpdateCurrentState: (callback: () => void) => ipcRenderer.on("SYSTEM:update-current-state", callback),
  onNewInstruction: (callback: () => void) => ipcRenderer.on("SYSTEM:instruction", callback),
  onError: (callback: () => void) => ipcRenderer.on("SYSTEM:error", callback),
  onUpdateStore: (callback: () => void) => ipcRenderer.on("SYSTEM:update-store", callback),
  onNewNotification: (callback: () => void) => ipcRenderer.on("SYSTEM:new-notification", callback),

  closeWindow: () => ipcRenderer.send("WINDOW:close"),
  minimizeWindow: () => ipcRenderer.send("WINDOW:minimize"),
  maximizeWindow: () => ipcRenderer.send("WINDOW:maximize"),
});
