import { Modal, Stack, Text, Button, ThemeIcon } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeLeft: number | null;
  duration: number | null;
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export function TimerModal({
  isOpen,
  onClose,
  timeLeft,
  duration,
  isActive,
  onToggle,
  onReset,
}: TimerModalProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Rest Timer"
      centered
      withCloseButton={false}
    >
      <Stack align="center" gap="md">
        <ThemeIcon size="xl" radius="md" color="blue">
          <IconClock size={24} />
        </ThemeIcon>
        <Text size="xl" fw={700}>
          {timeLeft !== null ? formatTime(timeLeft) : '0:00'}
        </Text>
        <Text size="sm" c="dimmed">
          Time remaining
        </Text>
        <Stack gap="xs">
          <Button
            variant="light"
            color={isActive ? "red" : "blue"}
            onClick={onToggle}
            leftSection={<IconClock size={16} />}
          >
            {isActive ? "Pause Timer" : "Start Timer"}
          </Button>
          <Button
            variant="subtle"
            color="gray"
            onClick={onReset}
          >
            Reset Timer
          </Button>
          <Button
            variant="subtle"
            color="red"
            onClick={onClose}
          >
            Close
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
} 