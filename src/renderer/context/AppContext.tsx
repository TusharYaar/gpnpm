import { IpcRendererEvent } from "electron";
import React, { useContext, createContext, useCallback, useState, useEffect } from "react";
import AppSettings from "../../main/modules/storage/AppSettings";
import { SystemInfo } from "../../types";
import AddProjectModal from "../components/AddProjectModal";
import ErrorModal from "../components/ErrorModal";

type ContextProps = {
  openFileAddDialog: () => void;
  systemInfo: SystemInfo | null;
  // TODO: ADD A TYPE
  systemCurrentState: unknown;
  store: AppSettings | null;
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
  systemCurrentState: null,
  store: null,
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const [projectOptions, setProjectOptions] = useState([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [error, setError] = useState<{ error: string; id: string }[]>([]);
  const [systemCurrentState, setSystemCurrentState] = useState("idle");
  const [store, setStore] = useState(null);

  const dismissError = useCallback((id: string) => {
    setError((prev) => prev.filter((err) => err.id !== id));
  }, []);

  const throwError = useCallback((error: string) => {
    const id = `${new Date().toJSON()}-${(Math.random() * 10000).toFixed(5)}`;
    setError((prev) => [...prev, { error, id }]);
  }, []);

  const openFileAddDialog = useCallback(async () => {
    try {
      const response = await window.projectAPI.openFolderDialog();
      if (!response.canceled) {
        if (response.filePaths.length === 0) return console.log("No Projects Found");
        else setProjectOptions(response.filePaths);
      }
    } catch (e) {
      throwError(e.message || e);
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
    const store = await window.systemAPI.getStore();
    setStore(store);
    setSystemInfo(response);
  }, []);

  useEffect(() => {
    getSystemInfo();
  }, [getSystemInfo]);

  useEffect(() => {
    window.systemAPI.onUpdateCurrentState((_event: IpcRendererEvent, value: string) => setSystemCurrentState(value));
    window.systemAPI.onError((_event: IpcRendererEvent, value: string) => throwError(value));
    window.systemAPI.onUpdateStore((_event: IpcRendererEvent, value: AppSettings) => setStore(value));
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
        systemCurrentState,
        store,
      }}
    >
      {projectOptions.length > 0 && <AddProjectModal projects={projectOptions} />}
      {error.length > 0 && <ErrorModal error={error[0]} dismissError={dismissError} />}
      {children}
    </AppContext.Provider>
  );
};
