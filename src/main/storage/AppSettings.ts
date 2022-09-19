class AppSettings {
  static version = "0.1";
  created: Date;
  modified: Date;
  theme = "light";

  projectFolders: string[] = [];

  projects: string[] = [];

  nodePackages: string[];

  constructor() {
    const currentDate = new Date();
    this.created = currentDate;
    this.modified = currentDate;
  }

  updateTheme(theme: string) {
    this.theme = theme;
  }
}

export default AppSettings;
