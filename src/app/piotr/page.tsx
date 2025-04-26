'use client';

import { Title, Tabs, Alert, Container, Paper, Group, Text, Stack, ThemeIcon, Loader, Center, Modal, Button, Badge } from '@mantine/core';
import { useEffect, useState } from 'react';
import { WorkoutList } from '../../components/WorkoutList';
import { WorkoutDay } from '../../types/workout';
import { supabase } from '../../lib/supabaseClient';
import { IconBarbell, IconCalendar, IconClock, IconRefresh } from '@tabler/icons-react';
import { TimerModal } from '../../components/TimerModal';
import { useLanguage } from '../../lib/LanguageContext';
import { getUserProgress } from '../../pages/api/userProgress';

export default function PiotrWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [timerDuration, setTimerDuration] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // Check if workouts were recently reset
        const resetTimestamp = localStorage.getItem('workout_reset_piotrek');
        const cacheInvalidated = resetTimestamp && (Date.now() - parseInt(resetTimestamp)) < 60000; // Within last minute
        
        if (cacheInvalidated) {
          // Clear reset timestamp
          localStorage.removeItem('workout_reset_piotrek');
          console.log('Workout reset detected');
          
          // Show refresh indicator instead of auto-refreshing
          setNeedsRefresh(true);
        }

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
          .or('user_id.eq.piotr,user_id.eq.piotrek');

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
    getUserProgress('piotrek').then((data) => {
      setPoints(data?.total_points || 0);
    });
  }, []);

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

  const handleExerciseComplete = async (exerciseId: string, pointsAdded = 10) => {
    try {
      // Find the exercise to update
      let exerciseUpdated = false;
      
      // Update local state to reflect completion in the UI immediately
      setWorkouts(prevWorkouts => {
        const newWorkouts = prevWorkouts.map(workout => ({
          ...workout,
          workout_sections: workout.workout_sections?.map(section => ({
            ...section,
            exercises: section.exercises?.map(exercise => {
              if (exercise.id.toString() === exerciseId && !exercise.is_completed) {
                exerciseUpdated = true;
                return { ...exercise, is_completed: true };
              }
              return exercise;
            }) || []
          })) || []
        }));
        
        return newWorkouts;
      });
      
      // If the exercise was already completed (not updated in our UI), don't proceed with the API call
      if (!exerciseUpdated) {
        return;
      }

      // Update points immediately in UI
      setPoints(currentPoints => currentPoints + pointsAdded);

      // Update exercise completion status in the database
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
            total_points: pointsAdded,
            completed_exercises: 1,
            completed_days: 0,
            completed_weeks: 0
          }]);

        if (createError) throw createError;
      } else {
        // Update existing progress
        const newPoints = (progressData.total_points || 0) + pointsAdded;
        const { error: updateError } = await supabase
          .from('user_progress')
          .update({
            total_points: newPoints,
            completed_exercises: (progressData.completed_exercises || 0) + 1
          })
          .eq('user_id', 'piotrek');

        if (updateError) throw updateError;
      }

      // Check if all exercises in current section are completed
      const currentWorkout = workouts.find(w => w.day_trigger === activeTab);
      if (currentWorkout) {
        const allExercisesCompleted = currentWorkout.workout_sections?.every(section =>
          section.exercises?.every(exercise => exercise.is_completed)
        );

        if (allExercisesCompleted) {
          // Update workout completion in the database
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', 'piotrek')
            .single();

          if (progressData && !progressError) {
            const today = new Date();
            const lastUpdate = progressData.updated_at ? new Date(progressData.updated_at) : null;
            const isNewDay = !lastUpdate || 
              (today.getDate() !== lastUpdate.getDate() || 
               today.getMonth() !== lastUpdate.getMonth() || 
               today.getFullYear() !== lastUpdate.getFullYear());
            
            // Only increment streak if it's a new day
            const newStreakDays = isNewDay ? progressData.streak_days + 1 : progressData.streak_days;
            
            // Update completion status
            await supabase
              .from('user_progress')
              .update({
                total_points: progressData.total_points + 50, // Bonus for completing workout
                completed_days: progressData.completed_days + 1,
                total_workouts: progressData.total_workouts + 1,
                streak_days: newStreakDays,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', 'piotrek');
            
            // Update points in UI
            setPoints(currentPoints => currentPoints + 50);
          }

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
        {needsRefresh && (
          <Alert 
            color="blue" 
            title="Workouts have been reset" 
            withCloseButton
            onClose={() => setNeedsRefresh(false)}
          >
            <Group align="center" gap="md">
              <Text>Your workout progress has been reset. Reload the page to see the changes.</Text>
              <Button 
                color="blue" 
                size="sm"
                leftSection={<IconRefresh size={16} />}
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </Group>
          </Alert>
        )}
        
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" color="blue">
              <IconBarbell size={24} />
            </ThemeIcon>
            <Title order={1}>{t('workouts.piotr')}</Title>
            <Badge color="grape" size="lg" ml="md">{points} pts</Badge>
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
                  trainingId={Number(workout.id)}
                  workouts={workouts.map(w => ({
                    ...w,
                    id: Number(w.id),
                    workout_sections: (w.workout_sections ?? []).map(section => ({
                      ...section,
                      title: section.name,
                      order_index: (section as any).order_index ?? 0,
                      exercises: section.exercises ?? []
                    }))
                  }))}
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