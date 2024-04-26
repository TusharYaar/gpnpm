import "@mantine/core/styles.css";
import { createRoot } from "react-dom/client";
import AppContainer from "./AppContainer";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <AppContainer />
    </AppProvider>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
