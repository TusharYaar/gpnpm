import { Code, Flex, Tabs, Box, Title } from "@mantine/core";
import React, { useMemo } from "react";
import { Package } from "../../types";
import PackageIcon from "./PackageIcon";

type Props = {
  name: string;
  details: Package;
};

const ViewPackageItem = ({ name, details }: Props) => {
  const availibleUpdates = useMemo(() => {
    const updates = { major: 0, minor: 0, patch: 0 };
    Object.values(details.usedIn).forEach((value) => {
      if (value.updates) {
        if (value.updates.major) updates.major++;
        if (value.updates.minor) updates.minor++;
        if (value.updates.patch) updates.patch++;
      }
    });

    return updates;
  }, [details]);
  return (
    <div>
      <Box
      // sx={(theme) => ({
      //   backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.blue[1],
      //   padding: theme.spacing.sm,
      //   borderRadius: theme.radius.md,
      // })}
      >
        <Flex>
          <PackageIcon pack={name} />
          <Title order={2}>{name}</Title>
        </Flex>
        {JSON.stringify(availibleUpdates)}
      </Box>
      <Tabs defaultValue="projects">
        <Tabs.List>
          <Tabs.Tab value="projects">Projects</Tabs.Tab>
          <Tabs.Tab value="versions"> Versions </Tabs.Tab>
          <Tabs.Tab value="raw"> Raw </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="projects">
          {Object.keys(details.usedIn).map((project) => (
            <div key={project}>{project} --</div>
          ))}
        </Tabs.Panel>
        <Tabs.Panel value="raw">
          <Code>{JSON.stringify(details, null, 4)}</Code>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default ViewPackageItem;
