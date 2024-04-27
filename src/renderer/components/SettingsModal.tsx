import { Box, Flex, Group, Modal, Radio, ScrollArea, Select, Text, useMantineColorScheme } from "@mantine/core";
import { useApp } from "../context/AppContext";
import { formatDistance, parseISO } from "date-fns";
import FilePathAndAction from "./FilePathAndAction";
import Themes, { Fonts } from "../themes";
import { useCallback } from "react";
import AppSettings from "../../main/modules/storage/AppSettings";
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
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Flex direction="row" justify="space-between">
          <Text size="xs">{`App version: ${store.version}`}</Text>
          <Text size="xs">{`Last updated: ${formatDistance(new Date(), parseISO(store.modified))} ago`}</Text>
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
        <Box my="md">
          <Text>Skipped Folders</Text>
          <Text size="xs">These folders are skipped from scanning.</Text>
          {store.excludeFolders.map((folder) => (
            <FilePathAndAction path={folder} onClickAction={() => {}} key={folder} />
          ))}
        </Box>
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
