import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Menu,
  NavLink,
  ScrollArea,
  Text,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
  useComputedColorScheme,
} from "@mantine/core";
import { useMemo, useState, useDeferredValue } from "react";
import ViewPackageItem from "../components/ViewPackageItem";
import { useApp } from "../context/AppContext";
import PackageIcon from "../components/PackageIcon";
import { TbArrowBarLeft, TbArrowBarRight } from "react-icons/tb";

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
  const colorScheme = useComputedColorScheme();
  const { colors } = useMantineTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    <Flex style={{ height: "calc(100vh - 25px - 32px)" }} bg={colorScheme === "dark" ? colors.dark[8] : colors.gray[0]}>
      <ScrollArea
        bg={colorScheme === "dark" ? colors.dark[7] : colors.gray[2]}
        w={sidebarCollapsed ? 60 : "30%"}
        maw="30%"
      >
        <Box>
          <Flex justify={sidebarCollapsed ? "center" : "space-between"} align="center" direction="row" m="sm">
            {!sidebarCollapsed && <Title order={2}>All Packages</Title>}
            <ActionIcon variant="subtle" onClick={() => setSidebarCollapsed((prev) => !prev)}>
              {sidebarCollapsed ? <TbArrowBarRight /> : <TbArrowBarLeft />}
            </ActionIcon>
          </Flex>
          {sidebarCollapsed ? (
            <></>
          ) : (
            <>
              <Flex align="center" gap="sm" m="sm">
                <Text size="sm">
                  <Text span size="lg" fw={500}>
                    {Object.keys(store.allPackages).length}{" "}
                  </Text>
                  node packages across
                  <Text span size="lg" fw={500}>
                    {` ${Object.keys(store.projects).length} `}
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
          {Object.entries(packages).map((pack) => (
            <Tooltip label={pack[0]} openDelay={500} position="right" key={pack[0]}>
              <NavLink
                w={sidebarCollapsed ? 60 : "100%"}
                label={sidebarCollapsed ? "" : pack[0]}
                description={sidebarCollapsed ? "" : `Used in ${pack[1].usedIn.length} projects`}
                active={activePackage !== null && activePackage === pack[0]}
                onClick={() => setActivePackage(pack[0])}
                leftSection={<PackageIcon pack={pack[0]} />}
              />
            </Tooltip>
          ))}
        </Box>
      </ScrollArea>
      {activePackage.length > 0 && <ViewPackageItem details={store.allPackages[activePackage]} name={activePackage} />}
    </Flex>
  );
};

export default AllPackages;
