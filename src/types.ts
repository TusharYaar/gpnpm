export interface SystemInfo {
  platform: "win32" | "darwin";
}

export type SystemUpdateStates = "starting" | "getting-packages" | "getting-package-details" | "";

export type Package = {
  [key: string]: {
    usedIn: string[];
  };
};
