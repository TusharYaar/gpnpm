import { Breadcrumbs, Button, Checkbox, Flex, Modal } from "@mantine/core";
import React, { useCallback, useState } from "react";
import { useApp } from "../context/AppContext";

type Props = {
  projects: string[];
};

// type Obj = {
//   [key: string]: string;
// };

const AddProjectModal = ({ projects }: Props) => {
  const [selected, setSelected] = useState(Array(projects.length).fill(true));
  const { addFolders } = useApp();

  const toggleCheckbox = useCallback((index: number) => {
    setSelected((prev) => prev.map((c, i) => (i === index ? !c : c)));
  }, []);

  const handleAddFolders = useCallback(async (_projects: string[], select: boolean[]) => {
    addFolders(_projects.filter((f, i) => select[i]));
  }, []);

  return (
    <Modal
      opened={true}
      onClose={() => handleAddFolders([], [])}
      title="Choose Projects To Add"
      size="calc(100vw - 87px)"
    >
      {projects.map((project, index) => (
        <Flex key={index} justify="flex-start" align="center" gap="sm">
          <Checkbox checked={selected[index]} onChange={() => toggleCheckbox(index)} />
          <Breadcrumbs separator="→">{project.split("\\").filter((t) => t !== "package.json")}</Breadcrumbs>
        </Flex>
      ))}
      <Button onClick={() => handleAddFolders(projects, selected)}>Add Selected Projects</Button>
    </Modal>
  );
};

export default AddProjectModal;
