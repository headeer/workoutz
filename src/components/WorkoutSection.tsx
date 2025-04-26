import { Text, Group, Button, Stack, Paper, Modal, LoadingOverlay, Badge, ThemeIcon, ActionIcon, Tooltip, Collapse } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Exercise } from '../types/workout';
import { IconPlayerPlay, IconCheck, IconClock, IconInfoCircle, IconBarbell, IconChevronDown, IconChevronUp, IconVideo, IconRefresh } from '@tabler/icons-react';
import { useLanguage } from '../lib/LanguageContext';
import { CompletionFeedback } from './CompletionFeedback';
import { completeExercise } from '../lib/exerciseService';
import { notifications } from '@mantine/notifications';
import { supabase } from '../lib/supabaseClient';

interface WorkoutSectionProps {
  name: string;
  exercises: Exercise[];
  onExerciseComplete: (exerciseId: string, pointsAdded?: number) => Promise<void>;
  onStartTimer: (duration: number) => void;
  userId?: string;
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
  const [loadingExercise, setLoadingExercise] = useState<string | null>(null);
  const [localExercises, setLocalExercises] = useState<Exercise[]>(exercises);

  useEffect(() => {
    setLocalExercises(exercises);
  }, [exercises]);

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

  const handleResetAllExercises = async () => {
    if (!userId || localExercises.length === 0) return;
    
    const sectionIds = [...new Set(localExercises.map(ex => ex.section_id))];
    
    if (sectionIds.length === 0) return;
    
    try {
      setLocalExercises(prev => 
        prev.map(ex => ({ ...ex, is_completed: false }))
      );
      
      const { error } = await supabase
        .from('exercises')
        .update({ is_completed: false })
        .in('section_id', sectionIds);
        
      if (error) throw error;
      
      notifications.show({
        title: 'Exercises Reset',
        message: 'All exercises in this section have been reset',
        color: 'blue',
      });
      
      localExercises.forEach(ex => {
        if (ex.is_completed) {
          onExerciseComplete(ex.id.toString());
        }
      });
      
    } catch (error) {
      notifications.show({
        title: t('common.error'),
        message: 'Failed to reset exercises',
        color: 'red',
      });
    }
  };

  const handleExerciseComplete = async (exerciseId: string) => {
    try {
      const exercise = localExercises.find(ex => ex.id.toString() === exerciseId);
      if (exercise && exercise.is_completed) {
        notifications.show({
          title: t('workouts.alreadyCompleted'),
          message: "This exercise has already been completed",
          color: "orange",
        });
        return;
      }
      
      setLocalExercises(prev => 
        prev.map(ex => 
          ex.id.toString() === exerciseId ? { ...ex, is_completed: true } : ex
        )
      );
      
      setLoadingExercise(exerciseId);
      const result = await completeExercise(exerciseId, userId!);
      if (result.success) {
        await onExerciseComplete(exerciseId, result.points);
        
        setCompletionFeedback({
          isOpen: true,
          points: result.points,
          streakBonus: result.points - 10,
          achievements: result.achievements || []
        });
        notifications.show({
          title: t('workouts.completedTitle') || 'Exercise Completed',
          message: t('workouts.completedMessage') || 'Great job! You completed the exercise.',
          color: 'green',
          icon: <IconCheck size={18} />,
        });
      } else {
        setLocalExercises(prev => 
          prev.map(ex => 
            ex.id.toString() === exerciseId ? { ...ex, is_completed: false } : ex
          )
        );
        
        notifications.show({
          title: t('common.error'),
          message: result.error || 'Failed to complete exercise',
          color: 'red',
        });
      }
    } catch (error) {
      setLocalExercises(prev => 
        prev.map(ex => 
          ex.id.toString() === exerciseId ? { ...ex, is_completed: false } : ex
        )
      );
      
      notifications.show({
        title: t('common.error'),
        message: error instanceof Error ? error.message : 'Failed to complete exercise',
        color: 'red',
      });
    } finally {
      setLoadingExercise(null);
    }
  };

  if (!localExercises || localExercises.length === 0) {
    return (
      <Paper p="md" radius="md" withBorder>
        <Text c="dimmed" ta="center">{t('workouts.noExercises')}</Text>
      </Paper>
    );
  }

  const completedExercisesCount = localExercises.filter(ex => ex.is_completed).length;
  const totalExercisesCount = localExercises.length;
  const allCompleted = completedExercisesCount === totalExercisesCount && totalExercisesCount > 0;

  return (
    <Stack gap="md" p="md">
      <LoadingOverlay visible={loading} />
      
      <Group justify="space-between" mb="xs">
        <Group>
          <ThemeIcon size="lg" radius="md" color={allCompleted ? "green" : "blue"} variant={allCompleted ? "filled" : "light"}>
            <IconBarbell size={20} />
          </ThemeIcon>
          <Text fw={700}>{name}</Text>
        </Group>
        
        <Group gap="xs">
          <Badge color={allCompleted ? "green" : "blue"}>
            {completedExercisesCount}/{totalExercisesCount}
          </Badge>
          
          {completedExercisesCount > 0 && (
            <Button 
              color="red" 
              variant="light"
              onClick={handleResetAllExercises}
              leftSection={<IconRefresh size={16} />}
              size="xs"
            >
              Reset All
            </Button>
          )}
        </Group>
      </Group>
      
      {localExercises.map((exercise) => {
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
                  variant={exercise.is_completed ? "filled" : "light"}
                >
                  {exercise.is_completed ? <IconCheck size={20} /> : (isExpanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />)}
                </ThemeIcon>
                <Stack gap={0}>
                  <Group gap="xs">
                    <Text size="lg" fw={500} td={exercise.is_completed ? "line-through" : "none"} c={exercise.is_completed ? "dimmed" : undefined}>{exercise.name}</Text>
                    {exercise.is_completed && (
                      <Badge color="green" variant="filled" size="xs">
                        {t('common.completed')}
                      </Badge>
                    )}
                  </Group>
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
                  <Group>
                    <Button
                      variant="light"
                      color="blue"
                      leftSection={<IconClock size={16} />}
                      onClick={() => exercise.rest_time && onStartTimer(exercise.rest_time)}
                      disabled={!exercise.rest_time}
                    >
                      {t('workouts.startRestTimer')}
                    </Button>
                    {exercise.is_completed && (
                      <Button
                        variant="filled"
                        color="red"
                        onClick={() => {
                          setLocalExercises(prev => 
                            prev.map(ex => 
                              ex.id.toString() === exercise.id.toString() ? { ...ex, is_completed: false } : ex
                            )
                          );
                          
                          supabase
                            .from('exercises')
                            .update({ is_completed: false })
                            .eq('id', exercise.id.toString())
                            .then(() => {
                              if (onExerciseComplete) {
                                onExerciseComplete(exercise.id.toString());
                              }
                              
                              notifications.show({
                                title: 'Exercise Reset',
                                message: 'The exercise has been reset and can be completed again',
                                color: 'blue'
                              });
                            });
                        }}
                        size="sm"
                      >
                        Restart Exercise
                      </Button>
                    )}
                  </Group>
                  {exercise.is_completed ? (
                    <Button
                      variant="filled"
                      color="green"
                      leftSection={<IconCheck size={16} />}
                      disabled
                      style={{ opacity: 0.7 }}
                    >
                      {t('workouts.alreadyCompleted')}
                    </Button>
                  ) : (
                    <Tooltip label={!userId ? t('auth.loginRequired') || 'Log in to complete' : ''} disabled={!!userId}>
                      <Button
                        variant="gradient" 
                        gradient={{ from: 'green', to: 'lime', deg: 90 }}
                        leftSection={<IconCheck size={16} />}
                        onClick={() => handleExerciseComplete(exercise.id.toString())}
                        loading={loadingExercise === exercise.id.toString()}
                        disabled={loadingExercise !== null || !userId}
                        radius="md"
                        size="md"
                        style={{ 
                          fontWeight: 600,
                          opacity: loadingExercise !== null || !userId ? 0.6 : 1
                        }}
                      >
                        {t('workouts.markComplete')}
                      </Button>
                    </Tooltip>
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