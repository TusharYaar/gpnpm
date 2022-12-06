export interface projectAPI {
  openProjectDialog: () => void;
}

declare global {
  interface Window {
    projectAPI: projectAPI;
  }
}
