import { Progress, Text } from "@mantine/core";
import React from "react";
import { useApp } from "../context/AppContext";

const CurrentOperation = () => {
  const {
    systemCurrentState: { state, data },
  } = useApp();
  return (
    <div>
      <Text fz="xs">{state}</Text>
      {state === "fetching_package_details" && <Progress value={(data.current * 100) / data.total} />}
    </div>
  );
};

export default CurrentOperation;
