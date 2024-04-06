import "@mantine/core/styles.css";
import { createRoot } from "react-dom/client";
import AppContainer from "./AppContainer";
import { AppProvider } from "./context/AppContext";
import { MantineProvider } from "@mantine/core";

function App() {
  return (
    <AppProvider>
      <MantineProvider>
        <AppContainer />
      </MantineProvider>
    </AppProvider>
  );
}

const root = createRoot(document.body);
root.render(<App />);
