import { Button, Container, Flex, Menu, Pagination, TextInput, Title } from "@mantine/core";
import React, { useDeferredValue, useMemo, useState } from "react";
import ProjectItem from "../components/ProjectItem";
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
  // const [selected, useSelected] = useState([]);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [sortBy, setSortBy] = useState<keyof typeof sortOptions>("name_ascending");
  const [page, setPage] = useState(0);

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
    setPage(0);
    return obj;
  }, [store, sortBy, deferredSearch]);

  return (
    <Container>
      <Flex align="center" gap="sm">
        <Title order={3}>{Object.keys(store.projects).length} </Title> Projects
      </Flex>
      <Flex justify="space-between" align="center">
        <TextInput
          value={search}
          onChange={(t) => setSearch(t.target.value)}
          placeholder="e.g. react"
          label="Search Package"
        />
        <Flex direction="column" align="flex-end">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle" compact={true}>
                {`Sort: ${sortOptions[sortBy].label}`}
              </Button>
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
          <Pagination
            size="xs"
            my="sm"
            page={page + 1}
            onChange={(p) => setPage(p - 1)}
            total={store ? Math.ceil(Object.keys(projects).length / 20) : 1}
          />
        </Flex>
      </Flex>
      {Object.keys(projects)
        .slice(page * 20, page * 20 + 20)
        .map((pack) => (
          <ProjectItem key={pack} name={pack} details={store.projects[pack]} />
        ))}
    </Container>
  );
};

export default AllProjects;
