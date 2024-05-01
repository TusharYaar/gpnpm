import { Package, Project } from "../../../types";
import Themes, { Fonts } from "../../../renderer/themes";

const CURRENT_STORAGE_VERSION = 0.24;

class AppSettings {
  static latestVersion = CURRENT_STORAGE_VERSION;
  version: number | string;
  created: string;
  modified: string;
  // time of scan for entire scan for projects
  lastFolderScan: string;
  // time of scan for updates in projects
  lastUpdatesScan: string;
  last: string;
  settings: {
    theme: keyof typeof Themes;
    platform: string;
    primaryFont: (typeof Fonts)[number];
    codeFont: (typeof Fonts)[number];
    colorScheme: "light" | "dark" | "auto";
    // Interval at which npm package details are fetched from registry
    npmScanInterval: number;
    // Interval at which folders are scanned for projects
    projectScanInterval: number;
    // If projects in scanned folders are automatically added
    automaticallyAddProjects: boolean;
  };

  // Folders added by user to scan
  scanFolders: string[];

  // Folders added by user to exclude from scan
  excludeFolders: string[];

  // Projects to ignore in scan Folders
  excludeProjects: string[];

  // Folders added by user to exclude from scan
  excludePackages: string[];

  projects: Project[];
  allPackages: Record<string, Package>;
  // this value is set to false when settings file is read
  isInitialValue: boolean;

  constructor() {
    const currentDate = new Date().toISOString();
    this.created = currentDate;
    this.modified = currentDate;
    this.version = CURRENT_STORAGE_VERSION;
    this.settings = {
      platform: "win32",
      theme: "light_theme",
      primaryFont: "Lexend",
      codeFont: "monospace",
      colorScheme: "auto",
      npmScanInterval: 86400,
      projectScanInterval: 86400,
      automaticallyAddProjects: false,
    };
    this.scanFolders = [];
    this.excludeFolders = [".git", ".vscode", "node_modules", ".webpack", ".vite"];
    this.excludeProjects = [];
    this.excludePackages = [];
    this.projects = [];
    this.allPackages = {};
    this.isInitialValue = true;
  }
}

export default AppSettings;
