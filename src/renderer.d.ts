import { SystemInfo } from "./types";

export interface projectAPI {
  addFolders: (folders: string[]) => void;
  openFolderDialog: () => Promise<Electron.OpenDialogReturnValue>;
}

export interface systemAPI {
  // TODO: Update type
  getSystemInfo: () => Promise<SystemInfo>;
}

declare global {
  interface Window {
    projectAPI: projectAPI;
    systemAPI: systemAPI;
  }
}
