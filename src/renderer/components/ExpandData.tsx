import { Box, Flex, Text, BoxProps, useMantineTheme } from "@mantine/core";
import React, { ReactNode, useState } from "react";
import { TbCaretDown, TbCaretUp } from "react-icons/tb";

type Props = {
  title: string | number;
  children: ReactNode;
} & BoxProps;

const ExpandData = ({ title, children, ...properties }: Props) => {
  const { fontFamilyMonospace } = useMantineTheme();
  const [expanded, setExpanded] = useState(false);
  return (
    <Box {...properties}>
      <Flex direction={expanded ? "column" : "row"}>
        <Flex direction="row" align="center" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? <TbCaretUp size={16} /> : <TbCaretDown size={16} />}
          <Text fw={700} style={{ fontFamily: fontFamilyMonospace }} ml={4}>
            {title}
          </Text>
        </Flex>
        {expanded && <Box ml="xl">{children}</Box>}
      </Flex>
    </Box>
  );
};

export default ExpandData;
