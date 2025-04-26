import { useState } from 'react';
import { Group, Stack, Text, Checkbox, Button, ActionIcon, Badge, Modal, LoadingOverlay } from '@mantine/core';
import { IconVideo, IconPlayerPlay, IconClock, IconX } from '@tabler/icons-react';
import { Timer } from './Timer';
import { ExerciseSet } from '../types';

interface ExerciseProps {
  exercise: ExerciseSet;
  index: number;
  onComplete: (index: number, isCompleted: boolean) => void;
  onStartTimer: (duration: number, label: string) => void;
}

export function Exercise({ exercise, index, onComplete, onStartTimer }: ExerciseProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  const handleVideoClick = (url: string) => {
    setVideoLoading(true);
    setVideoUrl(url);
    setVideoLoading(false);
  };

  const handleStartTimer = (timeStr: string, exerciseName: string) => {
    const seconds = parseTimeString(timeStr);
    if (seconds) {
      setShowTimer(true);
      onStartTimer(seconds, exerciseName);
    }
  };

  const parseTimeString = (timeStr: string): number | null => {
    const match = timeStr.match(/(\d+)\s*sekund/);
    return match ? parseInt(match[1]) : null;
  };

  const handleRestTimer = (exercise: ExerciseSet) => {
    const restTime = exercise.restTime;
    if (restTime && restTime > 0) {
      setShowTimer(true);
      onStartTimer(restTime, `Przerwa - ${exercise.name}`);
    }
  };

  const renderSets = (exercise: ExerciseSet) => {
    if (!exercise.sets) return null;

    if (Array.isArray(exercise.sets)) {
      return (
        <Stack gap={4} className="sets-container">
          {exercise.sets.map((set, idx) => (
            <Group key={idx} justify="space-between" gap={8} className="set-item">
              <Text size="sm" className="set-description">
                {set.description || `Seria ${idx + 1}: ${set.reps || ''}`}
              </Text>
              {set.rest && (
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<IconPlayerPlay size={14} />}
                  onClick={() => onStartTimer(set.rest!, `Przerwa po serii ${idx + 1}`)}
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
        {(exercise.restTime ?? 0) > 0 && (
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
    <Stack key={index} gap={8} className="exercise-item">
      <Group justify="space-between" wrap="nowrap">
        <Group gap={8} className="exercise-main">
          <Checkbox
            checked={exercise.isCompleted}
            onChange={(event) => onComplete(index, event.currentTarget.checked)}
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
              onClick={() => handleVideoClick(exercise.videoUrl!)}
              className="video-button"
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
              className="timer-button"
            >
              Start Timer
            </Button>
          )}
        </Group>
      </Group>
      
      {exercise.videoUrl && (
        <div className="video-thumbnail" onClick={() => handleVideoClick(exercise.videoUrl!)}>
          <img
            src={`https://img.youtube.com/vi/${exercise.videoUrl.split('v=')[1]}/maxresdefault.jpg`}
            alt={`${exercise.name} video thumbnail`}
          />
          <div className="video-overlay">
            <IconPlayerPlay size={24} />
          </div>
        </div>
      )}
      
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

      <Modal
        opened={!!videoUrl}
        onClose={() => setVideoUrl(null)}
        title={
          <Group justify="space-between" w="100%">
            <Text>Instrukcja Video</Text>
            <ActionIcon variant="subtle" onClick={() => setVideoUrl(null)}>
              <IconX size={18} />
            </ActionIcon>
          </Group>
        }
        size="lg"
        transitionProps={{ transition: 'slide-up' }}
        className="video-modal"
      >
        <LoadingOverlay visible={videoLoading} />
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

      {showTimer && exercise.duration && (
        <Timer
          duration={parseTimeString(exercise.duration)!}
          label={exercise.name}
          onComplete={() => setShowTimer(false)}
          onStop={() => setShowTimer(false)}
        />
      )}
    </Stack>
  );
} 