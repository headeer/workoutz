import { Accordion, Text, Stack, Checkbox, Button, Group, Container, Title } from '@mantine/core';
import { useState } from 'react';
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
  exercises: Exercise[];
}

interface Workout {
  id: number;
  name: string;
  day_trigger: string;
  user_name: string;
  sections: Section[];
}

interface WorkoutListProps {
  trainingId: number;
  workouts: Workout[];
  onExerciseComplete?: (userId: string, pointsToAdd: number) => Promise<void>;
  onStartTimer: (duration: number, label: string) => void;
}

export function WorkoutList({ trainingId, workouts, onExerciseComplete, onStartTimer }: WorkoutListProps) {
  const [completedExercises, setCompletedExercises] = useState<{ [key: number]: boolean }>({});
  const workout = workouts.find(w => w.id === trainingId);

  if (!workout) {
    return <Text>Loading...</Text>;
  }

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

  const renderExerciseDetails = (exercise: Exercise) => {
    const details: string[] = [];

    if (exercise.sets) details.push(`Sets: ${exercise.sets}`);
    if (exercise.reps) details.push(`Reps: ${exercise.reps}`);
    if (exercise.duration) details.push(`Duration: ${exercise.duration}`);
    if (exercise.weight) details.push(`Weight: ${exercise.weight}`);
    if (exercise.rest_time) details.push(`Rest: ${exercise.rest_time}s`);
    if (exercise.description) details.push(exercise.description);

    return details.join(' | ');
  };

  return (
    <Container>
      {workouts.map((workout) => (
        <div key={workout.id}>
          <Title order={2} mb="md">{workout.name}</Title>
          {workout.sections.map((section) => (
            <WorkoutSection
              key={section.id}
              section={section}
              onExerciseComplete={handleExerciseComplete}
              onStartTimer={onStartTimer}
            />
          ))}
        </div>
      ))}
    </Container>
  );
} 