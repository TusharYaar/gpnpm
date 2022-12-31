import React, { useCallback, useId, useMemo, useState } from "react";
import { Accordion, Badge, Box, Code, Flex, Paper, Tabs, Text } from "@mantine/core";

import { Project } from "../../types";
import PackageIcon from "./PackageIcon";
import { sanitizeVersion } from "../../utils/functions";
import { useApp } from "../context/AppContext";
import { Remark } from "react-remark";

type Props = {
  name: string;
  details: Project;
};

const ProjectItem = ({ name, details }: Props) => {
  const {
    store: { allPackages },
  } = useApp();
  const pid = useId();
  const [markdown, setMarkdown] = useState<null | string>(null);
  const [packageJSON, setPackageJSON] = useState<null | string>(null);
  const [selected, setSelected] = useState([]);

  const dependenciesKeys = useMemo(() => {
    return Object.keys(details.dependencies);
  }, [details]);

  const devDependenciesKeys = useMemo(() => {
    return Object.keys(details.devDependencies);
  }, [details]);

  const toggleSelected = useCallback((id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      else return [...prev, id];
    });
  }, []);

  const openExternalLink = useCallback((link: string) => {
    console.log(link);
    window.systemAPI.openExternalLink(link);
  }, []);

  const handleOpenReadme = useCallback(async () => {
    if (markdown === null && details.markdownLocation) {
      const text = await window.projectAPI.getFile(details.markdownLocation);
      setMarkdown(text);
    }
  }, [markdown, details]);

  const handleOpenPackageJSON = useCallback(async () => {
    if (packageJSON === null) {
      const text = await window.projectAPI.getFile(name);
      setPackageJSON(text);
    }
  }, [name]);

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
                {details.markdownLocation && (
                  <Tabs.Tab value="markdown" onClick={handleOpenReadme}>
                    README.md
                  </Tabs.Tab>
                )}
                <Tabs.Tab value="scripts">Scripts </Tabs.Tab>
                <Tabs.Tab value="packageJSON" onClick={handleOpenPackageJSON}>
                  package.json
                </Tabs.Tab>
                <Tabs.Tab value="raw"> Raw </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="dependencies">
                {dependenciesKeys.map((dep) => (
                  <Flex key={`${pid}-d-${dep}`} my="sm" align="center">
                    <PackageIcon
                      compact={true}
                      pack={dep}
                      onClick={() => toggleSelected(dep)}
                      isSelected={selected.includes(dep)}
                    />
                    <Text mx="sm" fz="xs">
                      {dep}: {sanitizeVersion(details.dependencies[dep])}
                    </Text>
                    <Flex align="center">
                      {allPackages[dep]?.usedIn[name]?.updates?.major && (
                        <Badge color="green">Major Update {allPackages[dep].usedIn[name].updates.major}</Badge>
                      )}
                      {allPackages[dep]?.usedIn[name]?.updates?.minor && (
                        <Badge color="yellow">minor Update {allPackages[dep].usedIn[name].updates.minor}</Badge>
                      )}
                      {allPackages[dep]?.usedIn[name]?.updates?.patch && (
                        <Badge color="red">patch Update {allPackages[dep].usedIn[name].updates.patch}</Badge>
                      )}
                    </Flex>
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
              <Tabs.Panel value="markdown">
                <Remark
                  rehypeReactOptions={{
                    components: {
                      a: (props: JSX.IntrinsicElements["a"]) => (
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            openExternalLink(props.href);
                          }}
                          {...props}
                        />
                      ),
                    },
                  }}
                >
                  {markdown}
                </Remark>
              </Tabs.Panel>
              <Tabs.Panel value="packageJSON">
                <div>
                  <pre>{packageJSON}</pre>
                </div>
              </Tabs.Panel>
              <Tabs.Panel value="raw">
                <Code>{JSON.stringify(details, null, 2)}</Code>
              </Tabs.Panel>
            </Tabs>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Paper>
  );
};

export default ProjectItem;
