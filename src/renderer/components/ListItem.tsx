import { Paper } from "@mantine/core";
import React from "react";
import "./styles.css";
type Props = {
  title: string;
  selected?: boolean;
  onClick?: () => void;
};

const ListItem = ({ title, selected = false, onClick }: Props) => {
  return (
    <Paper
      component="div"
      className={`listItem ${selected ? "selected" : ""}`}
      onClick={onClick}
      p="sm"
      //   style={(theme) => {
      //     // backgroundColor: theme. === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      //     console.log(theme);
      //     return {
      //       "&:hover": {
      //         backgroundColor: theme.colors.gray[1],
      //       },
      //     };
      //   }}
    >
      {title}
    </Paper>
  );
};

export default ListItem;
