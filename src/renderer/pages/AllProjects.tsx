import { Button, Box, Flex, Menu, ScrollArea, TextInput, Title } from "@mantine/core";
import { useDeferredValue, useMemo, useState } from "react";
// import ProjectItem from "../components/ProjectItem";
import ViewProjectItem from "../components/ViewProjectItem";
import { useApp } from "../context/AppContext";
import { Project } from "../../types";
import ListItem from "../components/ListItem";
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

  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const projects = useMemo(() => {
    if (!store.projects) return [];

    const filtered = store.projects.filter((p) =>
      deferredSearch ? p.title.toLowerCase().includes(deferredSearch.toLowerCase()) : true
    );
    if (sortBy === "name_ascending") filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "name_decending") filtered.sort((a, b) => b.title.localeCompare(a.title));
    return filtered;
  }, [store, sortBy, deferredSearch]);
  console.log(projects);

  return (
    <Flex style={{ height: "calc(100vh - 50px)" }} direction="row">
      <ScrollArea style={{ width: "50%" }} p="sm">
        <Flex justify="space-between" align="center">
          <Title>All Projects</Title>
          <Button>Add New </Button>
        </Flex>
        <Flex align="center" gap="sm">
          <Title order={3}>{Object.keys(store.projects).length} </Title> Projects
        </Flex>
        <Box>
          <TextInput value={search} onChange={(t) => setSearch(t.target.value)} placeholder="e.g. react" />
        </Box>
        <Flex direction="column" align="flex-end">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle">{`Sort: ${sortOptions[sortBy].label}`}</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Sort By</Menu.Label>
              {Object.keys(sortOptions).map((option: keyof typeof sortOptions) => (
                <Menu.Item onClick={() => setSortBy(option)} key={option}>
                  {sortOptions[option].label}
                </Menu.Item>
              ))}
              <Menu.Divider />
            </Menu.Dropdown>
          </Menu>
        </Flex>
        {projects.map((project) => (
          <ListItem
            key={project.title}
            title={project.title}
            selected={activeProject !== null && activeProject.title === project.title}
            // path={project.projectLocation}
            onClick={() => setActiveProject(project)}
          />
        ))}
      </ScrollArea>
      <ScrollArea style={{ width: "100%" }}>
        {activeProject !== null && <ViewProjectItem project={activeProject} path={activeProject.projectLocation} />}
      </ScrollArea>
    </Flex>
  );
};

export default AllProjects;
