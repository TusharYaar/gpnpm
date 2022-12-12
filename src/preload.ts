// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("projectAPI", {
  openFolderDialog: () => ipcRenderer.invoke("PROJECT:open-folder-dialog"),
  addFolders: (folders: string[]) => ipcRenderer.send("PROJECT:add-folders", folders),
});

contextBridge.exposeInMainWorld("systemAPI", {
  getSystemInfo: () => ipcRenderer.invoke("SYSTEM:get-info"),
  getStore: () => ipcRenderer.invoke("STORAGE:get-store"),
  onUpdateCurrentState: (callback: () => void) => ipcRenderer.on("SYSTEM:update-current-state", callback),
  onNewInstruction: (callback: () => void) => ipcRenderer.on("SYSTEM:instruction", callback),
  onError: (callback: () => void) => ipcRenderer.on("SYSTEM:error", callback),
  onUpdateStore: (callback: () => void) => ipcRenderer.on("SYSTEM-update-store", callback),
});
