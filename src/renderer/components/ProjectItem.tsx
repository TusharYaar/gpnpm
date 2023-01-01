import React from "react";
import { Box, Breadcrumbs } from "@mantine/core";

type Props = {
  name: string;
  onClick: () => void;
};

const ProjectItem = ({ name, onClick }: Props) => {
  return (
    <Box
      onClick={onClick}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        display: "flex",
        alignItems: "center",
        padding: theme.spacing.sm,
        cursor: "pointer",
        wordBreak: "break-all",

        "&:hover": {
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
        },
      })}
    >
      <Breadcrumbs separator="→">{name.split("\\").splice(0, name.split("\\").length - 2)}</Breadcrumbs>
    </Box>
  );
};

export default ProjectItem;
