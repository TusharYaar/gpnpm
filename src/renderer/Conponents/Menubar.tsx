import { Button, Navbar, NavLink } from "@mantine/core";
import React from "react";
import { useApp } from "../context/AppContext";

import { Link, useLocation } from "react-router-dom";

const Menubar = () => {
  const { openFileAddDialog } = useApp();
  const location = useLocation();

  return (
    <Navbar width={{ base: 200 }} p="xs">
      <Button onClick={openFileAddDialog}>Add Folder</Button>
      <NavLink label="Home" component={Link} to="/" active={location.pathname === "/"} />
      <NavLink
        label="All Packages"
        component={Link}
        to="/all_packages"
        active={location.pathname === "/all_packages"}
      />
    </Navbar>
  );
};

export default Menubar;
