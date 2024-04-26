// TODO: DELETE BEFORE PUBLISHING

import React from "react";
import { useApp } from "../context/AppContext";
// import { Code } from "@mantine/core";
import JsonCode from "../components/JsonCode";

const Raw = () => {
  const { store } = useApp();
  return <JsonCode code={store} />;
};

export default Raw;
