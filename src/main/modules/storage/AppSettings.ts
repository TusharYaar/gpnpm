class AppSettings {
  static latestVersion = "0.1";
  version = "0.1";
  created: Date;
  modified: Date;
  settings = {
    theme: "light",
    platform: "win32",
  };
  folders: string[] = [];
  allPackages: { [key: string]: string[] } = {};
  // TODO: MAKE A TYPE
  projects: unknown = {};

  constructor() {
    const currentDate = new Date();
    this.created = currentDate;
    this.modified = currentDate;
    this.settings.platform = process.platform;
  }
}

export default AppSettings;
