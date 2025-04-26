import { Button, Group, Modal, Stack, Text } from '@mantine/core';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'red',
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  return (
    <Modal opened={isOpen} onClose={onCancel} title={title} centered>
      <Stack>
        <Text>{message}</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button color={confirmColor} onClick={onConfirm}>
            {confirmText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
} 