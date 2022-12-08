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

  // const folderStructure = useMemo(() => {
  //   const asArray = projects.map((project) => project.split("\\").filter((t) => t !== "package.json"));
  //   const structure: Obj = {};
  //   asArray.forEach((path) => {
  //     path.forEach((dir) => {
  //       // if (structure[dir])
  //     });
  //   });

  //   console.log(structure);
  //   return structure;
  // }, [projects]);
  return (
    <Modal
      opened={true}
      withCloseButton={false}
      onClose={() => {
        console.log("");
      }}
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
