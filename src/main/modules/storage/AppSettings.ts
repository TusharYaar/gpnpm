import { Package, Project } from "../../../types";
import Themes from "../../../renderer/themes";
class AppSettings {
  static latestVersion = "0.1";
  version: string;
  created: string;
  modified: string;
  settings: {
    theme: keyof typeof Themes;
    platform: string;
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
    this.version = "0.1";
    this.settings = {
      platform: "win32",
      theme: "light_theme",
    };
    this.scanFolders = [];
    this.excludeFolders = [".git", ".vscode", "node_modules", ".webpack", ".vite"];
    this.projects = [];
    this.allPackages = {};
    this.isInitialValue = true;
  }
}

export default AppSettings;
