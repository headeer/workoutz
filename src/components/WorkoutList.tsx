import { Accordion, Text, Stack, Checkbox, Button, Group, Container, Title, Alert } from '@mantine/core';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { WorkoutSection } from './WorkoutSection';
import type { Exercise as MainExercise } from '../types/workout';

interface Exercise extends MainExercise {}

interface Section {
  id: number;
  title: string;
  description?: string;
  order_index: number;
  exercises: Exercise[];
}

interface Workout {
  id: number;
  name: string;
  day_trigger: string;
  user_name: string;
  workout_sections: Section[];
}

interface WorkoutListProps {
  trainingId: number;
  workouts: Workout[];
  onExerciseComplete?: (exerciseId: string) => Promise<void>;
  onStartTimer: (duration: number) => void;
  userId: string;
}

export function WorkoutList({ trainingId, workouts, onExerciseComplete, onStartTimer, userId }: WorkoutListProps) {
  const [completedExercises, setCompletedExercises] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const fetchWorkout = async () => {
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
          .eq('id', trainingId)
          .maybeSingle();

        if (error) throw error;
        setWorkout(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch workout');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [trainingId]);

  const handleExerciseComplete = async (exerciseId: string) => {
    try {
      const { error } = await supabase
        .from('exercises')
        .update({ is_completed: true })
        .eq('id', exerciseId);

      if (error) throw error;

      // Add points when exercise is completed
      if (onExerciseComplete) {
        await onExerciseComplete(exerciseId);
      }
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  };

  if (loading) {
    return <Text>Loading workout...</Text>;
  }

  if (error) {
    return <Alert color="red" title="Error">{error}</Alert>;
  }

  if (!workout) {
    return <Alert color="blue" title="Info">Workout not found. Please check if the workout ID is correct.</Alert>;
  }

  return (
    <Container>
      <Title order={2} mb="md">{workout.name}</Title>
      <Accordion>
        {workout.workout_sections.map((section) => (
          <WorkoutSection
            key={section.id}
            name={section.title}
            exercises={section.exercises}
            onExerciseComplete={handleExerciseComplete}
            onStartTimer={onStartTimer}
            userId={userId}
          />
        ))}
      </Accordion>
    </Container>
  );
} 