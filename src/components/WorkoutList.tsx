import { useState, useEffect, useCallback } from 'react';
import { Accordion, Paper, Stack, Text, Alert, Button, Group, Modal, Card, Badge } from '@mantine/core';
import { WorkoutDay } from '../types';
import { WorkoutSection } from './WorkoutSection';
import { Timer } from './Timer';
import { Exercise } from './Exercise';
import { ENDPOINTS } from '../config';

type UserId = 'tomasz' | 'piotrek';

interface WorkoutListProps {
  trainingId: number;
  workouts: WorkoutDay[];
  onExerciseComplete: (userId: UserId, points: number) => void;
}

export function WorkoutList({ trainingId, workouts, onExerciseComplete }: WorkoutListProps) {
  const [workoutsState, setWorkoutsState] = useState<WorkoutDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTimer, setActiveTimer] = useState<{ duration: number; label: string } | null>(null);
  const [showTimerConfirmModal, setShowTimerConfirmModal] = useState(false);
  const [pendingTimer, setPendingTimer] = useState<{ duration: number; label: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(ENDPOINTS.workouts)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch workouts');
        }
        return res.json();
      })
      .then((data) => {
        setWorkoutsState(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [trainingId]);

  const handleTimerComplete = useCallback(() => {
    setActiveTimer(null);
    // Play sound when timer completes
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play();
  }, []);

  const handleStartTimer = useCallback((duration: number, label: string) => {
    if (activeTimer) {
      setPendingTimer({ duration, label });
      setShowTimerConfirmModal(true);
    } else {
      setActiveTimer({ duration, label });
    }
  }, [activeTimer]);

  const handleConfirmNewTimer = () => {
    if (pendingTimer) {
      setActiveTimer(pendingTimer);
      setPendingTimer(null);
    }
    setShowTimerConfirmModal(false);
  };

  const handleCancelNewTimer = () => {
    setPendingTimer(null);
    setShowTimerConfirmModal(false);
  };

  const handleExerciseComplete = useCallback((workout: WorkoutDay, exercise: any) => {
    // Mark exercise as completed
    exercise.isCompleted = true;

    // Award points for exercise completion
    onExerciseComplete(workout.user as UserId, 5);

    // Check if all exercises in the current section are completed
    const currentSection = workout.sections.find(section => 
      section.exercises.includes(exercise)
    );
    
    if (currentSection) {
      const allExercisesInSectionCompleted = currentSection.exercises.every(
        (ex: any) => ex.isCompleted
      );

      if (allExercisesInSectionCompleted) {
        // Award bonus points for completing all exercises in a section
        onExerciseComplete(workout.user as UserId, 25);
      }
    }

    // Check if all exercises in the workout are completed
    const allExercisesCompleted = workout.sections.every((section: any) =>
      section.exercises.every((ex: any) => ex.isCompleted)
    );

    if (allExercisesCompleted) {
      // Award bonus points for completing all exercises in the workout
      onExerciseComplete(workout.user as UserId, 50);
    }
  }, [onExerciseComplete]);

  const resetProgress = async () => {
    const workout = workoutsState.find(w => w.id === trainingId);
    if (!workout) return;

    const updatedWorkouts = [...workoutsState];
    const workoutIndex = updatedWorkouts.findIndex(w => w.id === trainingId);
    
    updatedWorkouts[workoutIndex].sections.forEach(section => {
      section.exercises.forEach(exercise => {
        exercise.isCompleted = false;
      });
    });

    try {
      await fetch(`http://localhost:3000/workouts/${trainingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWorkouts[workoutIndex]),
      });
      setWorkoutsState(updatedWorkouts);
    } catch (err) {
      console.error('Failed to reset progress:', err);
    }
  };

  if (loading) {
    return <Text>Wczytywanie planu treningowego...</Text>;
  }

  if (error) {
    return (
      <Alert color="red" title="Błąd">
        {error}. Sprawdź czy serwer JSON jest uruchomiony (npm run server).
      </Alert>
    );
  }

  const workout = workoutsState.find(w => w.id === trainingId);

  if (!workout) {
    return (
      <Alert color="blue" title="Info">
        Plan treningowy {trainingId} jest w przygotowaniu...
      </Alert>
    );
  }

  const completedExercises = workout.sections.reduce((total, section) => 
    total + section.exercises.filter(e => e.isCompleted).length, 0);
  const totalExercises = workout.sections.reduce((total, section) => 
    total + section.exercises.length, 0);
  const progress = Math.round((completedExercises / totalExercises) * 100);

  return (
    <Stack gap="xl" className="workout-list">
      {activeTimer && (
        <div className="timer-container">
          <Timer
            duration={activeTimer.duration}
            label={activeTimer.label}
            onComplete={handleTimerComplete}
          />
        </div>
      )}
      
      <Paper shadow="xs" p="md" className="progress-card">
        <Group justify="space-between" mb="xs">
          <Text c="dark" size="lg" fw={700}>
            Postęp treningu
          </Text>
          <Text size="lg" fw={700} c={progress === 100 ? "green" : "blue"}>
            {progress}%
          </Text>
        </Group>
        <Text size="sm" color="dimmed" mb="md">
          Ukończono {completedExercises} z {totalExercises} ćwiczeń
        </Text>
        <Button 
          variant="light" 
          color="red" 
          fullWidth 
          onClick={resetProgress}
          disabled={completedExercises === 0}
        >
          Resetuj postęp
        </Button>
      </Paper>

      <Paper shadow="xs" p="md">
        <Accordion variant="separated">
          {workout.sections.map((section, sectionIndex) => (
            <WorkoutSection
              key={sectionIndex}
              section={section}
              onStartTimer={handleStartTimer}
              onExerciseComplete={(exerciseIndex: number) => 
                handleExerciseComplete(workout, section.exercises[exerciseIndex])
              }
            />
          ))}
        </Accordion>
      </Paper>

      <Modal
        opened={showTimerConfirmModal}
        onClose={handleCancelNewTimer}
        title="Aktywny timer"
        size="sm"
      >
        <Stack>
          <Text>Masz już aktywny timer. Czy chcesz go zastąpić nowym?</Text>
          <Group justify="space-between">
            <Button variant="light" onClick={handleCancelNewTimer}>
              Anuluj
            </Button>
            <Button color="blue" onClick={handleConfirmNewTimer}>
              Zastąp timer
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
} 