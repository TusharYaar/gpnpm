import { useCallback, useState, useEffect, useMemo } from "react";
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
  Image,
  Group,
  Button,
  Checkbox,
} from "@mantine/core";
import { TbPencil, TbBell, TbBellRingingFilled, TbBucket } from "react-icons/tb";
import { Project } from "../../types";
import { Remark } from "react-remark";
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
  const [selected, setSelected] = useState([]);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    getProjectIcon(project.iconLocation);
  }, [project]);

  const toggleSelected = useCallback((id: string, state: boolean) => {
    setSelected((prev) => (state ? prev.concat(id) : prev.filter((p) => p !== id)));
  }, []);
  const toggleAll = useCallback(
    (state: boolean) => {
      setSelected(state ? Object.keys(project.dependencies) : []);
    },
    [project]
  );

  const tableData = useMemo(() => {
    return Object.entries(project.dependencies).map((pack) => {
      let wanted = pack[1].current;
      if (pack[1].upgradeType === "ANY") wanted = pack[1]?.major ? pack[1].major : pack[1].current;
      else if (pack[1].upgradeType === "MINOR") wanted = pack[1]?.minor ? pack[1].minor : pack[1].current;
      else if (pack[1].upgradeType === "PATCH") wanted = pack[1]?.patch ? pack[1].patch : pack[1].current;

      return {
        name: pack[0],
        current: pack[1].current,
        wanted,
      };
    });
  }, [project]);

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
                <Table.Th>
                  <Checkbox
                    onChange={(event) => toggleAll(event.currentTarget.checked)}
                    checked={selected.length === tableData.length}
                  />
                </Table.Th>
                <Table.Th>Packages</Table.Th>
                <Table.Th>Current</Table.Th>
                <Table.Th>Wanted</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tableData.map((pack) => (
                <Table.Tr key={pack.name}>
                  <Table.Td>
                    <Checkbox
                      onChange={(event) => toggleSelected(pack.name, event.currentTarget.checked)}
                      checked={selected.includes(pack.name)}
                    />
                  </Table.Td>
                  <Table.Td>{pack.name}</Table.Td>
                  <Table.Td>{pack.current}</Table.Td>
                  <Table.Td>{pack.wanted}</Table.Td>
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
