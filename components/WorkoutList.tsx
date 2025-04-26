import { Accordion, Text, Stack, Checkbox, Button, Group, Container, Title, Alert } from '@mantine/core';
import { useState, useEffect } from 'react';
import { updateExercise } from '../src/pages/api/workouts';
import { supabase } from '../src/lib/supabase';
import { WorkoutSection } from '../src/components/WorkoutSection';

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
  onExerciseComplete?: (userId: string, pointsToAdd: number) => Promise<void>;
  onStartTimer: (duration: number, label: string) => void;
}

export function WorkoutList({ trainingId, workouts, onExerciseComplete, onStartTimer }: WorkoutListProps) {
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

  const handleExerciseComplete = async (exerciseId: number, isCompleted: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('exercises')
        .update({ is_completed: isCompleted })
        .eq('id', exerciseId);

      if (error) throw error;

      // Add points when exercise is completed
      if (isCompleted) {
        if (onExerciseComplete) {
          await onExerciseComplete(user.id, 10); // 10 points per completed exercise
        }
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
            section={section}
            onExerciseComplete={handleExerciseComplete}
            onStartTimer={onStartTimer}
          />
        ))}
      </Accordion>
    </Container>
  );
} 