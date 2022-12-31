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
      <NavLink
        label="All Projects"
        component={Link}
        to="/all_projects"
        active={location.pathname === "/all_projects"}
      />
      <NavLink label="Folders" component={Link} to="/folders" active={location.pathname === "/folders"} />
      <NavLink label="Settings" component={Link} to="/settings" active={location.pathname === "/settings"} />
      <NavLink label="Raw" component={Link} to="/raw" active={location.pathname === "/raw"} />
    </Navbar>
  );
};

export default Menubar;
