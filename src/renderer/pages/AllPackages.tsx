import { Box, Button, Flex, Menu, ScrollArea, TextInput, Title } from "@mantine/core";
import { useMemo, useState, useDeferredValue } from "react";
import PackageItem from "../components/PackageItem";
import ViewPackageItem from "../components/ViewPackageItem";
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
  const [activePackage, setActivePackage] = useState("");

  const packages = useMemo(() => {
    if (!store) return {};
    const allKeys = Object.keys(store.allPackages).filter((p) =>
      deferredSearch ? p.toLowerCase().includes(deferredSearch.toLowerCase()) : true
    );
    if (sortBy === "name_ascending") allKeys.sort((a, b) => a.localeCompare(b));
    if (sortBy === "name_decending") allKeys.sort((a, b) => b.localeCompare(a));
    if (sortBy === "least_used")
      allKeys.sort(
        (a, b) => Object.keys(store.allPackages[a].usedIn).length - Object.keys(store.allPackages[b].usedIn).length
      );
    if (sortBy === "most_used")
      allKeys.sort(
        (a, b) => Object.keys(store.allPackages[b].usedIn).length - Object.keys(store.allPackages[a].usedIn).length
      );
    const obj: typeof store.allPackages = {};
    allKeys.forEach((key) => {
      obj[key] = store.allPackages[key];
    });
    return obj;
  }, [store, sortBy, deferredSearch]);

  return (
    <Flex style={{ height: "calc(100vh - 20px)" }}>
      <ScrollArea>
        <Box p="sm">
          <Title>All Packages</Title>
          <Flex align="center" gap="sm">
            <Title order={3}>{Object.keys(store.allPackages).length} </Title>
            node packages across
            <Title order={3}>{Object.keys(store.projects).length}</Title>
            projects
          </Flex>
          <Box>
            <TextInput
              width="100%"
              value={search}
              onChange={(t) => setSearch(t.target.value)}
              placeholder="e.g. react"
            />
          </Box>
          <Flex direction="column" align="flex-end">
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button variant="subtle">{`Sort: ${sortOptions[sortBy].label}`}</Button>
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
          {Object.keys(packages).map((pack) => (
            <PackageItem
              key={pack}
              name={pack}
              onClick={() => setActivePackage(pack)}
              active={pack === activePackage}
            />
          ))}
        </Box>
      </ScrollArea>
      <ScrollArea w={"calc(100vh - 20px)"}>
        {/* <Flex p="sm" flex={1}> */}
        {activePackage.length > 0 && (
          <ViewPackageItem details={store.allPackages[activePackage]} name={activePackage} />
        )}
        {/* </Flex> */}
      </ScrollArea>
    </Flex>
  );
};

export default AllPackages;
