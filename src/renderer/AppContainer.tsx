import { AppShell } from "@mantine/core";
import App from "./pages/App";
import Menubar from "./components/Menubar";
import CurrentOperation from "./components/CurrentOperation";

import { Routes, Route, HashRouter } from "react-router-dom";
import AllPackages from "./pages/AllPackages";
import AllProjects from "./pages/AllProjects";
import Raw from "./pages/Raw";

const AppContainer = () => {
  return (
    <HashRouter>
      <AppShell
        padding={0}
        navbar={{
          width: 40,
          breakpoint: 0,
        }}
        footer={{
          height: 24,
        }}
      >
        <AppShell.Navbar zIndex={1}>
          <Menubar />
        </AppShell.Navbar>
        <AppShell.Footer>
          <CurrentOperation />
        </AppShell.Footer>
        <AppShell.Main>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/all_packages" element={<AllPackages />} />
            <Route path="/all_projects" element={<AllProjects />} />
            <Route path="/raw" element={<Raw />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </HashRouter>
  );
};

export default AppContainer;
