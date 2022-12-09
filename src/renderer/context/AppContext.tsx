import { IpcRendererEvent } from "electron";
import React, { useContext, createContext, useCallback, useState, useEffect } from "react";
import { SystemInfo } from "../../types";
import AddProjectModal from "../Conponents/AddProjectModal";
import ErrorModal from "../Conponents/ErrorModal";

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
  const [error, setError] = useState("");
  const [systemState, setSystemState] = useState("loading");

  const dismissError = useCallback(() => {
    setError("");
  }, []);

  const openFileAddDialog = useCallback(async () => {
    try {
      const response = await window.projectAPI.openFolderDialog();
      if (!response.canceled) {
        if (response.filePaths.length === 0) return console.log("No Projects Found");
        else setProjectOptions(response.filePaths);
      }
    } catch (e) {
      setError(e.message || e);
    }
  }, []);

  const addFolders = useCallback(async (projects: string[]) => {
    try {
      setProjectOptions([]);
      if (projects.length === 0) return;
      const folders = projects.map((p) =>
        p
          .split("\\")
          .filter((t) => t !== "package.json")
          .join("\\")
      );
      window.projectAPI.addFolders(folders);
    } catch (e) {
      setError(e.message || e);
    }
  }, []);

  const getSystemInfo = useCallback(async () => {
    const response = await window.systemAPI.getSystemInfo();
    setSystemInfo(response);
  }, []);

  useEffect(() => {
    getSystemInfo();
  }, [getSystemInfo]);

  useEffect(() => {
    window.systemAPI.onUpdateState((_event: IpcRendererEvent, value: string) => setSystemState(value));
    window.systemAPI.onError((_event: IpcRendererEvent, value: string) => setError(value));
  }, []);

  useEffect(() => {
    window.systemAPI.onNewInstruction((_event: IpcRendererEvent, value: { instruction: string; data: unknown }) => {
      if (value.instruction === "open_add_folder") openFileAddDialog();
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        openFileAddDialog,
        systemInfo,
        addFolders,
      }}
    >
      {projectOptions.length > 0 && <AddProjectModal projects={projectOptions} />}
      {error.length > 0 && <ErrorModal error={error} dismissError={dismissError} />}
      {children}
    </AppContext.Provider>
  );
};
