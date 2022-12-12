import { Text } from "@mantine/core";
import React from "react";
import { useApp } from "../context/AppContext";

const CurrentOperation = () => {
  const { systemCurrentState } = useApp();
  return <Text fz="xs">{JSON.stringify(systemCurrentState)}</Text>;
};

export default CurrentOperation;
