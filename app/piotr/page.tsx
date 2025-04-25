'use client';

import { Container, Title, Tabs } from '@mantine/core';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { WorkoutList } from '../../components/WorkoutList';
import { supabase } from '../../src/lib/supabase';

interface Exercise {
  id: number;
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  weight?: string;
  video_url?: string;
  notes?: string;
  rest_time?: number;
  is_completed: boolean;
  description?: string;
}

interface Section {
  id: number;
  title: string;
  description?: string;
  exercises: Exercise[];
}

interface Workout {
  id: number;
  name: string;
  day_trigger: string;
  user_name: string;
  sections: Section[];
}

export default function PiotrWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const { data, error } = await supabase
          .from('workouts')
          .select(`
            *,
            sections (
              *,
              exercises (
                *,
                exercise_sets (*)
              )
            )
          `)
          .eq('user_name', 'piotrek')
          .order('day_trigger', { ascending: true });

        if (error) throw error;
        console.log('Fetched workouts:', data);
        setWorkouts(data || []);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const getCurrentDayTab = () => {
    const day = dayjs().day();
    return day === 0 ? 6 : day - 1; // Adjust for Sunday being 0
  };

  const handleExerciseComplete = async (userId: string, pointsToAdd: number) => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          points: pointsToAdd,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating points:', error);
    }
  };

  const handleStartTimer = (duration: number, label: string) => {
    // TODO: Implement timer functionality
    console.log(`Starting timer for ${duration} seconds: ${label}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Title order={1} mb="xl">Plan treningowy - Piotrek</Title>
      <Tabs defaultValue={getCurrentDayTab().toString()}>
        <Tabs.List>
          {workouts.map((workout) => (
            <Tabs.Tab key={workout.id} value={workout.id.toString()}>
              {workout.name}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {workouts.map((workout) => (
          <Tabs.Panel key={workout.id} value={workout.id.toString()}>
            <WorkoutList
              trainingId={workout.id}
              workouts={[workout]}
              onExerciseComplete={handleExerciseComplete}
              onStartTimer={handleStartTimer}
            />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Container>
  );
} 