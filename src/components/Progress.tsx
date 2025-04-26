import { Group, Stack, Text, Progress as MantineProgress, Badge, Paper } from '@mantine/core';
import { IconCheck, IconClock } from '@tabler/icons-react';

interface WorkoutProgressProps {
  completed: number;
  total: number;
  timeSpent?: number;
  estimatedTime?: number;
}

export function WorkoutProgress({ completed, total, timeSpent, estimatedTime }: WorkoutProgressProps) {
  const percentage = (completed / total) * 100;
  const timeProgress = timeSpent && estimatedTime ? (timeSpent / estimatedTime) * 100 : 0;

  return (
    <Paper shadow="sm" p="md" withBorder className="progress-container">
      <Stack gap="xs">
        <Group justify="space-between">
          <Text size="sm" fw={500}>Postęp treningu</Text>
          <Badge 
            color={percentage === 100 ? "green" : "blue"}
            variant="light"
            leftSection={<IconCheck size={12} />}
          >
            {completed}/{total}
          </Badge>
        </Group>
        
        <MantineProgress
          value={percentage}
          size="lg"
          color={percentage === 100 ? "green" : "blue"}
          className="progress-bar"
        />

        {timeSpent !== undefined && estimatedTime !== undefined && (
          <>
            <Group justify="space-between">
              <Text size="sm" fw={500}>Czas</Text>
              <Badge 
                color="gray"
                variant="light"
                leftSection={<IconClock size={12} />}
              >
                {formatTime(timeSpent)} / {formatTime(estimatedTime)}
              </Badge>
            </Group>
            
            <MantineProgress
              value={timeProgress}
              size="sm"
              color="gray"
              className="time-progress"
            />
          </>
        )}
      </Stack>
    </Paper>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
} 