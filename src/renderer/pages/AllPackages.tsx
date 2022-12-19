import { Button, Container, Flex, Menu, Pagination, TextInput, Title } from "@mantine/core";
import React, { useMemo, useState, useDeferredValue } from "react";
import PackageItem from "../components/PackageItem";
import { useApp } from "../context/AppContext";

const sortOptions = {
  name_ascending: {
    label: "Name: Ascending",
  },
  name_decending: {
    label: "Name: Decending",
  },
  most_used: {
    label: "Most Used",
  },
  least_used: {
    label: "Least Used",
  },
};

const AllPackages = () => {
  const [search, setSearch] = useState("");
  const { store } = useApp();
  const [sortBy, setSortBy] = useState<keyof typeof sortOptions>("name_ascending");
  const deferredSearch = useDeferredValue(search);
  const [page, setPage] = useState(0);

  const packages = useMemo(() => {
    if (!store) return {};
    const allKeys = Object.keys(store.allPackages).filter((p) =>
      deferredSearch ? p.toLowerCase().includes(deferredSearch.toLowerCase()) : true
    );
    if (sortBy === "name_ascending") allKeys.sort((a, b) => a.localeCompare(b));
    if (sortBy === "name_decending") allKeys.sort((a, b) => b.localeCompare(a));
    if (sortBy === "least_used")
      allKeys.sort((a, b) => store.allPackages[a].usedIn.length - store.allPackages[b].usedIn.length);
    if (sortBy === "most_used")
      allKeys.sort((a, b) => store.allPackages[b].usedIn.length - store.allPackages[a].usedIn.length);
    const obj: typeof store.allPackages = {};
    allKeys.forEach((key) => {
      obj[key] = store.allPackages[key];
    });
    setPage(0);
    return obj;
  }, [store, sortBy, deferredSearch]);

  return (
    <Container>
      <Flex align="center" gap="sm">
        <Title order={3}>{Object.keys(store.allPackages).length} </Title>
        node packages across
        <Title order={3}>{Object.keys(store.projects).length}</Title>
        projects
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
            total={store ? Math.ceil(Object.keys(packages).length / 20) : 1}
          />
        </Flex>
      </Flex>
      {Object.keys(packages)
        .slice(page * 20, page * 20 + 20)
        .map((pack) => (
          <PackageItem key={pack} name={pack} details={store.allPackages[pack]} />
        ))}
    </Container>
  );
};

export default AllPackages;
