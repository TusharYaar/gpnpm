import { BoxProps, Flex, Text } from "@mantine/core";
import ExpandData from "../pages/ExpandData";

type Props = {
  code: unknown;
} & BoxProps;
const JsonCode = ({ code, ...properties}: Props) => {
  if (typeof code === "undefined") return;
  else if (typeof code === "object" && code !== null) {
    return (
      <>
        {Object.entries(code).map((obj) => {
          if (typeof obj[1] === "object")
            return (
              <ExpandData title={obj[0]}>
                <JsonCode {...properties} code={obj[1]}/>
              </ExpandData>
            );
          else {
            
            return (
                <Flex direction={"row"}  ml="lg">
              <Text fw={700} style={{ fontFamily: "KodeMono" }}>
                {`${obj[0]}: `}
              </Text>
              <Text style={{ fontFamily: "KodeMono" }} ml="xs">
                {`${obj[1]}`}
              </Text>
            </Flex>
            );
        }
        })}
      </>
    );
  } else return <ExpandData title={""}>{code as string}</ExpandData>;
};

export default JsonCode;
