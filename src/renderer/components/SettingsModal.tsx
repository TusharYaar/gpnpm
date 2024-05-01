import { Box, Flex, Group, Modal, Radio, ScrollArea, Select, Switch, Text, useMantineColorScheme } from "@mantine/core";
import { useApp } from "../context/AppContext";
import { formatDistance, parseISO } from "date-fns";
import FilePathAndAction from "./FilePathAndAction";
import Themes, { Fonts } from "../themes";
import { useCallback } from "react";
import AppSettings from "../../main/modules/storage/AppSettings";

const DateValues = [
  { value: 86400 * 7, label: "1 Week" },
  { value: 86400 * 2, label: "2 Days" },
  { value: 86400, label: "1 Day" },
  { value: 60 * 60 * 12, label: "12 Hours" },
];

const SettingsModal = ({ opened }: { opened: boolean }) => {
  const { toggleSettingsModalVisible, store, updateSettings } = useApp();
  const { setColorScheme } = useMantineColorScheme();

  const handleUpdateSettings = useCallback(
    <T extends keyof AppSettings["settings"], K extends AppSettings["settings"][T]>(key: T, val: K) => {
      updateSettings({
        settings: {
          ...store.settings,
          [key]: val,
        },
      });
    },
    [store.settings]
  );
  const updateColorScheme = useCallback(
    (scheme: typeof store.settings.colorScheme) => {
      handleUpdateSettings("colorScheme", scheme);
      setColorScheme(scheme);
    },
    [handleUpdateSettings]
  );

  return (
    <>
      <Modal
        opened={opened}
        onClose={toggleSettingsModalVisible}
        title="Settings"
        centered
        size={600}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Flex direction="row" justify="space-between">
          <Text size="xs">{`App version: ${store.version}`}</Text>
          <Text size="xs">{`Last updated: ${formatDistance(new Date(), parseISO(store.modified))} ago`}</Text>
        </Flex>
        <Flex justify="space-between" direction="row" align="center" my="md">
          <Flex direction="column" justify="center" align="flex-start">
            <Text>Package Scan Interval</Text>
            <Text size="xs" mb="xs">
              Intervals at which packages versions are checked from NPM registry
            </Text>
          </Flex>
          <Select
            data={DateValues.map((d) => ({ ...d, value: d.value.toString() }))}
            w={150}
            value={store.settings.npmScanInterval.toString()}
            onChange={(value) => handleUpdateSettings("npmScanInterval", parseInt(value))}
          />
        </Flex>
        <Flex justify="space-between" direction="row" align="center" my="md">
          <Flex direction="column" justify="center" align="flex-start">
            <Text>Project Scan Interval</Text>
            <Text size="xs" mb="xs">
              Intervals at which projects are scanned for possible dependency updates
            </Text>
          </Flex>
          <Select
            data={DateValues.map((d) => ({ ...d, value: d.value.toString() }))}
            w={150}
            value={store.settings.projectScanInterval.toString()}
            onChange={(value) => handleUpdateSettings("projectScanInterval", parseInt(value))}
          />
        </Flex>
        <Box my="md">
          <Text>Scanned Folders</Text>
          <Text size="xs" mb="xs">
            These folders are scanned for projects with package.json files.
          </Text>
          {store.scanFolders.length > 0 ? (
            store.scanFolders.map((folder) => <FilePathAndAction path={folder} onClickAction={() => {}} key={folder} />)
          ) : (
            <Text ta="center" size="xs">
              No folders added.
            </Text>
          )}
        </Box>
        <Flex justify="space-between" direction="row" align="center" my="md">
          <Flex direction="column" justify="center" align="flex-start">
            <Text>Auto Add</Text>
            <Text size="xs" mb="xs">
              Automatically add projects created under scan folders.
            </Text>
          </Flex>
          <Switch
            checked={store.settings.automaticallyAddProjects}
            onChange={({ currentTarget }) => handleUpdateSettings("automaticallyAddProjects", currentTarget.checked)}
          />
        </Flex>
        <Box my="md">
          <Text>Skipped Folders</Text>
          <Text size="xs">These folders are skipped from scanning.</Text>
          {store.excludeFolders.map((folder) => (
            <FilePathAndAction path={folder} onClickAction={() => {}} key={folder} />
          ))}
        </Box>
        {/* <Box my="md">
          <Text>Exclude Packages</Text>
          <Text size="xs">These skipped from checking for newer versions.</Text>
          {store.excludePackages.map((folder) => (
            <FilePathAndAction path={folder} onClickAction={() => {}} key={folder} />
          ))}
        </Box> */}
        <Box my="md">
          <Text>Apperance</Text>
          <Text size="xs">Look and feel of the Application.</Text>
          <Flex direction="row" justify="space-between" align="center">
            <Text size="sm">Theme</Text>
            <Select
              data={Object.entries(Themes).map((t) => ({ value: t[0], label: t[1].label }))}
              w={150}
              value={store.settings.theme}
            />
          </Flex>
          <Flex direction="row" justify="space-between" align="center" my="sm">
            <Text size="sm">Color Scheme</Text>
            <Radio.Group value={store.settings.colorScheme} onChange={updateColorScheme}>
              <Group>
                <Radio value="light" label="Light" />
                <Radio value="dark" label="Dark" />
                <Radio value="auto" label="Auto" />
              </Group>
            </Radio.Group>
          </Flex>
          <Flex direction="row" justify="space-between" align="center">
            <Text size="sm">Primary Font</Text>
            <Select
              data={Fonts}
              w={150}
              value={store.settings.primaryFont}
              onChange={(value) => handleUpdateSettings("primaryFont", value as typeof store.settings.codeFont)}
            />
          </Flex>
          <Flex direction="row" justify="space-between" align="center" my="sm">
            <Text size="sm">Code Font</Text>
            <Select
              data={Fonts}
              w={150}
              value={store.settings.codeFont}
              onChange={(value) => handleUpdateSettings("codeFont", value as typeof store.settings.codeFont)}
            />
          </Flex>
        </Box>
      </Modal>
    </>
  );
};

export default SettingsModal;
