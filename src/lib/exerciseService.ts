import { supabase } from './supabaseClient';

interface ExerciseCompletionResult {
  success: boolean;
  points: number;
  achievements?: {
    id: string;
    name: string;
    description: string;
    icon: string;
  }[];
  error?: string;
}

export async function completeExercise(
  exerciseId: string,
  userId: string
): Promise<ExerciseCompletionResult> {
  try {
    // Update exercise completion status
    const { error: exerciseError } = await supabase
      .from('exercises')
      .update({ is_completed: true })
      .eq('id', exerciseId);

    if (exerciseError) throw exerciseError;

    // Get current user progress
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (progressError && progressError.code !== 'PGRST116') {
      throw progressError;
    }

    const basePoints = 10;
    let earnedPoints = basePoints;
    let streakBonus = 0;

    // Calculate streak bonus
    if (progressData?.streak_days && progressData.streak_days > 0) {
      streakBonus = Math.min(Math.floor(progressData.streak_days / 7) * 2, 10); // Max 10 bonus points
      earnedPoints += streakBonus;
    }

    // If no progress record exists, create one
    if (!progressData) {
      const { error: createError } = await supabase
        .from('user_progress')
        .insert([{
          user_id: userId,
          total_points: earnedPoints,
          completed_exercises: 1,
          completed_days: 1,
          completed_weeks: 0,
          streak_days: 1,
          total_workouts: 1,
          level: 1
        }]);

      if (createError) throw createError;

      return {
        success: true,
        points: earnedPoints,
        achievements: []
      };
    }

    // Update existing progress
    const newPoints = (progressData.total_points || 0) + earnedPoints;
    const newLevel = Math.floor(newPoints / 1000) + 1;
    const completedExercises = (progressData.completed_exercises || 0) + 1;

    const { error: updateError } = await supabase
      .from('user_progress')
      .update({
        total_points: newPoints,
        completed_exercises: completedExercises,
        level: newLevel
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Check for achievements
    const achievements = [];

    // Exercise milestones
    const exerciseMilestones = [10, 50, 100, 500];
    if (exerciseMilestones.includes(completedExercises)) {
      achievements.push({
        id: `exercises_${completedExercises}`,
        name: `Exercise Master ${completedExercises}`,
        description: `Completed ${completedExercises} exercises!`,
        icon: 'trophy'
      });
    }

    // Level up achievement
    if (newLevel > progressData.level) {
      achievements.push({
        id: `level_${newLevel}`,
        name: `Level ${newLevel} Achieved`,
        description: `Reached training level ${newLevel}!`,
        icon: 'star'
      });
    }

    // Save new achievements
    if (achievements.length > 0) {
      const { error: achievementError } = await supabase
        .from('user_achievements')
        .insert(
          achievements.map(achievement => ({
            user_id: userId,
            ...achievement,
            achieved: true,
            achieved_at: new Date().toISOString()
          }))
        );

      if (achievementError) throw achievementError;
    }

    return {
      success: true,
      points: earnedPoints,
      achievements
    };
  } catch (error) {
    console.error('Error completing exercise:', error);
    return {
      success: false,
      points: 0,
      error: error instanceof Error ? error.message : 'Failed to complete exercise'
    };
  }
}

export async function resetWorkout(workoutId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get all exercises for this workout
    const { data: sections, error: sectionsError } = await supabase
      .from('workout_sections')
      .select('id')
      .eq('workout_id', workoutId);

    if (sectionsError) throw sectionsError;

    if (!sections || sections.length === 0) {
      return { success: false, error: 'No sections found for this workout' };
    }

    const sectionIds = sections.map(section => section.id);

    // Reset completion status for all exercises in these sections
    const { error: resetError } = await supabase
      .from('exercises')
      .update({ is_completed: false })
      .in('section_id', sectionIds);

    if (resetError) throw resetError;

    return { success: true };
  } catch (error) {
    console.error('Error resetting workout:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reset workout'
    };
  }
} 