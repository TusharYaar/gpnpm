import React, { useContext, createContext, useCallback, useState, useEffect } from "react";
import AppSettings from "../../main/modules/storage/AppSettings";
import { SystemCurrentStateType, SystemInfo } from "../../types";
import AddProjectModal from "../components/AddProjectModal";
import ErrorModal from "../components/ErrorModal";

const initialStore = new AppSettings();

type ContextProps = {
  openDialog: (type: "file" | "directory", allowMultiple: boolean) => Promise<string[]>;
  systemInfo: SystemInfo | null;
  // TODO: ADD A TYPE
  systemCurrentState: SystemCurrentStateType;
  store: AppSettings;
  handleAddScanFolder: () => void;
  addProjects: (projects: string[]) => void;
};

const AppContext = createContext<ContextProps>({
  openDialog: () => Promise.resolve([]),
  addProjects: (project: string[]) => {
    project;
    return;
  },
  handleAddScanFolder: () => {},
  systemInfo: null,
  systemCurrentState: null,
  store: initialStore,
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const [projectOptions, setProjectOptions] = useState([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [error, setError] = useState<{ error: string; id: string }[]>([]);
  const [systemCurrentState, setSystemCurrentState] = useState<SystemCurrentStateType>({
    state: "idle",
    data: null,
  });
  const [store, setStore] = useState<AppSettings>(initialStore);

  const dismissError = useCallback((id: string) => {
    setError((prev) => prev.filter((err) => err.id !== id));
  }, []);

  const throwError = useCallback((error: string) => {
    const id = `${new Date().toJSON()}-${(Math.random() * 10000).toFixed(5)}`;
    setError((prev) => [...prev, { error, id }]);
  }, []);

  const openDialog = useCallback(async (type: "file" | "directory", allowMultiple = false) => {
    return window.projectAPI.openDialog(type, allowMultiple);
  }, []);

  const addProjects = useCallback(async (projects: string[]) => {
    try {
      setProjectOptions([]);
      if (projects.length === 0) return;
      window.projectAPI.addNewProjects(projects);
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

  const handleAddScanFolder = useCallback(async () => {
    try {
      const folders = await window.projectAPI.openDialog("directory", true);
      if (folders.length > 0) window.projectAPI.scanFoldersForProjects(folders);
    } catch (e) {
      console.log(e);
      // setError({error: `${e}`})
    }
  }, []);

  useEffect(() => {
    getSystemInfo();
  }, [getSystemInfo]);

  useEffect(() => {
    window.systemAPI.onUpdateCurrentState((_event: unknown, value: SystemCurrentStateType) => {
      setSystemCurrentState(value);
    });
    window.systemAPI.onError((_event: unknown, value: string) => throwError(JSON.stringify(value, null, 4)));
    window.systemAPI.onUpdateStore((_event: unknown, value: AppSettings) => {
      setStore(value);
    });
  }, []);

  useEffect(() => {
    window.systemAPI.onNewInstruction((_event: unknown, value: { instruction: string; data: unknown }) => {
      // if (value.instruction === "open_add_folder") openFileAddDialog();
      if (value.instruction === "select-new-projects") setProjectOptions(value.data as string[]);
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        openDialog,
        systemInfo,
        addProjects,
        systemCurrentState,
        handleAddScanFolder,
        store,
      }}
    >
      {projectOptions.length > 0 && <AddProjectModal projects={projectOptions} />}
      {error.length > 0 && <ErrorModal error={error[0]} dismissError={dismissError} />}
      {children}
    </AppContext.Provider>
  );
};
