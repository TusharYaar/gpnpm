import React from "react";
import { AppShell, Header, MantineProvider } from "@mantine/core";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import Menubar from "./Conponents/Menubar";
import CurrentOperation from "./Conponents/CurrentOperation";

const AppContainer = () => {
  return (
    <AppProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AppShell
          navbar={<Menubar />}
          header={
            <Header height={20}>
              <CurrentOperation />
            </Header>
          }
        >
          <App />
        </AppShell>
      </MantineProvider>
    </AppProvider>
  );
};

export default AppContainer;
