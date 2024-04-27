import { ActionIcon, Flex, Text, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { TbTrash } from "react-icons/tb";

type Props = {
  path: string;
  onClickAction: () => void;
};

const FilePathAndAction = ({ path, onClickAction }: Props) => {
  const { colors } = useMantineTheme();
  console.log(path);
  const { colorScheme } = useMantineColorScheme();
  return (
    <Flex bg={colorScheme === "light" ? colors.gray[3] : colors.gray[8]} justify="space-between" align="center">
      <Text size="sm" mx="xs" component="span">
        {path}
      </Text>
      <ActionIcon onClick={onClickAction} variant="subtle" style={{ borderRadius: 0 }}>
        <TbTrash />
      </ActionIcon>
    </Flex>
  );
};

export default FilePathAndAction;
