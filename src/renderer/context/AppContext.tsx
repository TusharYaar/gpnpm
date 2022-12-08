import React, { useContext, createContext, useCallback, useState, useEffect } from "react";
import { SystemInfo } from "../../types";
import AddProjectModal from "../Conponents/AddProjectModal";

type ContextProps = {
  openFileAddDialog: () => void;
  systemInfo: SystemInfo | null;
  addFolders: (projects: string[]) => void;
};

const AppContext = createContext<ContextProps>({
  openFileAddDialog: () => {
    return;
  },
  addFolders: (project: string[]) => {
    project;
    return;
  },
  systemInfo: null,
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const [projectOptions, setProjectOptions] = useState([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const openFileAddDialog = useCallback(async () => {
    try {
      const response = await window.projectAPI.openFolderDialog();
      console.log(response);
      if (response.canceled) return console.log("Operation Cancelled");
      else {
        if (response.filePaths.length === 0) return console.log("No Projects Found");
        else setProjectOptions(response.filePaths);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const addFolders = useCallback(async (projects: string[]) => {
    try {
      const folders = projects.map((p) =>
        p
          .split("\\")
          .filter((t) => t !== "package.json")
          .join("\\")
      );
      console.log({ folders });
      window.projectAPI.addFolders(folders);
      setProjectOptions([]);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const getSystemInfo = useCallback(async () => {
    const response = await window.systemAPI.getSystemInfo();
    setSystemInfo(response);
  }, []);

  useEffect(() => {
    getSystemInfo();
  }, [getSystemInfo]);

  return (
    <AppContext.Provider
      value={{
        openFileAddDialog,
        systemInfo,
        addFolders,
      }}
    >
      {projectOptions.length > 0 && <AddProjectModal projects={projectOptions} />}
      {children}
    </AppContext.Provider>
  );
};
