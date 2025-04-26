import { supabase } from './supabaseClient';
import { ACHIEVEMENTS, POINTS, calculateLevel, pointsToNextLevel } from './rewards';

interface ProgressUpdate {
  exerciseCompleted?: boolean;
  workoutCompleted?: boolean;
  streakUpdated?: boolean;
}

export interface WorkoutStats {
  lastWorkoutDate: string | null;
  weeklyWorkouts: number;
  monthlyWorkouts: number;
  preferredDays: string[];
  averageExercisesPerWorkout: number;
  favoriteExercises: string[];
  personalBests: {
    exercise: string;
    weight?: number;
    reps?: number;
    date: string;
  }[];
}

export interface MotivationalTip {
  type: 'encouragement' | 'milestone' | 'streak' | 'recovery' | 'challenge';
  message: string;
  action?: string;
}

export const getMotivationalTip = (stats: WorkoutStats): MotivationalTip[] => {
  const tips: MotivationalTip[] = [];
  const today = new Date();
  const lastWorkout = stats.lastWorkoutDate ? new Date(stats.lastWorkoutDate) : null;
  const daysSinceLastWorkout = lastWorkout 
    ? Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Streak-based tips
  if (daysSinceLastWorkout === null) {
    tips.push({
      type: 'encouragement',
      message: "Ready to start your fitness journey? The first step is always the most important!",
      action: "Schedule your first workout today"
    });
  } else if (daysSinceLastWorkout === 0) {
    tips.push({
      type: 'encouragement',
      message: "Great work on your workout today! Keep this momentum going!",
      action: "Plan your next session"
    });
  } else if (daysSinceLastWorkout === 1) {
    tips.push({
      type: 'recovery',
      message: "Yesterday's workout was great! Today might be a good recovery day.",
      action: "Focus on stretching and mobility"
    });
  } else if (daysSinceLastWorkout > 3) {
    tips.push({
      type: 'challenge',
      message: "It's been a few days since your last workout. Let's get back on track!",
      action: "Start with a light workout today"
    });
  }

  // Progress-based tips
  if (stats.weeklyWorkouts >= 3) {
    tips.push({
      type: 'milestone',
      message: "You're crushing it! 3+ workouts this week shows real dedication.",
      action: "Try increasing weights or reps"
    });
  }

  // Personal bests
  if (stats.personalBests.length > 0) {
    const latestPB = stats.personalBests[stats.personalBests.length - 1];
    tips.push({
      type: 'milestone',
      message: `New personal best in ${latestPB.exercise}! Your hard work is paying off.`,
      action: "Set a new goal for next week"
    });
  }

  return tips;
};

export const updateProgress = async (
  userId: string,
  update: ProgressUpdate
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get current progress
    const { data: currentProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (progressError) throw progressError;

    // Calculate updates
    const updates = {
      points: currentProgress.points,
      completed_exercises: currentProgress.completed_exercises,
      completed_days: currentProgress.completed_days,
      completed_weeks: currentProgress.completed_weeks,
      streak_days: currentProgress.streak_days,
      total_workouts: currentProgress.total_workouts,
      updated_at: new Date().toISOString()
    };

    if (update.exerciseCompleted) {
      updates.points += POINTS.EXERCISE_COMPLETION;
      updates.completed_exercises += 1;
    }

    if (update.workoutCompleted) {
      updates.points += POINTS.WORKOUT_COMPLETION;
      updates.completed_days += 1;
      updates.total_workouts += 1;
      
      // Check if we completed a week
      if (updates.completed_days % 7 === 0) {
        updates.completed_weeks += 1;
        updates.points += POINTS.STREAK_MILESTONE;
      }
    }

    if (update.streakUpdated) {
      updates.streak_days += 1;
      if (updates.streak_days % 7 === 0) {
        updates.points += POINTS.STREAK_MILESTONE;
      }
    }

    // Update level based on points
    const newLevel = calculateLevel(updates.points);
    if (newLevel > currentProgress.level) {
      updates.points += POINTS.LEVEL_UP_BONUS;
    }

    // Update progress in database
    const { error: updateError } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Check and award achievements
    const { data: currentAchievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    if (achievementsError) throw achievementsError;

    const existingAchievements = new Set(currentAchievements?.map(a => a.achievement_id) || []);
    const newAchievements = ACHIEVEMENTS.filter(achievement => 
      !existingAchievements.has(achievement.id) && 
      achievement.condition({
        points: updates.points,
        completed_exercises: updates.completed_exercises,
        completed_workouts: updates.total_workouts,
        streak_days: updates.streak_days,
        level: newLevel
      })
    );

    if (newAchievements.length > 0) {
      await Promise.all(newAchievements.map(achievement => 
        supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
            name: achievement.name,
            description: achievement.description
          })
      ));

      updates.points += newAchievements.length * POINTS.ACHIEVEMENT_UNLOCK;
    }

    return {
      success: true,
      message: `Progress updated successfully! ${newAchievements.length > 0 
        ? `Unlocked ${newAchievements.length} new achievement(s)!` 
        : ''}`
    };

  } catch (error) {
    console.error('Error updating progress:', error);
    return {
      success: false,
      message: 'Failed to update progress'
    };
  }
}; 