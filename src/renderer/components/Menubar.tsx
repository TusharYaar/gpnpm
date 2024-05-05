import { Tooltip, ActionIcon, Flex, useComputedColorScheme, useMantineTheme } from "@mantine/core";
import { useApp } from "../context/AppContext";
import {
  TbFolderPlus,
  TbHome,
  TbSourceCode,
  TbSettings,
  TbPackages,
  TbDeviceDesktopCode,
  TbFileSearch,
} from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";

const Menubar = () => {
  const location = useLocation();
  const { handleAddScanFolder, settingsModalVisible, toggleSettingsModalVisible } = useApp();
  const scheme = useComputedColorScheme();
  const { colors } = useMantineTheme();
  return (
    <Flex
      justify="space-between"
      direction="column"
      align="center"
      flex="1"
      bg={scheme === "dark" ? colors.dark[8] : colors.gray[0]}
    >
      <div>
        <Tooltip label="Add New Folder" position="right">
          <ActionIcon size={40} variant="transparent" onClick={handleAddScanFolder}>
            <TbFolderPlus size={24} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Home" position="right">
          <ActionIcon size={40} variant={location.pathname === "/" ? "light" : "transparent"} component={Link} to="/">
            <TbHome size={24} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="All Packages" position="right">
          <ActionIcon
            size={40}
            variant={location.pathname === "/all_packages/" ? "light" : "transparent"}
            component={Link}
            to="/all_packages"
          >
            <TbPackages size={24} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="All Projects" position="right">
          <ActionIcon
            size={40}
            variant={location.pathname === "/all_projects/" ? "light" : "transparent"}
            component={Link}
            to="/all_projects"
          >
            <TbDeviceDesktopCode size={24} />
          </ActionIcon>
        </Tooltip>
      </div>
      <div>
        <ActionIcon size={40} variant="transparent" onClick={window.projectAPI.checkForPackagesUpdate}>
          <TbFileSearch size={24} />
        </ActionIcon>
        <Tooltip label="Settings" position="right">
          <ActionIcon
            size={40}
            variant={settingsModalVisible ? "light" : "transparent"}
            onClick={toggleSettingsModalVisible}
          >
            <TbSettings size={24} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Raw Data" position="right">
          <ActionIcon
            size={40}
            variant={location.pathname === "/raw" ? "light" : "transparent"}
            component={Link}
            to="/raw"
          >
            <TbSourceCode size={24} />
          </ActionIcon>
        </Tooltip>
      </div>
    </Flex>
  );
};

export default Menubar;
