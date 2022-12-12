import { Accordion, Paper } from "@mantine/core";
import React from "react";

type Props = {
  name: string;
  details: {
    usedIn: string[];
  };
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
            {details.usedIn.map((project) => (
              <div key={project}>{project}</div>
            ))}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Paper>
  );
};

export default PackageItem;
