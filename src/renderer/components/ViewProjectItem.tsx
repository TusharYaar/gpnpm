import React, { useCallback, useState } from "react";
import { Code, Flex, Tabs, Text, Box, TextInput, Button, Table } from "@mantine/core";

import { Project } from "../../types";
// import PackageIcon from "./PackageIcon";
// import { sanitizeVersion } from "../../utils/functions";
// import { useApp } from "../context/AppContext";
import { Remark } from "react-remark";
import { sanitizeVersion } from "../../utils/functions";
// import DepedencyItem from "./DependencyItem";

type Props = {
  path: string;
  project: Project;
};

const ViewProjectItem = ({ path, project }: Props) => {
  // const {
  //   store: { allPackages },
  // } = useApp();
  const [markdown, setMarkdown] = useState<null | string>(null);
  const [packageJSON, setPackageJSON] = useState<null | string>(null);
  // const [selected, setSelected] = useState([]);
  const [editTitle, setEditTitle] = useState(false);

  const [title, setTitle] = useState(project.title);

  // useEffect(() => {
  //   setTitle(project.title);
  // }, [project]);

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
    if (markdown === null && project.markdownLocation) {
      const text = await window.projectAPI.getFile(project.markdownLocation);
      setMarkdown(text);
    }
  }, [markdown, project]);

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
          <Tabs.Tab value="dependencies">Dependencies</Tabs.Tab>
          {project.markdownLocation && (
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
          <Table striped withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Packages</Table.Th>
                <Table.Th>Current</Table.Th>
                <Table.Th>Wanted</Table.Th>
                <Table.Th>latest</Table.Th>
                <Table.Th>Minor</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {Object.entries(project.dependencies).map(([pack, values]) => (
                <Table.Tr key={pack}>
                  <Table.Td>{pack}</Table.Td>
                  <Table.Td>{sanitizeVersion(values.currect)}</Table.Td>
                  <Table.Td>{values.wanted || ""}</Table.Td>
                  <Table.Td>{values.major || ""}</Table.Td>
                  <Table.Td>{values.minor || ""}</Table.Td>
                  <Table.Td>{values.patch || ""}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>
        {/*
        <Tabs.Panel value="devDependencies">
          {devDependenciesKeys.map((dep) => (
            <Flex key={`d-${dep}`} my="sm" align="center">
              <PackageIcon compact={true} pack={dep} />
              <Text mx="sm" fz="xs">
                {/* {dep}: {sanitizeVersion(details.devDependencies[dep])} }
              </Text>
            </Flex>
          ))}
        </Tabs.Panel> */}
        <Tabs.Panel value="scripts">
          {Object.keys(project.scripts).map((script) => (
            <Flex key={`s-${script}`} my="sm" align="center">
              <Text mx="sm" fz="xs">
                {script} - {project.scripts[script]}
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
          <Code>{JSON.stringify(project, null, 2)}</Code>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

export default ViewProjectItem;
