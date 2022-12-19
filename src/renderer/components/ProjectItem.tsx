import React, { useId, useMemo } from "react";
import { Accordion, Box, Code, Flex, Paper, Tabs, Text } from "@mantine/core";

import { Project } from "../../types";
import PackageIcon from "./PackageIcon";
import { sanitizeVersion } from "../../utils/functions";

type Props = {
  name: string;
  details: Project;
};

const ProjectItem = ({ name, details }: Props) => {
  const pid = useId();

  const dependenciesKeys = useMemo(() => {
    return Object.keys(details.dependencies);
  }, [details]);

  const devDependenciesKeys = useMemo(() => {
    return Object.keys(details.devDependencies);
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
                  <Flex gap="sm"></Flex>
                </Box>
              </Flex>
            </Flex>
          </Accordion.Control>
          <Accordion.Panel>
            <Tabs defaultValue="dependencies">
              <Tabs.List>
                {dependenciesKeys.length > 0 && <Tabs.Tab value="dependencies">Dependencies</Tabs.Tab>}
                {devDependenciesKeys.length > 0 && <Tabs.Tab value="devDependencies"> Dev Dependencies </Tabs.Tab>}
                <Tabs.Tab value="scripts">Scripts </Tabs.Tab>
                <Tabs.Tab value="raw"> Raw </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="dependencies">
                {dependenciesKeys.map((dep) => (
                  <Flex key={`${pid}-d-${dep}`} my="sm" align="center">
                    <PackageIcon compact={true} pack={dep} />
                    <Text mx="sm" fz="xs">
                      {dep}: {sanitizeVersion(details.dependencies[dep])}
                    </Text>
                  </Flex>
                ))}
              </Tabs.Panel>
              <Tabs.Panel value="devDependencies">
                {devDependenciesKeys.map((dep) => (
                  <Flex key={`${pid}-d-${dep}`} my="sm" align="center">
                    <PackageIcon compact={true} pack={dep} />
                    <Text mx="sm" fz="xs">
                      {dep}: {sanitizeVersion(details.devDependencies[dep])}
                    </Text>
                  </Flex>
                ))}
              </Tabs.Panel>
              <Tabs.Panel value="scripts">
                {Object.keys(details.scripts).map((script) => (
                  <Flex key={`${pid}-s-${script}`} my="sm" align="center">
                    <Text mx="sm" fz="xs">
                      {script} - {details.scripts[script]}
                    </Text>
                  </Flex>
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

export default ProjectItem;
