import { ActionIcon, Flex, Indicator, Progress, Text } from "@mantine/core";
import { useApp } from "../context/AppContext";
import { TbBell } from "react-icons/tb";
import { useState } from "react";
import NotificationDialog from "./NotificationDialog";

const CurrentOperation = () => {
  const {
    systemCurrentState: { state, data },
    notifications,
  } = useApp();
  const [notificationOpen, setNotificationOpen] = useState(false);
  return (
    <Flex style={{ zIndex: 10 }} justify="space-between">
      <Text fz="xs">{state}</Text>
      {state === "fetching_package_details" && <Progress value={(data.current * 100) / data.total} />}
      {state === "fetching_package_details" && `${data.package}  ${data.current} of ${data.total}`}
      <Indicator disabled={notifications.unread === 0} size={5} position="top-start" offset={5}>
        <ActionIcon size={24} radius={0} variant="transparent" onClick={() => setNotificationOpen((prev) => !prev)}>
          <TbBell />
        </ActionIcon>
      </Indicator>
      <NotificationDialog
        opened={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        notifications={notifications}
      />
    </Flex>
  );
};

export default CurrentOperation;
