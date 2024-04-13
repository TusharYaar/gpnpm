import { Tooltip, ActionIcon, Flex } from "@mantine/core";
import { useApp } from "../context/AppContext";
import { TbFolderPlus, TbHome, TbSourceCode, TbSettings, TbPackages, TbDeviceDesktopCode } from "react-icons/tb";
import { Link } from "react-router-dom";

const Menubar = () => {
  const { handleAddScanFolder } = useApp();
  return (
    <Flex justify="space-between" direction="column" align="center" flex="1">
      <div>
        <Tooltip label="Add New Folder" position="right">
          <ActionIcon size={40} variant="transparent" onClick={handleAddScanFolder}>
            <TbFolderPlus size={24} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Home" position="right">
          <ActionIcon size={40} variant="transparent" component={Link} to="/">
            <TbHome size={24} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="All Packages" position="right">
          <ActionIcon size={40} variant="transparent" component={Link} to="/all_packages">
            <TbPackages size={24} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="All Projects" position="right">
          <ActionIcon size={40} variant="transparent" component={Link} to="/all_projects">
            <TbDeviceDesktopCode size={24} />
          </ActionIcon>
        </Tooltip>
      </div>
      <div>
        <Tooltip label="Settings" position="right">
          <ActionIcon size={40} variant="transparent" component={Link} to="/settings">
            <TbSettings size={24} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Raw Data" position="right">
          <ActionIcon size={40} variant="transparent" component={Link} to="/raw">
            <TbSourceCode size={24} />
          </ActionIcon>
        </Tooltip>
      </div>
    </Flex>
  );
};

export default Menubar;
