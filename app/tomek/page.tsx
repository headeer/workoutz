'use client';

import { Title, Tabs, Alert, Container, Paper, Group, Text, Stack, ThemeIcon, Loader, Center } from '@mantine/core';
import { useEffect, useState } from 'react';
import { WorkoutList } from '../../src/components/WorkoutList';
import { WorkoutDay } from '../../src/types/workout';
import { supabase } from '../../src/lib/supabaseClient';
import { IconBarbell, IconCalendar } from '@tabler/icons-react';
import { useLanguage } from '../../src/lib/LanguageContext';

export default function TomekWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('day1');
  const { t } = useLanguage();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const { data, error } = await supabase
          .from('workouts')
          .select(`
            *,
            workout_sections!workout_id(
              id,
              workout_id,
              title,
              description,
              order_index,
              exercises!section_id(
                id,
                section_id,
                name,
                description,
                video_url,
                sets,
                reps,
                duration,
                weight,
                notes,
                rest_time,
                is_completed,
                exercise_sets (*)
              )
            )
          `)
          .eq('user_name', 'tomasz')
          .order('id');

        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          setError(t('workouts.noWorkoutsFound'));
          setLoading(false);
          return;
        }

        const mappedWorkouts: WorkoutDay[] = data.map((workout: any) => ({
          id: workout.id.toString(),
          name: workout.name,
          day_trigger: workout.day_trigger,
          user_name: workout.user_name,
          workout_sections: workout.workout_sections?.map((section: any) => ({
            id: section.id,
            workout_id: section.workout_id,
            name: section.title,
            description: section.description,
            exercises: section.exercises?.sort((a: any, b: any) => a.order_index - b.order_index).map((exercise: any) => ({
              id: exercise.id,
              section_id: exercise.section_id,
              name: exercise.name,
              description: exercise.description,
              video_url: exercise.video_url,
              sets: exercise.sets,
              reps: exercise.reps,
              duration: exercise.duration,
              weight: exercise.weight,
              notes: exercise.notes,
              rest_time: exercise.rest_time,
              is_completed: exercise.is_completed,
              exercise_sets: exercise.exercise_sets
            })) || []
          })).sort((a: any, b: any) => a.order_index - b.order_index) || []
        }));

        setWorkouts(mappedWorkouts);
      } catch (err) {
        setError(t('workouts.failedToFetch'));
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [t]);

  const handleExerciseComplete = async (exerciseId: string) => {
    try {
      await supabase
        .from('exercises')
        .update({ is_completed: true })
        .eq('id', exerciseId);

      setWorkouts(prevWorkouts => {
        return prevWorkouts.map(workout => ({
          ...workout,
          workout_sections: workout.workout_sections?.map(section => ({
            ...section,
            exercises: section.exercises?.map(exercise => 
              exercise.id.toString() === exerciseId
                ? { ...exercise, is_completed: true }
                : exercise
            )
          }))
        }));
      });

      // Check if all exercises in current section are completed
      if (activeTab) {
        const currentWorkout = workouts.find(w => {
          switch (activeTab) {
            case 'day1': return w.id === '10';
            case 'day2': return w.id === '11';
            case 'day3': return w.id === '12';
            case 'day4': return w.id === '13';
            default: return false;
          }
        });

        if (currentWorkout) {
          const allExercisesCompleted = currentWorkout.workout_sections?.every(section =>
            section.exercises?.every(exercise => exercise.is_completed)
          );

          if (allExercisesCompleted) {
            // Move to next tab
            const tabs = ['day1', 'day2', 'day3', 'day4'];
            const currentTabIndex = tabs.indexOf(activeTab);
            if (currentTabIndex < tabs.length - 1) {
              setActiveTab(tabs[currentTabIndex + 1]);
            }
          }
        }
      }
    } catch (err) {
      setError(t('workouts.failedToComplete'));
    }
  };

  const handleStartTimer = (duration: number) => {
    // Timer functionality will be implemented later
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="xl" />
          <Text size="lg" fw={500}>{t('workouts.loading')}</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Alert color="red" title={t('common.error')} icon={<IconBarbell size={20} />}>
          {error}
        </Alert>
      </Container>
    );
  }

  const dayTabs = [
    { value: 'day1', label: t('workouts.days.day1'), workoutId: '10' },
    { value: 'day2', label: t('workouts.days.day2'), workoutId: '11' },
    { value: 'day3', label: t('workouts.days.day3'), workoutId: '12' },
    { value: 'day4', label: t('workouts.days.day4'), workoutId: '13' }
  ];

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" color="blue">
              <IconBarbell size={24} />
            </ThemeIcon>
            <Title order={1}>{t('workouts.tomek')}</Title>
          </Group>
          <Group gap="xs">
            <ThemeIcon size="sm" radius="md" color="gray" variant="light">
              <IconCalendar size={16} />
            </ThemeIcon>
            <Text size="sm" c="dimmed">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </Group>
        </Group>

        <Paper shadow="sm" p="md" radius="md">
          <Tabs 
            value={activeTab}
            onChange={setActiveTab}
            variant="pills"
            styles={(theme) => ({
              tab: {
                '&[data-active]': {
                  backgroundColor: theme.colors.blue[6],
                  color: theme.white,
                },
              },
            })}
          >
            <Tabs.List grow>
              {dayTabs.map((tab) => (
                <Tabs.Tab 
                  key={tab.value} 
                  value={tab.value}
                  leftSection={<IconBarbell size={14} />}
                >
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {workouts.map((workout) => (
              <Tabs.Panel key={workout.id} value={workout.day_trigger} pt="md">
                <WorkoutList
                  trainingId={workout.id}
                  workouts={workouts}
                  onExerciseComplete={handleExerciseComplete}
                  onStartTimer={handleStartTimer}
                  userId="tomasz"
                />
              </Tabs.Panel>
            ))}
          </Tabs>
        </Paper>
      </Stack>
    </Container>
  );
} 