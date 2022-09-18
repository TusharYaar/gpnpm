import React from "react";
import { MantineProvider } from "@mantine/core";
import App from "./App";
const AppContainer = () => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  );
};

export default AppContainer;
