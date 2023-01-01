import { Text, Box } from "@mantine/core";
import React from "react";
import PackageIcon from "./PackageIcon";

type Props = {
  name: string;
  onClick: () => void;
  active?: boolean;
};

const PackageItem = ({ name, onClick, active = false }: Props) => {
  {
    active;
  }
  return (
    <Box
      onClick={onClick}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        display: "flex",
        alignItems: "center",
        padding: theme.spacing.sm,
        cursor: "pointer",

        "&:hover": {
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
        },
      })}
    >
      <PackageIcon pack={name} />
      <Text>{name}</Text>
    </Box>
  );
};

export default PackageItem;
