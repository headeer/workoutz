import { supabase } from '@/lib/supabaseClient';

export interface Achievement {
  id: string;
  name: string;
  title: string;
  description: string;
  points: number;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  total_points: number;
  completed_exercises: number;
  completed_workouts: number;
  streak_days: number;
  level: number;
}

export const POINTS = {
  EXERCISE_COMPLETION: 10,
  WORKOUT_COMPLETION: 50,
  STREAK_MILESTONE: 100,
  ACHIEVEMENT_UNLOCK: 200,
  LEVEL_UP_BONUS: 500,
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_exercise',
    name: 'First Exercise',
    title: 'First Step',
    description: 'Complete your first exercise',
    points: 100,
    condition: (stats: UserStats) => stats.completed_exercises >= 1
  },
  {
    id: 'first_workout',
    name: 'First Workout',
    title: 'Workout Champion',
    description: 'Complete your first workout',
    points: 200,
    condition: (stats: UserStats) => stats.completed_workouts >= 1
  },
  {
    id: 'streak_3',
    name: 'Three Day Streak',
    title: 'Consistency is Key',
    description: 'Maintain a 3-day workout streak',
    points: 300,
    condition: (stats: UserStats) => stats.streak_days >= 3
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day workout streak',
    points: 500,
    condition: (stats: UserStats) => stats.streak_days >= 7
  },
  {
    id: 'level_5',
    name: 'Level 5',
    title: 'Rising Star',
    description: 'Reach level 5',
    points: 1000,
    condition: (stats: UserStats) => stats.level >= 5
  }
];

export const calculateLevel = (totalPoints: number): number => {
  return Math.floor(Math.sqrt(totalPoints / 100)) + 1;
};

export const pointsToNextLevel = (totalPoints: number): number => {
  const currentLevel = calculateLevel(totalPoints);
  const pointsNeeded = Math.pow(currentLevel, 2) * 100;
  return pointsNeeded - totalPoints;
};

export async function updateUserProgress(
  userId: string,
  type: 'exercise' | 'workout' | 'streak',
  stats: UserStats
): Promise<{ points: number; newAchievements: Achievement[] }> {
  let pointsEarned = 0;
  const newAchievements: Achievement[] = [];

  // Add points based on completion type
  switch (type) {
    case 'exercise':
      pointsEarned += POINTS.EXERCISE_COMPLETION;
      break;
    case 'workout':
      pointsEarned += POINTS.WORKOUT_COMPLETION;
      break;
    case 'streak':
      pointsEarned += POINTS.STREAK_MILESTONE;
      break;
  }

  // Check for new achievements
  const updatedStats = {
    ...stats,
    total_points: stats.total_points + pointsEarned,
  };

  const unlockedAchievements = await checkAchievements(userId, updatedStats);
  pointsEarned += unlockedAchievements.length * POINTS.ACHIEVEMENT_UNLOCK;
  newAchievements.push(...unlockedAchievements);

  // Update user progress in database
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      total_points: stats.total_points + pointsEarned,
      completed_exercises: type === 'exercise' ? stats.completed_exercises + 1 : stats.completed_exercises,
      completed_workouts: type === 'workout' ? stats.completed_workouts + 1 : stats.completed_workouts,
      streak_days: type === 'streak' ? stats.streak_days + 1 : stats.streak_days,
      level: calculateLevel(stats.total_points + pointsEarned),
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }

  return {
    points: pointsEarned,
    newAchievements,
  };
}

interface UserAchievement {
  achievement_id: string;
}

export const checkAchievements = async (userId: string, stats: UserStats): Promise<Achievement[]> => {
  const { data: existingAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  const existingIds = new Set(existingAchievements?.map((a: UserAchievement) => a.achievement_id) || []);
  
  const newAchievements = ACHIEVEMENTS.filter(achievement => 
    !existingIds.has(achievement.id) && achievement.condition(stats)
  );

  if (newAchievements.length > 0) {
    await Promise.all(newAchievements.map(achievement => 
      supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievement.id
        })
    ));
  }

  return newAchievements;
};

export async function getUserProgress(userId: string) {
  const { data: progress, error: progressError } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (progressError) {
    console.error('Error fetching user progress:', progressError);
    throw progressError;
  }

  const { data: achievements, error: achievementsError } = await supabase
    .from('user_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', userId);

  if (achievementsError) {
    console.error('Error fetching user achievements:', achievementsError);
    throw achievementsError;
  }

  const achievedIds = new Set(achievements?.map(a => a.achievement_id) || []);
  const allAchievements = ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    achieved: achievedIds.has(achievement.id),
    unlockedAt: achievements?.find(a => a.achievement_id === achievement.id)?.unlocked_at,
  }));

  return {
    ...progress,
    achievements: allAchievements,
    level: calculateLevel(progress.total_points),
    pointsToNextLevel: pointsToNextLevel(progress.total_points),
  };
} 