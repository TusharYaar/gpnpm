import { SystemInfo } from "./types";

export interface projectAPI {
  addFolders: (folders: string[]) => void;
  openFolderDialog: () => Promise<Electron.OpenDialogReturnValue>;
}

export interface systemAPI {
  getSystemInfo: () => Promise<SystemInfo>;
  onUpdateState: (callback) => void;
  onNewInstruction: (callback) => void;
  onError: (callback) => void;
}

declare global {
  interface Window {
    projectAPI: projectAPI;
    systemAPI: systemAPI;
  }
}
