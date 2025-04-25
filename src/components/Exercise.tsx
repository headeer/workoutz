import React from 'react';
import { Group, Text, Button, Badge } from '@mantine/core';
import { Check } from 'tabler-icons-react';

interface ExerciseProps {
  exercise: {
    name: string;
    sets?: number;
    reps?: string;
    duration?: string;
    isCompleted?: boolean;
    videoUrl?: string;
    notes?: string;
  };
  onComplete: () => void;
}

export function Exercise({ exercise, onComplete }: ExerciseProps) {
  return (
    <Group justify="space-between" align="center">
      <div>
        <Text fw={500}>{exercise.name}</Text>
        {exercise.sets && (
          <Text size="sm" color="dimmed">
            {exercise.sets} sets × {exercise.reps}
          </Text>
        )}
        {exercise.duration && (
          <Text size="sm" color="dimmed">
            Duration: {exercise.duration}
          </Text>
        )}
        {exercise.notes && (
          <Text size="sm" color="dimmed">
            {exercise.notes}
          </Text>
        )}
      </div>
      
      {exercise.isCompleted ? (
        <Badge color="green" leftSection={<Check size={12} />}>
          Completed
        </Badge>
      ) : (
        <Button
          variant="light"
          color="blue"
          size="sm"
          onClick={onComplete}
        >
          Complete
        </Button>
      )}
    </Group>
  );
} 