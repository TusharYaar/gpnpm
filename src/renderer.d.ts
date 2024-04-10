import AppSettings from "./main/modules/storage/AppSettings";
import { SystemInfo } from "./types";

export interface projectAPI {
  openFolderDialog: () => void;
  getFile: (file: string) => Promise<string>;
  updateProjectTitle: (project: string, title: string) => void;
  addNewProjects: (projects: string[]) => void;
}

export interface systemAPI {
  openExternalLink: (link: string) => void;
  runCommandInTerminal: (command: string) => void;
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
