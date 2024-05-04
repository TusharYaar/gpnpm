import { ActionIcon, Box, Flex } from "@mantine/core";
import React from "react";
import { TbX, TbCopy, TbSquare, TbMinus } from "react-icons/tb";

import "./styles.css";

const Titlebar = () => {
  const isMaximized = true;
  return (
    <Flex justify="space-between" className="draggable">
      <Box></Box>
      <Box>
        <ActionIcon size={32} variant="subtle" radius={0} onClick={window.systemAPI.minimizeWindow}>
          <TbMinus />
        </ActionIcon>
        <ActionIcon size={32} variant="subtle" radius={0} onClick={window.systemAPI.maximizeWindow}>
          {isMaximized ? <TbCopy /> : <TbSquare />}
        </ActionIcon>
        <ActionIcon size={32} variant="subtle" radius={0} color="red" onClick={window.systemAPI.closeWindow}>
          <TbX />
        </ActionIcon>
      </Box>
    </Flex>
  );
};

export default Titlebar;
