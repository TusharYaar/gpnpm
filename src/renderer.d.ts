import AppSettings from "./main/modules/storage/AppSettings";
import { SystemInfo } from "./types";

export interface projectAPI {
  addFolders: (folders: string[]) => void;
  openFolderDialog: () => Promise<Electron.OpenDialogReturnValue>;
  getFile: (file: string) => Promise<string>;
}

export interface systemAPI {
  openExternalLink: (link: string) => void;
  getSystemInfo: () => Promise<SystemInfo>;
  getStore: () => Promise<AppSettings>;
  onUpdateCurrentState: (callback) => void;
  onNewInstruction: (callback) => void;
  onError: (callback) => void;
  onUpdateStore: (callback) => void;
}

declare global {
  interface Window {
    projectAPI: projectAPI;
    systemAPI: systemAPI;
  }
}
