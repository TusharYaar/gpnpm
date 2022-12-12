import React from "react";
import { AppShell, Header, MantineProvider } from "@mantine/core";
import App from "./pages/App";
import { AppProvider } from "./context/AppContext";
import Menubar from "./Conponents/Menubar";
import CurrentOperation from "./Conponents/CurrentOperation";

import { Routes, Route, HashRouter } from "react-router-dom";
import AllPackages from "./pages/AllPackages";

const AppContainer = () => {
  return (
    <AppProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <HashRouter>
          <AppShell
            navbar={<Menubar />}
            header={
              <Header height={20}>
                <CurrentOperation />
              </Header>
            }
          >
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/all_packages" element={<AllPackages />} />
            </Routes>
          </AppShell>
        </HashRouter>
      </MantineProvider>
    </AppProvider>
  );
};

export default AppContainer;
