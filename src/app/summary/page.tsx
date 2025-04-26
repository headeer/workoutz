'use client';

import { Container, Title, Grid } from '@mantine/core';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { TrainingSummary } from '../../components/TrainingSummary';
import { UserHeader } from '../../components/UserHeader';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useLanguage } from '../../lib/LanguageContext';
import { resetTraining, resetDayTraining } from '../../lib/trainingService';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { ACHIEVEMENTS } from '../../lib/rewards';

interface DatabaseUserProgress {
  user_id: string;
  total_points: number;
  completed_exercises: number;
  completed_days: number;
  completed_weeks: number;
  streak_days: number;
  total_workouts: number;
  level: number;
}

interface UserProgressData {
  total_points: number;
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
    total_points: 0,
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
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetDayModalOpen, setResetDayModalOpen] = useState(false);
  const [userToReset, setUserToReset] = useState<string | null>(null);
  const [dayToReset, setDayToReset] = useState<string | null>(null);
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

        // Update state with user progress data
        const newSummaryData = { ...summaryData };

        progressData?.forEach(progress => {
          const userId = progress.user_id;
          if (userId === 'tomasz' || userId === 'piotrek') {
            newSummaryData[userId] = {
              ...newSummaryData[userId],
              userProgress: {
                total_points: progress.total_points || 0,
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
                points_to_next_level: 1000 - (progress.total_points % 1000)
              }
            };
          }
        });

        // Try to fetch achievements, but handle gracefully if table doesn't exist
        try {
          const { data: achievementsData, error: achievementsError } = await supabase
            .from('user_achievements')
            .select('*')
            .in('user_id', ['tomasz', 'piotrek']);

          if (!achievementsError && achievementsData) {
            achievementsData.forEach(achievement => {
              const userId = achievement.user_id;
              if (userId === 'tomasz' || userId === 'piotrek') {
                newSummaryData[userId].rewards.achievements.push({
                  id: achievement.achievement_id || achievement.id,
                  name: ACHIEVEMENTS.find((a: { id: string }) => a.id === achievement.achievement_id)?.name || 'Achievement',
                  description: ACHIEVEMENTS.find((a: { id: string }) => a.id === achievement.achievement_id)?.description || 'Keep up the good work!',
                  icon: achievement.icon || 'trophy',
                  achieved: achievement.achieved !== undefined ? achievement.achieved : true
                });
              }
            });
          }
        } catch (error) {
          console.error('Error fetching achievements:', error);
          // If achievements table doesn't exist, create dummy achievements
          ['tomasz', 'piotrek'].forEach(userId => {
            newSummaryData[userId].rewards.achievements = [
              {
                id: 'placeholder',
                name: 'First Workout',
                description: 'Complete your first workout',
                icon: 'trophy',
                achieved: true
              },
              {
                id: 'placeholder2',
                name: 'First Exercise',
                description: 'Complete your first exercise',
                icon: 'star',
                achieved: true
              }
            ];
          });
        }

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
                  total_points: newProgress.total_points || 0,
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
                  points_to_next_level: 1000 - (newProgress.total_points % 1000)
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

  const handleRestartTraining = (userId: string) => {
    setUserToReset(userId);
    setResetModalOpen(true);
  };

  const handleResetDay = (userId: string, day: string) => {
    setUserToReset(userId);
    setDayToReset(day);
    setResetDayModalOpen(true);
  };

  const confirmResetTraining = async () => {
    if (!userToReset) return;
    
    // Close the modal immediately to improve UX
    setResetModalOpen(false);
    
    // Call the reset function
    const { success } = await resetTraining(userToReset);
    
    // Clear the user to reset
    setUserToReset(null);
  };

  const confirmResetDay = async () => {
    if (!userToReset || !dayToReset) return;
    
    // Close the modal immediately to improve UX
    setResetDayModalOpen(false);
    
    // Call the reset day function
    const { success } = await resetDayTraining(userToReset, dayToReset);
    
    // If successful, we don't need to update state manually as the Supabase 
    // realtime subscription will update our data
    
    // Clear the user and day to reset
    setUserToReset(null);
    setDayToReset(null);
  };

  const cancelResetTraining = () => {
    setResetModalOpen(false);
    setUserToReset(null);
  };

  const cancelResetDay = () => {
    setResetDayModalOpen(false);
    setUserToReset(null);
    setDayToReset(null);
  };

  return (
    <Container size="xl">
      <Title ta="center" mb="xl">{t('stats.title')}</Title>
      
      <Grid>
        <Grid.Col span={12}>
          <UserHeader 
            name="Piotr"
            total_points={summaryData.piotrek.userProgress.total_points}
            level={summaryData.piotrek.userProgress.level}
            streakDays={summaryData.piotrek.userProgress.streak_days}
          />
          <TrainingSummary 
            {...summaryData.piotrek} 
            userId="piotrek" 
            onRestartTraining={() => handleRestartTraining('piotrek')}
            onResetDay={(day) => handleResetDay('piotrek', day)}
          />
        </Grid.Col>

        <Grid.Col span={12} mt="xl">
          <UserHeader 
            name="Tomasz"
            total_points={summaryData.tomasz.userProgress.total_points}
            level={summaryData.tomasz.userProgress.level}
            streakDays={summaryData.tomasz.userProgress.streak_days}
          />
          <TrainingSummary 
            {...summaryData.tomasz} 
            userId="tomasz" 
            onRestartTraining={() => handleRestartTraining('tomasz')}
            onResetDay={(day) => handleResetDay('tomasz', day)}
          />
        </Grid.Col>
      </Grid>

      <ConfirmationModal
        isOpen={resetModalOpen}
        title={t('workouts.resetWorkouts') || "Reset Workouts"}
        message={`Reset ${userToReset === 'piotrek' ? 'Piotr' : 'Tomasz'}'s workout completion progress? Points and level will be preserved.`}
        confirmText={t('workouts.resetWorkouts') || "Reset Workouts"}
        cancelText={t('common.cancel')}
        confirmColor="blue"
        onConfirm={confirmResetTraining}
        onCancel={cancelResetTraining}
      />
      
      <ConfirmationModal
        isOpen={resetDayModalOpen}
        title="Reset Day Workout"
        message={`Reset ${userToReset === 'piotrek' ? 'Piotr' : 'Tomasz'}'s workout for this day? This will allow you to redo the exercises without affecting points or achievements.`}
        confirmText="Reset Day"
        cancelText={t('common.cancel')}
        confirmColor="blue"
        onConfirm={confirmResetDay}
        onCancel={cancelResetDay}
      />
    </Container>
  );
} 