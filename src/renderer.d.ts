import AppSettings from "./main/modules/storage/AppSettings";
import { SystemInfo } from "./types";

export interface projectAPI {
  openDialog: (type: "file" | "directory", allowMultiple?: boolean) => Promise<string[]>;
  getFile: (file: string, type?: string) => Promise<string>;
  updateProject: (project: string, update: Partial<Project>) => void;
  addNewProjects: (projects: string[]) => void;
  scanFoldersForProjects: (folders: string[]) => void;
  checkForPackagesUpdate: () => void;
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
