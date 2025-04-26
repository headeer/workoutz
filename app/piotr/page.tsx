'use client';

import { Title, Tabs, Alert, Container, Paper, Group, Text, Stack, ThemeIcon, Loader, Center, Modal, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import { WorkoutList } from '../../src/components/WorkoutList';
import { WorkoutDay } from '../../src/types/workout';
import { supabase } from '../../src/lib/supabase';
import { IconBarbell, IconCalendar, IconClock } from '@tabler/icons-react';
import { TimerModal } from '../../src/components/TimerModal';
import { useLanguage } from '../../src/lib/LanguageContext';

export default function PiotrWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const { data, error } = await supabase
          .from('workouts')
          .select(`
            *,
            workout_sections (
              *,
              exercises (
                *,
                exercise_sets (*)
              )
            )
          `)
          .or('user_name.eq.piotr,user_name.eq.piotrek');

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
            exercises: section.exercises?.map((exercise: any) => ({
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
          })) || []
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const handleExerciseComplete = async (exerciseId: string) => {
    try {
      // First, sign in as piotrek (since we're using RLS)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'piotr.kowalczyk@example.com',
        password: 'piotrek123'
      });

      if (signInError) throw signInError;

      // Update exercise completion status
      const { error: exerciseError } = await supabase
        .from('exercises')
        .update({ is_completed: true })
        .eq('id', exerciseId);

      if (exerciseError) throw exerciseError;

      // Get current user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', 'piotrek')
        .single();

      if (progressError && progressError.code !== 'PGRST116') {
        throw progressError;
      }

      // If no progress record exists, create one
      if (!progressData) {
        const { error: createError } = await supabase
          .from('user_progress')
          .insert([{
            user_id: 'piotrek',
            points: 10,
            completed_exercises: 1,
            completed_days: 0,
            completed_weeks: 0
          }]);

        if (createError) throw createError;
      } else {
        // Update existing progress
        const { error: updateError } = await supabase
          .from('user_progress')
          .update({
            points: (progressData.points || 0) + 10,
            completed_exercises: (progressData.completed_exercises || 0) + 1
          })
          .eq('user_id', 'piotrek');

        if (updateError) throw updateError;
      }

      // Update local state
      setWorkouts(prevWorkouts => 
        prevWorkouts.map(workout => ({
          ...workout,
          workout_sections: workout.workout_sections?.map(section => ({
            ...section,
            exercises: section.exercises?.map(exercise => 
              exercise.id.toString() === exerciseId 
                ? { ...exercise, is_completed: true }
                : exercise
            ) || []
          })) || []
        }))
      );

      // Check if all exercises in current section are completed
      const currentWorkout = workouts.find(w => w.day_trigger === activeTab);
      if (currentWorkout) {
        const allExercisesCompleted = currentWorkout.workout_sections?.every(section =>
          section.exercises?.every(exercise => exercise.is_completed)
        );

        if (allExercisesCompleted) {
          // Find next available tab
          const currentTabIndex = dayTabs.findIndex(tab => tab.value === activeTab);
          if (currentTabIndex < dayTabs.length - 1) {
            setActiveTab(dayTabs[currentTabIndex + 1].value);
          }
        }
      }
    } catch (err) {
      console.error('Error completing exercise:', err);
      setError(t('workouts.failedToComplete'));
    }
  };

  const handleStartTimer = (duration: number) => {
    setTimerDuration(duration);
    setTimeLeft(duration);
    setIsTimerActive(true);
    setTimerModalOpen(true);
  };

  const handleCloseTimer = () => {
    setTimerModalOpen(false);
    setIsTimerActive(false);
    setTimeLeft(null);
    setTimerDuration(null);
  };

  const handleToggleTimer = () => {
    setIsTimerActive((prev) => !prev);
  };

  const handleResetTimer = () => {
    if (timerDuration !== null) {
      setTimeLeft(timerDuration);
    }
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

  const currentDay = new Date().getDay();
  const dayTabs = [
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' }
  ];

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" color="blue">
              <IconBarbell size={24} />
            </ThemeIcon>
            <Title order={1}>{t('workouts.piotr')}</Title>
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
            value={activeTab || dayTabs.find(tab => tab.value === currentDay.toString())?.value || dayTabs[0].value}
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
                  userId="piotrek"
                />
              </Tabs.Panel>
            ))}
          </Tabs>
        </Paper>

        <TimerModal
          isOpen={timerModalOpen}
          onClose={handleCloseTimer}
          timeLeft={timeLeft}
          duration={timerDuration}
          isActive={isTimerActive}
          onToggle={handleToggleTimer}
          onReset={handleResetTimer}
        />
      </Stack>
    </Container>
  );
} 