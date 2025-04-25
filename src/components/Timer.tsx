import { useState, useEffect, useRef } from 'react';
import { Paper, Text, Progress, Box, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface TimerProps {
  duration: number;
  label: string;
  onComplete: () => void;
}

export function Timer({ duration, label, onComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progress = ((duration - timeLeft) / duration) * 100;
  const timerRef = useRef<number>();

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, onComplete]);

  // Reset timer if duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onComplete();
  };

  return (
    <Paper shadow="sm" p="md" withBorder style={{ background: 'white' }}>
      <Box style={{ position: 'relative' }}>
        <ActionIcon
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            zIndex: 2
          }}
          color="gray"
          variant="light"
          onClick={handleCancel}
        >
          <IconX size={16} />
        </ActionIcon>
        <Box style={{ textAlign: 'center' }}>
          <Text size="lg" mb={4}>
            {label}
          </Text>
          <Text size="xl" weight={700} mb={8} style={{ fontSize: '2rem' }}>
            {formatTime(timeLeft)}
          </Text>
          <Progress
            value={progress}
            size="xl"
            radius="xl"
            color={timeLeft <= 5 ? "red" : "blue"}
            animate
          />
        </Box>
      </Box>
    </Paper>
  );
} 