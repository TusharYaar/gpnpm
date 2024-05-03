import React, { useContext, createContext, useCallback, useState, useEffect, useMemo } from "react";
import AppSettings from "../../main/modules/storage/AppSettings";
import { Notification, NotificationState, SystemCurrentStateType } from "../../types";
import AddProjectModal from "../components/AddProjectModal";
import ErrorModal from "../components/ErrorModal";
import { MantineProvider, createTheme } from "@mantine/core";
import Themes from "../themes";

import "../components/styles.css";
import SettingsModal from "../components/SettingsModal";

const initialStore = new AppSettings();

type ContextProps = {
  openDialog: (type: "file" | "directory", allowMultiple: boolean) => Promise<string[]>;
  // systemInfo: SystemInfo | null;
  // TODO: ADD A TYPE
  systemCurrentState: SystemCurrentStateType;
  store: AppSettings;
  handleAddScanFolder: () => void;
  addProjects: (projects: string[]) => void;

  // Notifications
  notifications: NotificationState;
  markNotificationsRead: () => void;

  // Settings Modal
  settingsModalVisible: boolean;
  toggleSettingsModalVisible: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
};

const AppContext = createContext<ContextProps>({
  openDialog: () => Promise.resolve([]),
  addProjects: (project: string[]) => {
    project;
    return;
  },
  notifications: {
    unread: 0,
    total: 0,
    notifications: [],
  },
  markNotificationsRead: () => {},  
  handleAddScanFolder: () => {},
  systemCurrentState: null,
  store: initialStore,
  settingsModalVisible: false,
  toggleSettingsModalVisible: () => {},
  updateSettings: () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
  const [notifications, setNotification] = useState<NotificationState>({ unread: 0, total: 0, notifications: [] });

  const [projectOptions, setProjectOptions] = useState([]);
  const [error, setError] = useState<{ error: string; id: string }[]>([]);
  const [systemCurrentState, setSystemCurrentState] = useState<SystemCurrentStateType>({
    state: "idle",
    data: null,
  });
  const [store, setStore] = useState<AppSettings>(initialStore);

  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

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

  const handleAddScanFolder = useCallback(async () => {
    try {
      const folders = await window.projectAPI.openDialog("directory", true);
      if (folders.length > 0) window.projectAPI.scanFoldersForProjects(folders);
    } catch (e) {
      console.log(e);
      // setError({error: `${e}`})
    }
  }, []);

  const toggleSettingsModalVisible = useCallback(() => setSettingsModalVisible((prev) => !prev), []);

  const updateSettings = useCallback((settings: Partial<AppSettings>) => window.systemAPI.updateStore(settings), []);

  const markNotificationsRead = useCallback(() => setNotification((prev) => ({ ...prev, unread: 0 })), []);

  // Attach Listeners
  useEffect(() => {
    window.systemAPI.onUpdateCurrentState((_event: unknown, value: SystemCurrentStateType) => {
      setSystemCurrentState(value);
    });
    window.systemAPI.onError((_event: unknown, value: string) => throwError(JSON.stringify(value, null, 4)));
    window.systemAPI.onUpdateStore((_event: unknown, value: AppSettings) => {
      setStore(value);
    });
    window.systemAPI.onNewNotification((_event: unknown, data: Notification) => {
      setNotification((prev) => ({
        total: prev.total + 1,
        unread: prev.unread + 1,
        notifications: prev.notifications.concat(data),
      }));

      window.systemAPI.onNewInstruction((_event: unknown, value: { instruction: string; data: unknown }) => {
        // if (value.instruction === "open_add_folder") openFileAddDialog();
        if (value.instruction === "select-new-projects") setProjectOptions(value.data as string[]);
      });
    });
  }, []);

  useEffect(() => {}, []);

  const theme = useMemo(() => {
    return createTheme({
      ...Themes[store.settings.theme].theme,
      fontFamily: store.settings.primaryFont,
      fontFamilyMonospace: store.settings.codeFont,
      headings: {
        fontFamily: store.settings.primaryFont,
      },
    } as unknown);
  }, [store.settings]);

  return (
    <AppContext.Provider
      value={{
        openDialog,
        addProjects,
        systemCurrentState,
        handleAddScanFolder,
        store,
        settingsModalVisible,
        toggleSettingsModalVisible,
        updateSettings,
        notifications,
        markNotificationsRead,
      }}
    >
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <AddProjectModal opened={projectOptions.length > 0} projects={projectOptions} />
        <ErrorModal
          opened={error.length > 0}
          error={error.length > 0 ? error[0] : undefined}
          dismissError={dismissError}
        />
        <SettingsModal opened={settingsModalVisible} />
        {children}
      </MantineProvider>
    </AppContext.Provider>
  );
};


