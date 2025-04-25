'use client';

import { Container, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabase';

interface UserProgress {
  totalPoints: number;
  completedExercises: number;
  completedDays: number;
  completedWeeks: number;
}

interface UserProgressState {
  tomasz: UserProgress;
  piotrek: UserProgress;
}

export default function Summary() {
  const [userProgress, setUserProgress] = useState<UserProgressState>({
    tomasz: {
      totalPoints: 0,
      completedExercises: 0,
      completedDays: 0,
      completedWeeks: 0,
    },
    piotrek: {
      totalPoints: 0,
      completedExercises: 0,
      completedDays: 0,
      completedWeeks: 0,
    },
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .in('user_id', ['tomasz', 'piotrek']);

        if (error) throw error;

        const progress: UserProgressState = {
          tomasz: {
            totalPoints: data.find(d => d.user_id === 'tomasz')?.points || 0,
            completedExercises: data.find(d => d.user_id === 'tomasz')?.completed_exercises || 0,
            completedDays: data.find(d => d.user_id === 'tomasz')?.completed_days || 0,
            completedWeeks: data.find(d => d.user_id === 'tomasz')?.completed_weeks || 0,
          },
          piotrek: {
            totalPoints: data.find(d => d.user_id === 'piotrek')?.points || 0,
            completedExercises: data.find(d => d.user_id === 'piotrek')?.completed_exercises || 0,
            completedDays: data.find(d => d.user_id === 'piotrek')?.completed_days || 0,
            completedWeeks: data.find(d => d.user_id === 'piotrek')?.completed_weeks || 0,
          },
        };

        setUserProgress(progress);
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };

    fetchProgress();
  }, []);

  return (
    <Container size="lg" py="xl">
      <Title ta="center" mb="xl">Training Summary</Title>
      
      <div>
        <Title order={2} mb="md">Piotr's Progress</Title>
        <p>Total Points: {userProgress.piotrek.totalPoints}</p>
        <p>Completed Exercises: {userProgress.piotrek.completedExercises}</p>
        <p>Completed Days: {userProgress.piotrek.completedDays}</p>
        <p>Completed Weeks: {userProgress.piotrek.completedWeeks}</p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Title order={2} mb="md">Tomasz's Progress</Title>
        <p>Total Points: {userProgress.tomasz.totalPoints}</p>
        <p>Completed Exercises: {userProgress.tomasz.completedExercises}</p>
        <p>Completed Days: {userProgress.tomasz.completedDays}</p>
        <p>Completed Weeks: {userProgress.tomasz.completedWeeks}</p>
      </div>
    </Container>
  );
} 