import React from "react";

import { Flex, Text, Badge } from "@mantine/core";
import { Package } from "../../types";
import PackageIcon from "./PackageIcon";
import { sanitizeVersion } from "../../utils/functions";

const DepedencyItem = ({ dependency, details, project }: { dependency: string; details: Package; project: string }) => {
  details.usedIn;
  return (
    <Flex my="sm">
      <PackageIcon compact={true} pack={dependency} size={45} />
      <Flex direction="column" px="sm">
        <Text fz="sm">
          {dependency}: {sanitizeVersion(details.usedIn[project].version)}
        </Text>
        <Flex align="center">
          {details?.usedIn[project]?.updates?.major && (
            <Badge color="green">Major Update {details.usedIn[project].updates.major}</Badge>
          )}
          {details?.usedIn[project]?.updates?.minor && (
            <Badge color="yellow">minor Update {details.usedIn[project].updates.minor}</Badge>
          )}
          {details?.usedIn[project]?.updates?.patch && (
            <Badge color="red">patch Update {details.usedIn[project].updates.patch}</Badge>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default DepedencyItem;
