import { Box, Progress, Text } from "@mantine/core";
import { useApp } from "../context/AppContext";

const CurrentOperation = () => {
  const {
    systemCurrentState: { state, data },
  } = useApp();
  return (
    <Box style={{ zIndex: 10 }}>
      <Text fz="xs">{state}</Text>
      {state === "fetching_package_details" && <Progress value={(data.current * 100) / data.total} />}
      {state === "fetching_package_details" && `${data.package}  ${data.current} of ${data.total}`}
    </Box>
  );
};

export default CurrentOperation;
