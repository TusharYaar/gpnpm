import { Accordion, Code, Paper, Tabs } from "@mantine/core";
import React from "react";
import { Package } from "../../types";

type Props = {
  name: string;
  details: Package;
};

const PackageItem = ({ name, details }: Props) => {
  return (
    <Paper my="md">
      <Accordion>
        <Accordion.Item value="brief">
          <Accordion.Control>
            {name} - Used in {details.usedIn.length} projects
          </Accordion.Control>
          <Accordion.Panel>
            <Tabs defaultValue="projects">
              <Tabs.List>
                <Tabs.Tab value="projects"> Projects </Tabs.Tab>
                <Tabs.Tab value="versions"> Versions </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="projects">
                {details.usedIn.map((project) => (
                  <div key={project.file}>
                    {project.file} -- {project.version}
                  </div>
                ))}
              </Tabs.Panel>
              <Tabs.Panel value="versions">
                <Code>{JSON.stringify(details, null, 4)}</Code>
              </Tabs.Panel>
            </Tabs>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Paper>
  );
};

export default PackageItem;
