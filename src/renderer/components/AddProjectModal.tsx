import { Breadcrumbs, Button, Checkbox, Flex, Modal } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

type Props = {
  projects: string[];
  opened: boolean;
};

const AddProjectModal = ({ opened, projects }: Props) => {
  const [selected, setSelected] = useState([]);
  const { addProjects } = useApp();

  useEffect(() => {
    setSelected(Array(projects.length).fill(true));
  }, [projects]);

  const toggleCheckbox = useCallback((index: number) => {
    setSelected((prev) => prev.map((c, i) => (i === index ? !c : c)));
  }, []);

  const handleAddFolders = useCallback(async (_projects: string[], select: boolean[]) => {
    addProjects(_projects.filter((f, i) => select[i]));
  }, []);

  return (
    <Modal
      opened={opened}
      onClose={() => handleAddFolders([], [])}
      title="Choose Projects To Add"
      size="calc(100vw - 87px)"
    >
      {projects.map((project, index) => (
        <Flex key={index} justify="flex-start" align="center" gap="sm">
          <Checkbox checked={selected[index]} onChange={() => toggleCheckbox(index)} />
          <Breadcrumbs separator="→">{project.split("\\")}</Breadcrumbs>
        </Flex>
      ))}
      <Button onClick={() => handleAddFolders(projects, selected)}>Add Selected Projects</Button>
    </Modal>
  );
};

export default AddProjectModal;
