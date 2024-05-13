import AppSettings from "./main/modules/storage/AppSettings";
import { DependencyUpdate, SystemInfo } from "./types";

export interface projectAPI {
  openDialog: (type: "file" | "directory", allowMultiple?: boolean) => Promise<string[]>;
  getFile: (file: string, type?: string) => Promise<string>;
  updateProject: (project: string, update: Partial<Project>) => void;
  addNewProjects: (projects: string[]) => void;
  scanFoldersForProjects: (folders: string[]) => void;
  checkForPackagesUpdate: () => void;
  checkForPackagesUpdateInProject: (projects?: string[]) => void;
  updateProjectDependencies: (project: string, updates: DependencyUpdate[]) => void;
}

export interface systemAPI {
  openExternalLink: (link: string) => void;
  runCommandInTerminal: (command: string) => void;
  getSystemInfo: () => Promise<SystemInfo>;
  getStore: () => Promise<AppSettings>;
  updateStore: (settings: Partial<AppSettings>) => void;
  openDirectory: (link: string) => void;

  onUpdateCurrentState: (callback) => void;
  onNewInstruction: (callback) => void;
  onError: (callback) => void;
  onUpdateStore: (callback) => void;
  onNewNotification: (callback) => void;

  closeWindow: () => void;
  maximizeWindow: () => void;
  minimizeWindow: () => void;
}

declare global {
  interface Window {
    projectAPI: projectAPI;
    systemAPI: systemAPI;
  }
}
