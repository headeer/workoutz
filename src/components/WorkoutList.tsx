import { Title, Text, Stack, Group, Paper, Badge, Button, Collapse, ThemeIcon, ActionIcon, Tooltip, LoadingOverlay } from '@mantine/core';
import { WorkoutSection } from './WorkoutSection';
import { WorkoutDay } from '../types/workout';
import { IconChevronDown, IconChevronUp, IconClock, IconInfoCircle, IconRefresh } from '@tabler/icons-react';
import { useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { resetWorkout } from '../lib/exerciseService';
import { notifications } from '@mantine/notifications';

interface WorkoutListProps {
  trainingId: string;
  workouts: WorkoutDay[];
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onStartTimer: (duration: number) => void;
  userId: string;
}

export function WorkoutList({ trainingId, workouts, onExerciseComplete, onStartTimer, userId }: WorkoutListProps) {
  const workout = workouts.find(w => w.id === trainingId);
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({});
  const [isResetting, setIsResetting] = useState(false);
  const { t } = useLanguage();

  if (!workout) {
    return <Text>{t('common.noData')}</Text>;
  }

  const estimatedTime = workout.workout_sections?.reduce((total, section) => {
    const exercises = section.exercises || [];
    return total + exercises.reduce((sectionTotal, exercise) => {
      return sectionTotal + (exercise.rest_time || 0);
    }, 0);
  }, 0) || 0;

  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleReset = async () => {
    try {
      setIsResetting(true);
      const result = await resetWorkout(trainingId);
      
      if (result.success) {
        notifications.show({
          title: t('workouts.resetSuccess'),
          message: t('workouts.resetMessage'),
          color: 'blue'
        });
        // Refresh the page to show updated state
        window.location.reload();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      notifications.show({
        title: t('common.error'),
        message: t('workouts.resetError'),
        color: 'red'
      });
    } finally {
      setIsResetting(false);
    }
  };

  const totalExercises = workout.workout_sections?.reduce((total, section) => 
    total + (section.exercises?.length || 0), 0) || 0;
  
  const completedExercises = workout.workout_sections?.reduce((total, section) => 
    total + (section.exercises?.filter(e => e.is_completed)?.length || 0), 0) || 0;

  const isWorkoutCompleted = totalExercises > 0 && completedExercises === totalExercises;

  return (
    <Stack gap="md" pos="relative">
      <LoadingOverlay visible={isResetting} />
      <Paper shadow="sm" p="md" radius="md" withBorder>
        <Group justify="space-between" align="center">
          <Stack gap={0}>
            <Title order={2}>{workout.name}</Title>
            <Group gap="xs" mt={4}>
              <ThemeIcon size="sm" radius="md" color="gray" variant="light">
                <IconClock size={14} />
              </ThemeIcon>
              <Text size="sm" c="dimmed">
                {t('workouts.estimatedTime').replace('{0}', Math.floor(estimatedTime / 60).toString())}
              </Text>
            </Group>
          </Stack>
          <Group gap="md">
            <Badge 
              size="lg" 
              variant="light" 
              color={isWorkoutCompleted ? "green" : "blue"}
            >
              {completedExercises}/{totalExercises} {t('common.exercises')}
            </Badge>
            <Tooltip label={t('workouts.resetWorkout')}>
              <ActionIcon 
                variant="light" 
                color="blue" 
                onClick={handleReset}
                loading={isResetting}
                disabled={completedExercises === 0}
              >
                <IconRefresh size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Paper>
      
      {workout.workout_sections?.map((section) => {
        const isExpanded = expandedSections[section.id] ?? true;
        const completedInSection = section.exercises?.filter(e => e.is_completed)?.length || 0;
        const totalInSection = section.exercises?.length || 0;

        return (
          <Paper key={section.id} shadow="sm" radius="md" withBorder>
            <Group 
              justify="space-between" 
              p="md" 
              style={{ cursor: 'pointer' }}
              onClick={() => toggleSection(section.id)}
            >
              <Group gap="sm">
                <ThemeIcon 
                  size="lg" 
                  radius="md" 
                  color={completedInSection === totalInSection ? "green" : "blue"} 
                  variant="light"
                >
                  {isExpanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="lg" fw={500}>{section.name}</Text>
                  {section.description && (
                    <Text size="sm" c="dimmed">{section.description}</Text>
                  )}
                </Stack>
              </Group>
              <Group gap="xs">
                <Badge 
                  size="sm" 
                  variant="light" 
                  color={completedInSection === totalInSection ? "green" : "blue"}
                >
                  {completedInSection}/{totalInSection} {t('common.exercises')}
                </Badge>
                <Tooltip label={t('workouts.sectionDetails')}>
                  <ActionIcon variant="light" color="gray">
                    <IconInfoCircle size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>

            <Collapse in={isExpanded}>
              <WorkoutSection
                name={section.name}
                exercises={section.exercises || []}
                onExerciseComplete={onExerciseComplete}
                onStartTimer={onStartTimer}
                userId={userId}
              />
            </Collapse>
          </Paper>
        );
      })}
    </Stack>
  );
} 