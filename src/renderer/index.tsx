import React from "react";
import { createRoot } from "react-dom/client";
import AppContainer from "./AppContainer";

function render() {
  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(<AppContainer />);
}
render();
