import { useState } from 'react';
import { Accordion, Text, Stack, Checkbox, Button, Group, Modal, Badge, ActionIcon } from '@mantine/core';
import { IconVideo, IconPlayerPlay, IconClock } from '@tabler/icons-react';
import { WorkoutSection as WorkoutSectionType } from '../types';

interface WorkoutSectionProps {
  section: WorkoutSectionType;
  onStartTimer: (duration: number, label: string) => void;
  onExerciseComplete: (exerciseIndex: number, isCompleted: boolean) => void;
}

export function WorkoutSection({ section, onStartTimer, onExerciseComplete }: WorkoutSectionProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const isMobile = window.innerWidth <= 768;

  const handleStartTimer = (timeStr: string, exerciseName: string) => {
    const seconds = parseTimeString(timeStr);
    if (seconds) {
      onStartTimer(seconds, exerciseName);
    }
  };

  const parseTimeString = (timeStr: string): number | null => {
    const match = timeStr.match(/(\d+)\s*sekund/);
    return match ? parseInt(match[1]) : null;
  };

  const handleRestTimer = (exercise: any) => {
    if (exercise.restTime) {
      onStartTimer(exercise.restTime, `Przerwa - ${exercise.name}`);
    }
  };

  const renderSets = (exercise: any) => {
    if (!exercise.sets) return null;

    if (Array.isArray(exercise.sets)) {
      return (
        <Stack gap={4} className="sets-container">
          {exercise.sets.map((set: any, idx: number) => (
            <Group key={idx} justify="space-between" gap={8} className="set-item">
              <Text size="sm" className="set-description">
                {set.description || `Seria ${idx + 1}: ${set.reps || ''}`}
              </Text>
              {set.rest && (
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<IconPlayerPlay size={14} />}
                  onClick={() => onStartTimer(parseInt(set.rest), `Przerwa po serii ${idx + 1}`)}
                  className="rest-button"
                >
                  {set.rest}s
                </Button>
              )}
            </Group>
          ))}
        </Stack>
      );
    }

    return (
      <Group gap={8} className="exercise-details">
        <Badge size="lg">
          {exercise.sets} serie x {exercise.reps}
        </Badge>
        {exercise.restTime > 0 && (
          <Button
            size="xs"
            variant="light"
            leftSection={<IconPlayerPlay size={14} />}
            onClick={() => handleRestTimer(exercise)}
            className="rest-button"
          >
            {exercise.restTime}s
          </Button>
        )}
      </Group>
    );
  };

  return (
    <Accordion.Item value={section.title} className="workout-section">
      <Accordion.Control>
        <Stack gap={0}>
          <Group justify="space-between">
            <Text fw={600}>{section.title}</Text>
            <Badge 
              color={section.exercises.every(e => e.isCompleted) ? "green" : "blue"}
              variant="light"
            >
              {section.exercises.filter(e => e.isCompleted).length}/{section.exercises.length}
            </Badge>
          </Group>
          {section.description && (
            <Text size="sm" color="dimmed">
              {section.description}
            </Text>
          )}
        </Stack>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack gap={16}>
          {section.exercises.map((exercise, index) => (
            <Stack key={index} gap={8} className="exercise-item">
              <Group justify="space-between" wrap="nowrap">
                <Group gap={8} className="exercise-main">
                  <Checkbox
                    checked={exercise.isCompleted}
                    onChange={(event) => onExerciseComplete(index, event.currentTarget.checked)}
                    className="exercise-checkbox"
                  />
                  <Stack gap={4} className="exercise-info">
                    <Text 
                      className={exercise.isCompleted ? "completed-exercise" : ""}
                    >
                      {exercise.name}
                    </Text>
                    {(exercise.duration || exercise.reps) && renderSets(exercise)}
                  </Stack>
                </Group>
                <Group gap={8} className="exercise-actions">
                  {exercise.videoUrl && (
                    <ActionIcon
                      color="blue"
                      variant="light"
                      onClick={() => setVideoUrl(exercise.videoUrl!)}
                    >
                      <IconVideo size={18} />
                    </ActionIcon>
                  )}
                  {exercise.duration && !exercise.reps && !exercise.sets && (
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconPlayerPlay size={14} />}
                      onClick={() => handleStartTimer(exercise.duration!, exercise.name)}
                    >
                      Start
                    </Button>
                  )}
                </Group>
              </Group>
              
              {exercise.description && (
                <Text size="sm" color="dimmed" className="exercise-description">
                  {exercise.description}
                </Text>
              )}
              
              {exercise.notes && (
                <Text size="sm" color="dimmed" className="exercise-notes">
                  {exercise.notes}
                </Text>
              )}
            </Stack>
          ))}
        </Stack>
      </Accordion.Panel>

      <Modal
        opened={!!videoUrl}
        onClose={() => setVideoUrl(null)}
        title="Instrukcja Video"
        size={isMobile ? "100%" : "lg"}
        fullScreen={isMobile}
        transitionProps={{ transition: 'slide-up' }}
        className="video-modal"
        styles={{
          body: {
            padding: isMobile ? 0 : '16px',
          },
          header: {
            margin: isMobile ? '8px 16px' : 0,
          }
        }}
      >
        <div className="video-wrapper">
          {videoUrl && (
            <iframe
              className="exercise-video"
              src={videoUrl.replace('youtu.be/', 'youtube.com/embed/')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </Modal>
    </Accordion.Item>
  );
} 