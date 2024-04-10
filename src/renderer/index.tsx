import "@mantine/core/styles.css";
import { createRoot } from "react-dom/client";
import AppContainer from "./AppContainer";
import { AppProvider } from "./context/AppContext";
import { MantineProvider } from "@mantine/core";

function App() {
  return (
    <MantineProvider>
      <AppProvider>
        <AppContainer />
      </AppProvider>
    </MantineProvider>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
