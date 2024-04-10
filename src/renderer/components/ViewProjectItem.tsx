import { useCallback, useState, useEffect } from "react";
import {
  Code,
  Flex,
  Tabs,
  Text,
  Box,
  Table,
  Breadcrumbs,
  Title,
  Divider,
  ActionIcon,
  BackgroundImage,
  TextInput,
} from "@mantine/core";
import { TbPencil, TbCheck } from "react-icons/tb";
import { Project } from "../../types";
import { Remark } from "react-remark";
import { sanitizeVersion } from "../../utils/functions";
import image from "../assets/bg-9.png";

type Props = {
  path: string;
  project: Project;
};

const ViewProjectItem = ({ path, project }: Props) => {
  const [markdown, setMarkdown] = useState<null | string>(null);
  const [icon, setIcon] = useState("");
  const [packageJSON, setPackageJSON] = useState<null | string>(null);
  // const [selected, setSelected] = useState([]);
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [updatedTitle, setUpdatedTitle] = useState(project.title);

  useEffect(() => {
    setTitle(project.title);
    setUpdatedTitle(project.title);
    getProjectIcon(project.iconLocation);
  }, [project]);

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
      const text = await window.projectAPI.getFile(project.markdownLocation, "markdown");
      setMarkdown(text);
    }
  }, [markdown, project]);

  const getProjectIcon = useCallback(async (icon: string) => {
    if (icon) {
      const text = await window.projectAPI.getFile(icon, "image");
      setIcon(text);
    } else setIcon("");
  }, []);

  const handleOpenPackageJSON = useCallback(async () => {
    if (packageJSON === null) {
      const text = await window.projectAPI.getFile(project.packageJsonLocation, "json");
      setPackageJSON(JSON.stringify(text, null, 4));
    }
  }, [project]);

  const handleUpdateTitle = useCallback(
    (title: string) => {
      setEditTitle(false);
      window.projectAPI.updateProjectTitle(path, title);
      setTitle(title);
    },
    [path]
  );

  return (
    <Box>
      <Flex direction="row" align="center">
        <Box style={{ position: "relative" }}>
          {/* <ActionIcon variant="subtle" style={{ position: "absolute", right: 0, bottom: 0 }}>
            <TbPencil />
          </ActionIcon> */}
          <BackgroundImage radius="md" src={icon.length > 0 ? icon : image} w={100} h={100} component="button" />
        </Box>
        <Flex direction="column" p="sm">
          {editTitle ? (
            <TextInput
              value={updatedTitle}
              onChange={(event) => setUpdatedTitle(event.currentTarget.value)}
              rightSectionPointerEvents="all"
              rightSection={
                <ActionIcon variant="subtle">
                  <TbCheck onClick={() => handleUpdateTitle(updatedTitle)} />
                </ActionIcon>
              }
            />
          ) : (
            <Flex direction="row" align="center">
              <Title order={2}>{title}</Title>
              <ActionIcon variant="subtle" aria-label="Edit Title" ml="md" onClick={() => setEditTitle((p) => !p)}>
                <TbPencil />
              </ActionIcon>
            </Flex>
          )}
          <Divider my="xs" />
          <Breadcrumbs separator="→">{path.split("\\")}</Breadcrumbs>
          <Flex>
            <Text> {Object.keys(project.dependencies).length} dependencies </Text>
          </Flex>
        </Flex>
      </Flex>
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
                {/* <Table.Th>latest</Table.Th>
                <Table.Th>Minor</Table.Th> */}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {Object.entries(project.dependencies).map(([pack, values]) => (
                <Table.Tr key={pack}>
                  <Table.Td>{pack}</Table.Td>
                  <Table.Td>{sanitizeVersion(values.currect)}</Table.Td>
                  <Table.Td>{values.wanted || ""}</Table.Td>
                  {/* <Table.Td>{values.major || ""}</Table.Td>
                  <Table.Td>{values.minor || ""}</Table.Td>
                  <Table.Td>{values.patch || ""}</Table.Td> */}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>
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
