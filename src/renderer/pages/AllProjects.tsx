import { Button, Box, Flex, Menu, ScrollArea, TextInput, Title } from "@mantine/core";
import React, { useDeferredValue, useMemo, useState } from "react";
import ProjectItem from "../components/ProjectItem";
import ViewProjectItem from "../components/ViewProjectItem";
import { useApp } from "../context/AppContext";

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

  const [activeProject, setActiveProject] = useState("");

  const projects = useMemo(() => {
    if (!store.projects) return {};

    const allKeys = Object.keys(store.projects).filter((p) =>
      deferredSearch ? p.toLowerCase().includes(deferredSearch.toLowerCase()) : true
    );
    if (sortBy === "name_ascending") allKeys.sort((a, b) => a.localeCompare(b));
    if (sortBy === "name_decending") allKeys.sort((a, b) => b.localeCompare(a));
    const obj: typeof store.projects = {};
    allKeys.forEach((key) => {
      obj[key] = store.projects[key];
    });
    return obj;
  }, [store, sortBy, deferredSearch]);

  return (
    <Flex style={{ height: "calc(100vh - 50px)" }} direction="row">
      <ScrollArea style={{ width: "50%" }} p="sm">
        <Flex justify="space-between" align="center">
          <Title>All Projects</Title>
          <Button>Add NEw </Button>
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
        {Object.entries(projects).map((project) => (
          <ProjectItem
            key={project[0]}
            title={project[1].title}
            path={project[0]}
            onClick={() => setActiveProject(project[0])}
          />
        ))}
      </ScrollArea>
      <ScrollArea style={{ width: "100%" }}>
        {activeProject.length > 0 && <ViewProjectItem details={store.projects[activeProject]} path={activeProject} />}
      </ScrollArea>
    </Flex>
  );
};

export default AllProjects;
