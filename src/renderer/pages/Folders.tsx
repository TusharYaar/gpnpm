import { Container } from "@mantine/core";
import React from "react";
import ProjectItem from "../components/ProjectItem";
import { useApp } from "../context/AppContext";

const Folders = () => {
  const { store } = useApp();
  // const [selected, useSelected] = useState([]);

  return (
    <Container>
      {/* Selected {selected.length} */}
      {/* {store.scannedFolders.map((project) => (
        <ProjectItem name={project} key={project} />
      ))} */}
    </Container>
  );
};

export default Folders;
