import { ActionIcon, Box, Divider, Flex, Image, NavLink, Popover, ScrollArea, Text, TextInput } from "@mantine/core";
import { useMemo, useState } from "react";
import { TbX, TbCopy, TbSquare, TbMinus } from "react-icons/tb";

import "./styles.css";

import image from "../assets/gpnpm_logo@0.5x.png";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

const Titlebar = () => {
  const [search, setSearch] = useState("");

  const {
    store: { allPackages, projects },
  } = useApp();
  const isMaximized = true;

  const keywords = useMemo(
    () =>
      search
        .split(" ")
        .filter((k) => k.length > 0)
        .map((k) => k.toLowerCase()),
    [search]
  );
  const results = useMemo(() => {
    const projectResults = projects
      .filter((project) => {
        for (const key of keywords) {
          if (project.description.toLowerCase().includes(key)) return true;
          else if (project.title.toLowerCase().includes(key)) return true;
          else if (project.projectLocation.toLowerCase().includes(key)) return true;
        }
      })
      .map((p) => ({ label: p.title, description: p.projectLocation, to: `/all_projects/${p.projectLocation}` }));

    const packageResults = Object.entries(allPackages)
      .filter((pack) => {
        for (const key of keywords) {
          if (pack[0].toLowerCase().includes(key)) return true;
        }
      })
      .map((p) => ({
        label: p[0],
        description: `Used in ${p[1].usedIn.length} projects`,
        to: `/all_packages/${p[0]}`,
      }));

    return {
      projects: projectResults,
      packages: packageResults,
    };
  }, [keywords]);

  return (
    <Flex justify="space-between" className="draggable" align="center">
      <Flex align="center" pl={4}>
        <Image src={image} width={24} height={24} />
      </Flex>
      <Popover width="60%" opened={search.length > 0}>
        <Popover.Target>
          <TextInput
            placeholder="Search"
            size="24px"
            w="60%"
            variant="filled"
            value={search}
            onChange={({ currentTarget }) => setSearch(currentTarget.value)}
            styles={{
              input: {
                fontSize: 10,
                padding: 0,
                paddingLeft: 4,
                paddingRight: 4,
                margin: 0,
              },
            }}
          />
        </Popover.Target>
        <Popover.Dropdown h={400} p={0}>
          {results.packages.length > 0 || results.projects.length > 0 ? (
            <ScrollArea h={400}>
              <Box>
                {results.projects.map((p, index) => (
                  <NavLink component={Link} {...p} key={`project_${p.label}_${index}`} onClick={() => setSearch("")} />
                ))}
              </Box>
              <Divider mx="md" />
              <Box>
                {results.packages.map((p, index) => (
                  <NavLink component={Link} {...p} key={`package_${p.label}_${index}`} onClick={() => setSearch("")} />
                ))}
              </Box>
            </ScrollArea>
          ) : (
            <Text>No Results Found</Text>
          )}
        </Popover.Dropdown>
      </Popover>
      <Box>
        <ActionIcon size={32} variant="subtle" radius={0} onClick={window.systemAPI.minimizeWindow}>
          <TbMinus />
        </ActionIcon>
        <ActionIcon size={32} variant="subtle" radius={0} onClick={window.systemAPI.maximizeWindow}>
          {isMaximized ? <TbCopy /> : <TbSquare />}
        </ActionIcon>
        <ActionIcon size={32} variant="subtle" radius={0} color="red" onClick={window.systemAPI.closeWindow}>
          <TbX />
        </ActionIcon>
      </Box>
    </Flex>
  );
};

export default Titlebar;
