import React from "react";
import { AppShell, Header, MantineProvider } from "@mantine/core";
import App from "./pages/App";
import { AppProvider } from "./context/AppContext";
import Menubar from "./components/Menubar";
import CurrentOperation from "./components/CurrentOperation";

import { Routes, Route, HashRouter } from "react-router-dom";
import AllPackages from "./pages/AllPackages";
import AllProjects from "./pages/AllProjects";
import Folders from "./pages/Folders";
import Settings from "./pages/Settings";
import Raw from "./pages/Raw";

const AppContainer = () => {
  return (
    <AppProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <HashRouter>
          <AppShell
            padding={0}
            navbar={<Menubar />}
            header={
              <Header height={50}>
                <CurrentOperation />
              </Header>
            }
          >
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/all_packages" element={<AllPackages />} />
              <Route path="/all_projects" element={<AllProjects />} />
              <Route path="/folders" element={<Folders />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/raw" element={<Raw />} />
            </Routes>
          </AppShell>
        </HashRouter>
      </MantineProvider>
    </AppProvider>
  );
};

export default AppContainer;
