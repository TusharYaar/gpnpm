import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Code, Flex, Tabs, Text, Box, TextInput, Button } from "@mantine/core";

import { Project } from "../../types";
import PackageIcon from "./PackageIcon";
import { sanitizeVersion } from "../../utils/functions";
import { useApp } from "../context/AppContext";
import { Remark } from "react-remark";
import DepedencyItem from "./DependencyItem";

type Props = {
  path: string;
  details: Project;
};

const ViewProjectItem = ({ path, details }: Props) => {
  const {
    store: { allPackages },
  } = useApp();
  const [markdown, setMarkdown] = useState<null | string>(null);
  const [packageJSON, setPackageJSON] = useState<null | string>(null);
  // const [selected, setSelected] = useState([]);
  const [editTitle, setEditTitle] = useState(false);

  const [title, setTitle] = useState(details.title);

  useEffect(() => {
    setTitle(details.title);
  }, [details]);

  const dependenciesKeys = useMemo(() => {
    return Object.keys(details.dependencies);
  }, [details]);

  const devDependenciesKeys = useMemo(() => {
    return Object.keys(details.devDependencies);
  }, [details]);

  // const toggleSelected = useCallback((id: string) => {
  //   setSelected((prev) => {
  //     if (prev.includes(id)) return prev.filter((p) => p !== id);
  //     else return [...prev, id];
  //   });
  // }, []);

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
      const text = await window.projectAPI.getFile(path);
      setPackageJSON(text);
    }
  }, [path]);

  const handleUpdateTitle = useCallback(
    (edit: boolean, title: string) => {
      if (edit) {
        setEditTitle(false);
        window.projectAPI.updateProjectTitle(path, title);
      } else setEditTitle(true);
    },
    [path]
  );

  return (
    <Box>
      <TextInput value={title} onChange={(text) => setTitle(text.target.value)} disabled={!editTitle} m={"md"} />
      <Button onClick={() => handleUpdateTitle(editTitle, title)}>Edit Title</Button>
      <Text>{path}</Text>
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
            <DepedencyItem key={dep} dependency={dep} details={allPackages[dep]} project={path} />
          ))}
        </Tabs.Panel>
        <Tabs.Panel value="devDependencies">
          {devDependenciesKeys.map((dep) => (
            <Flex key={`d-${dep}`} my="sm" align="center">
              <PackageIcon compact={true} pack={dep} />
              <Text mx="sm" fz="xs">
                {dep}: {sanitizeVersion(details.devDependencies[dep])}
              </Text>
            </Flex>
          ))}
        </Tabs.Panel>
        <Tabs.Panel value="scripts">
          {Object.keys(details.scripts).map((script) => (
            <Flex key={`s-${script}`} my="sm" align="center">
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
    </Box>
  );
};

export default ViewProjectItem;
