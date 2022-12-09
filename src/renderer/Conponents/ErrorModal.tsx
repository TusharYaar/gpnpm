import { Modal } from "@mantine/core";
import React from "react";

type Props = {
  error: {
    error: string;
    id: string;
  };
  dismissError: (id: string) => void;
};

const ErrorModal = ({ error, dismissError }: Props) => {
  return (
    <Modal opened={true} onClose={() => dismissError(error.id)}>
      {error.error}
    </Modal>
  );
};

export default ErrorModal;
