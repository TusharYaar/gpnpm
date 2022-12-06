import React from "react";
import { AppShell, MantineProvider } from "@mantine/core";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import Menubar from "./Conponents/Menubar";

const AppContainer = () => {
  return (
    <AppProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AppShell navbar={<Menubar />}>
          <App />
        </AppShell>
      </MantineProvider>
    </AppProvider>
  );
};

export default AppContainer;
