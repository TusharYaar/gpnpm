import React from "react";
import { Box, Text } from "@mantine/core";

type Props = {
  title: string;
  path: string;
  onClick: () => void;
};

const ProjectItem = ({ title, path, onClick }: Props) => {
  return (
    <Box
      onClick={onClick}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: theme.spacing.sm,
        cursor: "pointer",
        wordBreak: "break-all",

        "&:hover": {
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
        },
      })}
    >
      <Text fw={700}>{title}</Text>
      <Text fz="xs">{path}</Text>
    </Box>
  );
};

export default ProjectItem;
