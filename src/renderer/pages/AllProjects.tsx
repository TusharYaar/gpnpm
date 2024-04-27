import {
  Button,
  Flex,
  Menu,
  ScrollArea,
  TextInput,
  Title,
  NavLink,
  ActionIcon,
  Text,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDeferredValue, useMemo, useState } from "react";
import ViewProjectItem from "../components/ViewProjectItem";
import { useApp } from "../context/AppContext";
import { TbArrowBarLeft, TbArrowBarRight } from "react-icons/tb";
// import { TbArrowBarLeft, TbArrowBarRight } from "react-icons/tb";
const sortOptions = {
  name_ascending: {
    label: "Name: Ascending",
  },
  name_decending: {
    label: "Name: Decending",
  },
};

const AllProjects = () => {
  const { store } = useApp();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [sortBy, setSortBy] = useState<keyof typeof sortOptions>("name_ascending");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const colorScheme = useComputedColorScheme();
  const { colors } = useMantineTheme();

  const projects = useMemo(() => {
    if (!store.projects) return [];

    const filtered = store.projects.filter((p) =>
      deferredSearch ? p.title.toLowerCase().includes(deferredSearch.toLowerCase()) : true
    );
    if (sortBy === "name_ascending") filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "name_decending") filtered.sort((a, b) => b.title.localeCompare(a.title));
    return filtered;
  }, [store, sortBy, deferredSearch]);
  return (
    <Flex style={{ height: "calc(100vh - 25px)" }} bg={colorScheme === "dark" ? colors.dark[8] : colors.gray[0]}>
      <ScrollArea
        bg={colorScheme === "dark" ? colors.dark[7] : colors.gray[2]}
        w={sidebarCollapsed ? 60 : "30%"}
        maw="30%"
      >
        <Flex justify="space-between" align="center" direction="row" m="sm">
          {!sidebarCollapsed && <Title order={2}>All Projects</Title>}
          {false && (
            <ActionIcon variant="subtle" onClick={() => setSidebarCollapsed((prev) => !prev)}>
              {sidebarCollapsed ? <TbArrowBarRight /> : <TbArrowBarLeft />}
            </ActionIcon>
          )}
        </Flex>
        {sidebarCollapsed ? (
          <></>
        ) : (
          <>
            <Flex align="center" gap="sm" m="sm">
              <Text size="sm">
                <Text span size="lg" fw={500}>
                  {`${Object.keys(store.projects).length} `}
                </Text>
                projects
              </Text>
            </Flex>
            <TextInput
              width="100%"
              value={search}
              onChange={(t) => setSearch(t.target.value)}
              placeholder="e.g. react"
              mx="md"
            />
            <Flex direction="column" align="flex-end" mx="sm" my="xs">
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button variant="subtle" size="compact-xs">{`Sort: ${sortOptions[sortBy].label}`}</Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Application</Menu.Label>
                  {Object.keys(sortOptions).map((option: keyof typeof sortOptions) => (
                    <Menu.Item onClick={() => setSortBy(option)} key={option}>
                      {sortOptions[option].label}
                    </Menu.Item>
                  ))}
                  <Menu.Divider />
                </Menu.Dropdown>
              </Menu>
            </Flex>
          </>
        )}
        {projects.map((project, index) => (
          <NavLink
            key={`${project.title}_${index}`}
            label={project.title}
            description={`${Object.keys(project.dependencies).length} packages`}
            active={activeProject !== null && activeProject === project.projectLocation}
            onClick={() => setActiveProject(project.projectLocation)}
          />
        ))}
      </ScrollArea>
      {activeProject !== null && (
        <ViewProjectItem project={projects.find((p) => p.projectLocation === activeProject)} path={activeProject} />
      )}
    </Flex>
  );
};

export default AllProjects;
