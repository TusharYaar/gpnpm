// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("projectAPI", {
  openFolderDialog: () => ipcRenderer.invoke("PROJECT:open-folder-dialog"),
  addFolders: (folders: string[]) => ipcRenderer.send("PROJECT:add-folders", folders),
});

contextBridge.exposeInMainWorld("systemAPI", {
  getSystemInfo: () => ipcRenderer.invoke("SYSTEM:get-info"),
});
