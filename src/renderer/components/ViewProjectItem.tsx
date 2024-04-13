import { useCallback, useState, useEffect } from "react";
import { Code, Flex, Tabs, Text, Box, Table, Breadcrumbs, Title, Divider, Image, Group, Button } from "@mantine/core";
import { TbPencil, TbBell, TbBellRingingFilled, TbBucket } from "react-icons/tb";
import { Project } from "../../types";
import { Remark } from "react-remark";
import { sanitizeVersion } from "../../utils/functions";
import image from "../assets/bg-9.png";
import EditProjectModal from "./EditProjectModal";

type Props = {
  path: string;
  project: Project;
};

const ViewProjectItem = ({ path, project }: Props) => {
  const [markdown, setMarkdown] = useState<null | string>(null);
  const [icon, setIcon] = useState("");
  const [packageJSON, setPackageJSON] = useState<null | string>(null);
  // const [selected, setSelected] = useState([]);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
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

  const handleProjectUpdate = useCallback(
    (update: Partial<Project>) => {
      window.projectAPI.updateProject(path, update);
    },
    [path]
  );
  const handleToggleNotify = useCallback(() => {
    window.projectAPI.updateProject(path, { notify: !project.notify });
  }, [project]);

  return (
    <Box>
      {showEdit && (
        <EditProjectModal project={project} onDismiss={() => setShowEdit(false)} onEditDetails={handleProjectUpdate} />
      )}
      <Flex direction="row" align="center">
        <Image radius="md" src={icon.length > 0 ? icon : image} w={100} h={100} />
        <Flex direction="column" p="sm" flex={1}>
          <Flex justify="space-between" flex={1}>
            <Title order={2}>{project.title}</Title>
            <Group gap={2}>
              <Button size="compact-xs" variant="subtle" leftSection={<TbPencil />} onClick={() => setShowEdit(true)}>
                Edit
              </Button>
              <Button
                size="compact-xs"
                variant="subtle"
                leftSection={project.notify ? <TbBellRingingFilled /> : <TbBell />}
                color={project.notify ? "yellow" : "gray"}
                onClick={handleToggleNotify}
              >
                Notify
              </Button>
              <Button size="compact-xs" variant="subtle" color="red" leftSection={<TbBucket />}>
                Delete
              </Button>
            </Group>
          </Flex>

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
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {Object.entries(project.dependencies).map(([pack, values]) => (
                <Table.Tr key={pack}>
                  <Table.Td>{pack}</Table.Td>
                  <Table.Td>{sanitizeVersion(values.currect)}</Table.Td>
                  <Table.Td>{values.wanted || ""}</Table.Td>
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
