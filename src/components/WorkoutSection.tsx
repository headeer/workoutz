import { Text, Group, Button, Stack, Paper, Modal, LoadingOverlay, Badge, ThemeIcon, ActionIcon, Tooltip, Collapse } from '@mantine/core';
import { useState } from 'react';
import { Exercise } from '../types/workout';
import { IconPlayerPlay, IconCheck, IconClock, IconInfoCircle, IconBarbell, IconChevronDown, IconChevronUp, IconVideo } from '@tabler/icons-react';
import { useLanguage } from '../lib/LanguageContext';
import { CompletionFeedback } from './CompletionFeedback';
import { completeExercise } from '../lib/exerciseService';

interface WorkoutSectionProps {
  name: string;
  exercises: Exercise[];
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onStartTimer: (duration: number) => void;
  userId: string;
}

export function WorkoutSection({ name, exercises = [], onExerciseComplete, onStartTimer, userId }: WorkoutSectionProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedExercises, setExpandedExercises] = useState<{ [key: string]: boolean }>({});
  const [completionFeedback, setCompletionFeedback] = useState<{
    isOpen: boolean;
    points: number;
    streakBonus: number;
    achievements: Array<{ id: string; name: string; description: string; icon: string; }>;
  }>({
    isOpen: false,
    points: 0,
    streakBonus: 0,
    achievements: []
  });
  const { t } = useLanguage();

  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const handleExerciseComplete = async (exerciseId: string) => {
    try {
      setLoading(true);
      const result = await completeExercise(exerciseId, userId);
      
      if (result.success) {
        await onExerciseComplete(exerciseId);
        setCompletionFeedback({
          isOpen: true,
          points: result.points,
          streakBonus: result.points - 10, // Base points are 10
          achievements: result.achievements || []
        });
      }
    } catch (error) {
      console.error('Error completing exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!exercises || exercises.length === 0) {
    return (
      <Paper p="md" radius="md" withBorder>
        <Text c="dimmed" ta="center">{t('workouts.noExercises')}</Text>
      </Paper>
    );
  }

  return (
    <Stack gap="md" p="md">
      <LoadingOverlay visible={loading} />
      {exercises.map((exercise) => {
        const isExpanded = expandedExercises[exercise.id] ?? false;

        return (
          <Paper 
            key={exercise.id} 
            shadow="sm" 
            radius="md" 
            withBorder
            style={{
              borderColor: exercise.is_completed ? 'var(--mantine-color-green-6)' : undefined,
              backgroundColor: exercise.is_completed ? 'var(--mantine-color-green-0)' : undefined,
            }}
          >
            <Group 
              justify="space-between" 
              p="md" 
              style={{ cursor: 'pointer' }}
              onClick={() => toggleExercise(exercise.id.toString())}
            >
              <Group gap="sm">
                <ThemeIcon 
                  size="lg" 
                  radius="md" 
                  color={exercise.is_completed ? "green" : "blue"} 
                  variant="light"
                >
                  {isExpanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="lg" fw={500}>{exercise.name}</Text>
                  {exercise.description && (
                    <Text size="sm" c="dimmed">{exercise.description}</Text>
                  )}
                </Stack>
              </Group>
              <Group gap="xs">
                <Badge 
                  size="sm" 
                  variant="light" 
                  color={exercise.is_completed ? "green" : "blue"}
                >
                  {exercise.sets || 0} {t('common.sets')}
                </Badge>
                {exercise.video_url && (
                  <Tooltip label={t('workouts.watchVideo')}>
                    <ActionIcon 
                      variant="light" 
                      color="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideo(exercise.video_url || null);
                      }}
                    >
                      <IconVideo size={16} />
                    </ActionIcon>
                  </Tooltip>
                )}
                <Tooltip label={t('workouts.exerciseDetails')}>
                  <ActionIcon variant="light" color="gray">
                    <IconInfoCircle size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>

            <Collapse in={isExpanded}>
              <Stack gap="md" p="md">
                {exercise.notes && (
                  <Paper p="sm" radius="md" withBorder>
                    <Text size="sm" c="dimmed">{exercise.notes}</Text>
                  </Paper>
                )}

                <Group gap="xs">
                  {exercise.reps && (
                    <Badge size="sm" variant="light" color={exercise.is_completed ? "green" : "blue"} leftSection={<IconBarbell size={12} />}>
                      {exercise.reps} {t('common.reps')}
                    </Badge>
                  )}
                  {exercise.weight && (
                    <Badge size="sm" variant="light" color={exercise.is_completed ? "green" : "blue"}>
                      {exercise.weight} {t('common.kg')}
                    </Badge>
                  )}
                  {exercise.duration && (
                    <Badge size="sm" variant="light" color={exercise.is_completed ? "green" : "blue"} leftSection={<IconClock size={12} />}>
                      {exercise.duration}
                    </Badge>
                  )}
                </Group>

                <Group justify="space-between">
                  <Button
                    variant="light"
                    color="blue"
                    leftSection={<IconClock size={16} />}
                    onClick={() => exercise.rest_time && onStartTimer(exercise.rest_time)}
                    disabled={!exercise.rest_time}
                  >
                    {t('workouts.startRestTimer')}
                  </Button>
                  {exercise.is_completed ? (
                    <Button
                      variant="light"
                      color="green"
                      leftSection={<IconCheck size={16} />}
                      disabled
                    >
                      {t('workouts.alreadyCompleted')}
                    </Button>
                  ) : (
                    <Button
                      variant="light"
                      color="green"
                      leftSection={<IconCheck size={16} />}
                      onClick={() => handleExerciseComplete(exercise.id.toString())}
                      loading={loading}
                    >
                      {t('workouts.markComplete')}
                    </Button>
                  )}
                </Group>
              </Stack>
            </Collapse>
          </Paper>
        );
      })}

      <Modal
        opened={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        size="xl"
        title={t('workouts.exerciseVideo')}
      >
        {selectedVideo && (
          <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <LoadingOverlay visible={loading} />
            <iframe
              src={`https://www.youtube.com/embed/${getVideoId(selectedVideo)}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setLoading(false)}
            />
          </div>
        )}
      </Modal>

      <CompletionFeedback
        isOpen={completionFeedback.isOpen}
        onClose={() => setCompletionFeedback(prev => ({ ...prev, isOpen: false }))}
        points={completionFeedback.points}
        streakBonus={completionFeedback.streakBonus}
        achievements={completionFeedback.achievements}
      />
    </Stack>
  );
} 