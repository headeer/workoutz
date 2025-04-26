import { useState, useEffect, useRef } from 'react';
import { Text, Button, Group, Stack, ActionIcon, Progress } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause, IconPlayerStop, IconRefresh } from '@tabler/icons-react';

interface TimerProps {
  duration: number;
  label: string;
  onComplete?: () => void;
  onStop?: () => void;
}

export function Timer({ duration, label, onComplete, onStop }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsComplete(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    setIsComplete(false);
    onStop?.();
  };

  const handleReset = () => {
    setTimeLeft(duration);
    setIsComplete(false);
  };

  const progress = (timeLeft / duration) * 100;

  return (
    <Stack gap="xs" className="timer-container">
      <Text size="sm" fw={500} ta="center">
        {label}
      </Text>
      <Text size="xl" fw={700} ta="center" className={isComplete ? 'timer-complete' : ''}>
        {formatTime(timeLeft)}
      </Text>
      <Progress
        value={progress}
        size="sm"
        color={isComplete ? 'green' : 'blue'}
        className="timer-progress"
      />
      <Group justify="center" gap="xs">
        {!isRunning && !isComplete && (
          <ActionIcon
            variant="light"
            color="blue"
            size="lg"
            onClick={handleStart}
            className="timer-button"
          >
            <IconPlayerPlay size={20} />
          </ActionIcon>
        )}
        {isRunning && (
          <ActionIcon
            variant="light"
            color="blue"
            size="lg"
            onClick={handlePause}
            className="timer-button"
          >
            <IconPlayerPause size={20} />
          </ActionIcon>
        )}
        <ActionIcon
          variant="light"
          color="red"
          size="lg"
          onClick={handleStop}
          className="timer-button"
        >
          <IconPlayerStop size={20} />
        </ActionIcon>
        <ActionIcon
          variant="light"
          color="gray"
          size="lg"
          onClick={handleReset}
          className="timer-button"
        >
          <IconRefresh size={20} />
        </ActionIcon>
      </Group>
    </Stack>
  );
} 