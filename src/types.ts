import { DependencyUpgradeTypeMap,NotificationTypes } from "./utils/constants";

export interface SystemInfo {
  platform: "win32" | "darwin";
}

export type SystemUpdateStates = "starting" | "getting-packages" | "getting-package-details" | "";

export type Project = {
  lastCheckForUpdates: string | null;
  projectLocation: string;
  packageJsonLocation: string;
  markdownLocation: string | null;
  iconLocation: string | null;
  title: string;
  notify: boolean;
  description: string;
  scripts: {
    [key: string]: string;
  };
  dependencies: Record<string, DependencyVersion>;
  devDependencies: Record<string, DependencyVersion>;
};

export type DependencyVersion = {
  rawValue: string;
  upgradeType: keyof typeof DependencyUpgradeTypeMap;
  current: string;
  wanted?: string;

  major?: string;
  minor?: string;
  patch?: string;
};

export type Package = {
  icon?: string;
  latest?: string;
  usedIn: {
    project: string;
    packageJsonLocation: string;
    version: string;
    updates?: {
      major: string | boolean;
      minor: string | boolean;
      patch: string | boolean;
    };
  }[];
  npm?: {
    lastUpdated: string;
    _id: string;
    _rev: string;
    name: string;
    description: string;
    homepage?: string;
    "dist-tags": {
      latest: string;
      next: string;
      experimental: string;
      beta: string;
      rc: string;
    };
    versions: string[];
    license?: string;
    keywords?: string[];
    repository?: {
      type: string;
      url: string;
      directory?: string;
    };
  };
};

export type NPMRegistryPackageResponse = {
  _id: string;
  _rev: string;
  name: string;
  description: string;
  keywords: string[];
  homepage?: string;
  "dist-tags": {
    latest: string;
    next: string;
    experimental: string;
    beta: string;
    rc: string;
  };
  maintainers: string[];
  license: string;
  repository?: {
    type: string;
    url: string;
    directory: string;
  };

  versions: {
    [key: string]: {
      _id: string;
      _engineSupported: boolean;
      _npmVersion: string;
      _nodeVersion: string;
      _defaultsLoaded: boolean;
      name: string;
      description: string;
      version: string;
      keywords: string[];
      author?: {
        name: string;
        email: string;
      };
      repository: {
        type: string;
        url: string;
      };
      bugs: {
        url: string;
      };
      license?: string;
      licenses?: string[];
      main: string;
      engines: {
        [key: string]: string;
      };
    };
  };
};

export type SystemCurrentStateType =
  | {
      state:
        | "ready"
        | "idle"
        | "wait_for_choose_folders"
        | "getting_dependencies"
        | "searching_for_projects"
        | "wait_for_choose_folders";
      data?: null;
    }
  | {
      state: "fetching_package_details";
      data: {
        total: number;
        current: number;
        package: string;
      };
    };


export type Notification = {
  title: string;
  description: string;
  icon?: string;
  type: typeof NotificationTypes[keyof typeof NotificationTypes];
  silent: boolean;
};

export type NotificationState = {
  unread: number;
  total: number;
  notifications: Notification[];
};

export type DependencyUpdate = {
  package: string;
  current: string;
  updateTo: string;
  type: "wanted" | "minor" | "major" | "patch";
};