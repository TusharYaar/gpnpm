import { Box, Flex, Modal, Stack, Text } from "@mantine/core";
import React from "react";
import { useApp } from "../context/AppContext";
import { formatDistance, parseISO } from "date-fns";

const SettingsModal = ({ opened }: { opened: boolean }) => {
  const { toggleSettingsModalVisible, store } = useApp();
  return (
    <>
      <Modal opened={opened} onClose={toggleSettingsModalVisible} title="Settings" centered>
        <Flex direction="row" justify="space-between">
          <Text size="xs">{`App version: ${store.version}`}</Text>
          <Text size="xs">{`Last updated: ${formatDistance(new Date(), parseISO(store.modified))} ago`}</Text>
        </Flex>
        <Box>
          <Text>Scanned Folders</Text>
          <Stack align="stretch">
            {store.scanFolders.map((folder) => (
              <Box>
                <Text>{folder}</Text>
              </Box>
            ))}
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default SettingsModal;
