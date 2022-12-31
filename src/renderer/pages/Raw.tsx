// TODO: DELETE BEFORE PUBLISHING

import React from "react";
import { useApp } from "../context/AppContext";

const Raw = () => {
  const { store } = useApp();
  return <pre>{JSON.stringify(store, null, 4)}</pre>;
};

export default Raw;
