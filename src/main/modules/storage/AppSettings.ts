import { Project, Package } from "../../../types";

type AllPackages = {
  [key: string]: Package;
};

type Projects = {
  [key: string]: Project;
};

class AppSettings {
  static latestVersion = "0.1";
  version = "0.1";
  created: Date;
  modified: Date;
  settings = {
    theme: "light",
    platform: "win32",
  };
  scannedFolders: string[] = [];
  folders: string[] = [];
  projects: Projects;
  allPackages: AllPackages = {};
  // TODO: MAKE A TYPE

  constructor() {
    const currentDate = new Date();
    this.created = currentDate;
    this.modified = currentDate;
    this.settings.platform = process.platform;
    this.projects = {};
    this.allPackages = {};
    this.scannedFolders = [];
    this.folders = [];
  }
}

export default AppSettings;
