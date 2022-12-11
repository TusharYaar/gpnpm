import { Text } from "@mantine/core";
import React from "react";
import { useApp } from "../context/AppContext";

const CurrentOperation = () => {
  const { systemState } = useApp();
  return <Text fz="xs">{JSON.stringify(systemState)}</Text>;
};

export default CurrentOperation;
