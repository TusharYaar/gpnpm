import { Button, Navbar } from "@mantine/core";
import React from "react";
import { useApp } from "../context/AppContext";

const Menubar = () => {
  const { openFileAddDialog } = useApp();

  return (
    <Navbar width={{ base: 200 }} p="xs">
      <Button onClick={openFileAddDialog}>Add Folder</Button>
    </Navbar>
  );
};

export default Menubar;
