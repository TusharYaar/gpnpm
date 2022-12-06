import React, { useContext, createContext, useCallback } from "react";

type ContextProps = {
  openFileAddDialog: () => void;
};

const AppContext = createContext<ContextProps>({
  openFileAddDialog: () => {
    //
  },
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const openFileAddDialog = useCallback(() => {
    window.projectAPI.openProjectDialog();
    console.log("open-project");
  }, []);

  return (
    <AppContext.Provider
      value={{
        openFileAddDialog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
