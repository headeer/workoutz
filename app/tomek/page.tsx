'use client';

import { Container, Title, Tabs } from '@mantine/core';
import { useEffect, useState } from 'react';
import { WorkoutList } from '../../components/WorkoutList';
import { getWorkouts } from '../../src/pages/api/workouts';
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

export default function TomekWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const data = await getWorkouts('tomasz');
      setWorkouts(data || []);
      setLoading(false);
    };
    fetchWorkouts();
  }, []);

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
    <Container size="lg" py="xl">
      <Title ta="center" mb="xl">Tomasz's Workouts</Title>
      
      <Tabs defaultValue="day1" mb="xl">
        <Tabs.List grow>
          <Tabs.Tab value="day1" color="blue">Back & Biceps</Tabs.Tab>
          <Tabs.Tab value="day2" color="green">Chest & Triceps</Tabs.Tab>
          <Tabs.Tab value="day3" color="grape">Legs</Tabs.Tab>
          <Tabs.Tab value="day4" color="orange">Shoulders & Abs</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="day1" pt="md">
          <WorkoutList 
            trainingId={6} 
            workouts={workouts} 
            onExerciseComplete={handleExerciseComplete}
            onStartTimer={handleStartTimer}
          />
        </Tabs.Panel>
        <Tabs.Panel value="day2" pt="md">
          <WorkoutList 
            trainingId={7} 
            workouts={workouts} 
            onExerciseComplete={handleExerciseComplete}
            onStartTimer={handleStartTimer}
          />
        </Tabs.Panel>
        <Tabs.Panel value="day3" pt="md">
          <WorkoutList 
            trainingId={8} 
            workouts={workouts} 
            onExerciseComplete={handleExerciseComplete}
            onStartTimer={handleStartTimer}
          />
        </Tabs.Panel>
        <Tabs.Panel value="day4" pt="md">
          <WorkoutList 
            trainingId={9} 
            workouts={workouts} 
            onExerciseComplete={handleExerciseComplete}
            onStartTimer={handleStartTimer}
          />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
} 