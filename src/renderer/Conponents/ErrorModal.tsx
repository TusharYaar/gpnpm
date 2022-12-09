import { Modal } from "@mantine/core";
import React from "react";

const ErrorModal = ({ error, dismissError }: { error: string; dismissError: () => void }) => {
  return (
    <Modal opened={true} onClose={dismissError}>
      {error}
    </Modal>
  );
};

export default ErrorModal;
