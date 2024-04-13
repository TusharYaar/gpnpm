import { ActionIcon, BackgroundImage, Button, Flex, Modal, TextInput, Textarea } from "@mantine/core";
import { Project } from "../../types";
import { useCallback, useEffect, useState } from "react";
import { TbCamera } from "react-icons/tb";

import "./styles.css";

type props = {
  project: Project;
  onDismiss: () => void;
  onEditDetails: (project: Partial<Project>) => void;
};

const EditProjectModal = ({ project, onDismiss, onEditDetails }: props) => {
  const { iconLocation } = project;
  const [image, setImage] = useState<string | null>(null);
  const [details, setDetails] = useState({
    title: project.title,
    iconLocation: project.iconLocation,
    description: project.description || "",
  });

  const getIcon = useCallback(
    (icon: string) =>
      window.projectAPI.getFile(icon, "image").then((data) => {
        setImage(data);
      }),
    [setImage]
  );

  useEffect(() => {
    if (iconLocation) {
      getIcon(iconLocation);
      setDetails((prev) => ({ ...prev, iconLocation }));
    }
  }, [iconLocation, getIcon]);

  const handleSubmit = () => {
    onEditDetails(details);
    onDismiss();
  };

  const handleChangeIcon = useCallback(async () => {
    try {
      const result = await window.projectAPI.openDialog("file");
      if (result.length > 0) {
        setDetails((prev) => ({ ...prev, iconLocation: result[0] }));
        getIcon(result[0]);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <Modal opened={true} onClose={onDismiss} title="Edit Project" size="500px">
      <Flex direction="row" align="center" gap="md">
        <div style={{ position: "relative" }}>
          <BackgroundImage src={image} h={50} w={50} />
          <ActionIcon
            style={{ position: "absolute", left: 0, top: 0 }}
            component="div"
            variant="filled"
            color={details.iconLocation ? "rgba(255, 255, 255, 0.5)" : "gray"}
            h={50}
            w={50}
            className={details.iconLocation ? "visibleOnHover" : ""}
            onClick={handleChangeIcon}
          >
            <TbCamera />
          </ActionIcon>
        </div>
        <TextInput
          label="Title"
          value={details.title}
          // onChange={(event) => console.log(event.currentTarget.value)}
          onChange={({ currentTarget }) => setDetails((prev) => ({ ...prev, title: currentTarget.value }))}
          //  setDetails((prev) => ({ ...prev, title: event.currentTarget.value }))}
          w="100%"
        />
      </Flex>
      <Textarea
        label="Description"
        value={details.description}
        onChange={({ currentTarget }) => setDetails((prev) => ({ ...prev, description: currentTarget.value }))}
      />
      <Button onClick={handleSubmit} mt="md">
        Submit
      </Button>
    </Modal>
  );
};

export default EditProjectModal;
