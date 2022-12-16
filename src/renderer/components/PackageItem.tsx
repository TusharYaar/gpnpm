import { Accordion, Badge, Box, Code, Flex, Paper, Tabs, Text } from "@mantine/core";
import React, { useId, useMemo } from "react";
import { Package } from "../../types";
import PackageIcon from "./PackageIcon";

type Props = {
  name: string;
  details: Package;
};

const PackageItem = ({ name, details }: Props) => {
  const id = useId();

  const availibleUpdates = useMemo(() => {
    const updates = { major: 0, minor: 0, patch: 0 };
    details.usedIn.forEach((project) => {
      if (!project || !project.updates) return updates;
      if (project.updates.major) updates.major++;
      if (project.updates.minor) updates.minor++;
      if (project.updates.patch) updates.patch++;
    });

    return updates;
  }, [details]);

  return (
    <Paper>
      <Accordion>
        <Accordion.Item value="brief">
          <Accordion.Control>
            <Flex justify="space-between">
              <Flex align="center">
                <PackageIcon pack={name} />
                <Box ml="sm">
                  <Text>{name}</Text>
                  <Flex gap="sm">
                    {availibleUpdates?.major > 0 && (
                      <Badge color="green">{availibleUpdates.major} Major update avalible</Badge>
                    )}
                    {availibleUpdates?.minor > 0 && <Badge color="yellow">{availibleUpdates.minor} Minor</Badge>}
                    {availibleUpdates?.patch > 0 && <Badge color="red">{availibleUpdates.patch} Patch</Badge>}
                  </Flex>
                </Box>
              </Flex>
              <Badge>{details?.usedIn.length} projects</Badge>
            </Flex>
          </Accordion.Control>
          <Accordion.Panel>
            <Flex wrap="wrap" gap="sm">
              <Text fz="sm" fw={700}>
                Keywords
              </Text>
              {details?.npm?.keywords &&
                details.npm.keywords.map((word, index) => <Code key={`${id}-${word}-${index}`}>{word}</Code>)}
            </Flex>
            <Tabs defaultValue="projects">
              <Tabs.List>
                <Tabs.Tab value="projects" rightSection={<Badge>{details.usedIn.length}</Badge>}>
                  Projects
                </Tabs.Tab>
                <Tabs.Tab value="versions"> Versions </Tabs.Tab>
                <Tabs.Tab value="raw"> Raw </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="projects">
                {details.usedIn.map((project) => (
                  <div key={project.file}>
                    {project.file} -- {project.version}
                  </div>
                ))}
              </Tabs.Panel>
              <Tabs.Panel value="raw">
                <Code>{JSON.stringify(details, null, 4)}</Code>
              </Tabs.Panel>
            </Tabs>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Paper>
  );
};

export default PackageItem;
