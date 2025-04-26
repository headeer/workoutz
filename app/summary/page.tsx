'use client';

import { Container, Title, Grid } from '@mantine/core';
import { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabaseClient';
import { TrainingSummary } from '../../src/components/TrainingSummary';
import { UserHeader } from '../../src/components/UserHeader';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useLanguage } from '../../src/lib/LanguageContext';

interface DatabaseUserProgress {
  user_id: string;
  points: number;
  completed_exercises: number;
  completed_days: number;
  completed_weeks: number;
  streak_days: number;
  total_workouts: number;
  level: number;
}

interface UserProgressData {
  points: number;
  completed_exercises: number;
  completed_days: number;
  completed_weeks: number;
  streak_days: number;
  total_workouts: number;
  level: number;
}

interface UserSummaryData {
  userProgress: UserProgressData;
  rewards: {
    current_level: number;
    points_to_next_level: number;
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      achieved: boolean;
    }>;
  };
  weeklyProgress: {
    completed_workouts: number;
    total_workouts: number;
    days: Array<{
      day: string;
      completed: boolean;
      planned: boolean;
    }>;
  };
}

const DEFAULT_USER_DATA = {
  userProgress: {
    points: 0,
    completed_exercises: 0,
    completed_days: 0,
    completed_weeks: 0,
    streak_days: 0,
    total_workouts: 0,
    level: 1
  },
  rewards: {
    current_level: 1,
    points_to_next_level: 1000,
    achievements: []
  },
  weeklyProgress: {
    completed_workouts: 0,
    total_workouts: 4,
    days: [
      { day: 'Mon', completed: false, planned: true },
      { day: 'Tue', completed: false, planned: false },
      { day: 'Wed', completed: false, planned: true },
      { day: 'Thu', completed: false, planned: false },
      { day: 'Fri', completed: false, planned: true },
      { day: 'Sat', completed: false, planned: false },
      { day: 'Sun', completed: false, planned: true }
    ]
  }
};

export default function Summary() {
  const [summaryData, setSummaryData] = useState<Record<string, UserSummaryData>>({
    tomasz: DEFAULT_USER_DATA,
    piotrek: DEFAULT_USER_DATA
  });
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .in('user_id', ['tomasz', 'piotrek']);

        if (progressError) throw progressError;

        // Fetch achievements
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('user_achievements')
          .select('*')
          .in('user_id', ['tomasz', 'piotrek']);

        if (achievementsError) throw achievementsError;

        // Update state with fetched data
        const newSummaryData = { ...summaryData };

        progressData?.forEach(progress => {
          const userId = progress.user_id;
          if (userId === 'tomasz' || userId === 'piotrek') {
            newSummaryData[userId] = {
              ...newSummaryData[userId],
              userProgress: {
                points: progress.points || 0,
                completed_exercises: progress.completed_exercises || 0,
                completed_days: progress.completed_days || 0,
                completed_weeks: progress.completed_weeks || 0,
                streak_days: progress.streak_days || 0,
                total_workouts: progress.total_workouts || 0,
                level: progress.level || 1
              },
              rewards: {
                ...newSummaryData[userId].rewards,
                current_level: progress.level || 1,
                points_to_next_level: 1000 - (progress.points % 1000)
              }
            };
          }
        });

        achievementsData?.forEach(achievement => {
          const userId = achievement.user_id;
          if (userId === 'tomasz' || userId === 'piotrek') {
            newSummaryData[userId].rewards.achievements.push({
              id: achievement.id,
              name: achievement.name,
              description: achievement.description,
              icon: achievement.icon,
              achieved: achievement.achieved
            });
          }
        });

        setSummaryData(newSummaryData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Subscribe to changes
    const userProgressSubscription = supabase
      .channel('user_progress_changes')
      .on<DatabaseUserProgress>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress'
        },
        (payload) => {
          if (!payload.new) return;
          const newProgress = payload.new as DatabaseUserProgress;
          if (newProgress.user_id === 'tomasz' || newProgress.user_id === 'piotrek') {
            setSummaryData(prev => ({
              ...prev,
              [newProgress.user_id]: {
                ...prev[newProgress.user_id],
                userProgress: {
                  points: newProgress.points || 0,
                  completed_exercises: newProgress.completed_exercises || 0,
                  completed_days: newProgress.completed_days || 0,
                  completed_weeks: newProgress.completed_weeks || 0,
                  streak_days: newProgress.streak_days || 0,
                  total_workouts: newProgress.total_workouts || 0,
                  level: newProgress.level || 1
                },
                rewards: {
                  ...prev[newProgress.user_id].rewards,
                  current_level: newProgress.level || 1,
                  points_to_next_level: 1000 - (newProgress.points % 1000)
                }
              }
            }));
          }
        }
      )
      .subscribe();

    return () => {
      userProgressSubscription.unsubscribe();
    };
  }, []);

  return (
    <Container size="xl">
      <Title ta="center" mb="xl">{t('stats.title')}</Title>
      
      <Grid>
        <Grid.Col span={12}>
          <UserHeader 
            name="Piotr"
            points={summaryData.piotrek.userProgress.points}
            level={summaryData.piotrek.userProgress.level}
            streakDays={summaryData.piotrek.userProgress.streak_days}
          />
          <TrainingSummary {...summaryData.piotrek} userId="piotrek" />
        </Grid.Col>

        <Grid.Col span={12} mt="xl">
          <UserHeader 
            name="Tomasz"
            points={summaryData.tomasz.userProgress.points}
            level={summaryData.tomasz.userProgress.level}
            streakDays={summaryData.tomasz.userProgress.streak_days}
          />
          <TrainingSummary {...summaryData.tomasz} userId="tomasz" />
        </Grid.Col>
      </Grid>
    </Container>
  );
} 