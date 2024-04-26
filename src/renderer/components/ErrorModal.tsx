import { Modal } from "@mantine/core";

type Props = {
  error?: {
    error: string;
    id: string;
  };
  dismissError: (id: string) => void;
  opened: boolean;
};

const ErrorModal = ({ opened, error, dismissError }: Props) => {
  if (error)
    return (
      <Modal opened={opened} onClose={() => dismissError(error.id)} centered>
        {error.error}
      </Modal>
    );
};

export default ErrorModal;
