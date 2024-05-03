import { ActionIcon, Dialog, Flex, ScrollArea, Text, useComputedColorScheme, useMantineTheme } from "@mantine/core";
import { TbX } from "react-icons/tb";
import { NotificationState } from "../../types";

type Props = {
  opened: boolean;
  onClose: () => void;
  notifications: NotificationState;
};

const NotificationDialog = ({ opened, onClose, notifications }: Props) => {
  const colorScheme = useComputedColorScheme();
  const { colors } = useMantineTheme();
  return (
    <Dialog
      opened={opened}
      bg={colorScheme === "dark" ? colors.dark[5] : colors.gray[0]}
      w={400}
      p={0}
      m={0}
      radius={0}
      mih={0}
      position={{ right: 8, bottom: 30 }}
    >
      <Flex justify="space-between" align="center" bg={colorScheme === "dark" ? colors.dark[7] : colors.gray[2]}>
        <Text size="sm" mx="xs">
          {notifications.unread === 0 ? "No new notifications" : `${notifications.unread} new notifications`}
        </Text>
        <ActionIcon onClick={onClose} variant="transparent" size={24}>
          <TbX />
        </ActionIcon>
      </Flex>
      {notifications.total > 0 ? (
        <ScrollArea h={200 - 25}>
          {notifications.notifications.map((noti) => (
            <Text size="sm">
              {noti.title} <Text size="xs">{noti.description}</Text>
            </Text>
          ))}
        </ScrollArea>
      ) : null}
    </Dialog>
  );
};

export default NotificationDialog;
