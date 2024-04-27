import { Package, Project } from "../../../types";
import Themes, { Fonts } from "../../../renderer/themes";

const CURRENT_STORAGE_VERSION = 0.21;

class AppSettings {
  static latestVersion = CURRENT_STORAGE_VERSION;
  version: number | string;
  created: string;
  modified: string;
  settings: {
    theme: keyof typeof Themes;
    platform: string;
    primaryFont: (typeof Fonts)[number];
    codeFont: (typeof Fonts)[number];
    colorScheme: "light" | "dark" | "auto";
  };

  // Folders added by user to scan
  scanFolders: string[];

  // Folders added by user to exclude from scan
  excludeFolders: string[];

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
      colorScheme: "dark",
    };
    this.scanFolders = [];
    this.excludeFolders = [".git", ".vscode", "node_modules", ".webpack", ".vite"];
    this.projects = [];
    this.allPackages = {};
    this.isInitialValue = true;
  }
}

export default AppSettings;
