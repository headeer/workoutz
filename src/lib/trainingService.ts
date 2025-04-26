import { supabase } from './supabaseClient';
import { notifications } from '@mantine/notifications';

/**
 * Reset all training progress for a specific user
 * This resets all exercises to incomplete, resets completion counts and streaks but preserves points
 * @param userId The user's ID (e.g., 'piotrek', 'tomasz')
 * @returns Promise with success status and message
 */
export async function resetTraining(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get all workout sections for this user
    const { data: workouts, error: workoutsError } = await supabase
      .from('workouts')
      .select('id')
      .eq('user_id', userId);

    if (workoutsError) throw workoutsError;
    
    if (!workouts || workouts.length === 0) {
      throw new Error(`No workouts found for user: ${userId}`);
    }
    
    // Get all sections for these workouts
    const workoutIds = workouts.map(w => w.id);
    const { data: sections, error: sectionsError } = await supabase
      .from('workout_sections')
      .select('id')
      .in('workout_id', workoutIds);

    if (sectionsError) throw sectionsError;
    
    if (!sections || sections.length === 0) {
      throw new Error('No workout sections found');
    }
    
    const sectionIds = sections.map(section => section.id);
    
    // 1. Reset all exercises to incomplete
    const { error: exercisesError } = await supabase
      .from('exercises')
      .update({ is_completed: false })
      .in('section_id', sectionIds);

    if (exercisesError) throw exercisesError;

    // 2. Get current user progress to preserve points
    const { data: currentProgress, error: fetchError } = await supabase
      .from('user_progress')
      .select('total_points, level')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
    
    const preservedPoints = currentProgress?.total_points || 0;
    const preservedLevel = currentProgress?.level || 1;

    // 3. Reset workout completion stats but preserve points and level
    const { error: progressError } = await supabase
      .from('user_progress')
      .update({
        completed_exercises: 0,
        completed_days: 0,
        completed_weeks: 0,
        streak_days: 0,
        total_workouts: 0,
        total_points: preservedPoints,
        level: preservedLevel
      })
      .eq('user_id', userId);

    if (progressError) throw progressError;

    // 4. Clear browser cache for this user's workout data
    // Remove any localStorage keys related to workouts
    if (typeof window !== 'undefined') {
      // Clear localStorage cache if it exists
      Object.keys(localStorage).forEach(key => {
        if (key.includes('workout') || key.includes('exercise') || key.includes(userId)) {
          localStorage.removeItem(key);
        }
      });

      // Add a reset timestamp to localStorage to force reload if needed
      localStorage.setItem(`workout_reset_${userId}`, Date.now().toString());
    }

    // 5. Show success notification with reload option
    notifications.show({
      title: 'Workouts Reset',
      message: 'Your workout progress has been reset successfully. Points have been preserved.',
      color: 'blue',
      autoClose: false,
      withCloseButton: true,
      styles: { root: { maxWidth: '400px' } },
      loading: false
    });

    return {
      success: true,
      message: 'Workout progress has been reset successfully. Points have been preserved. Please reload the page to see changes.'
    };
  } catch (error) {
    console.error('Error resetting training:', error);
    
    // Show error notification
    notifications.show({
      title: 'Reset Failed',
      message: error instanceof Error ? error.message : 'Failed to reset workouts',
      color: 'red',
    });
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to reset workouts'
    };
  }
}

/**
 * Reset a single day's training exercises for a user without affecting points or achievements
 * @param userId The user's ID (e.g., 'piotrek', 'tomasz')
 * @param dayName The day to reset (e.g., 'day1', 'day2')
 * @returns Promise with success status and message
 */
export async function resetDayTraining(userId: string, dayName: string): Promise<{ success: boolean; message: string }> {
  try {
    // Extract numeric day from dayName (e.g., 'day1' -> '1')
    const dayNumber = dayName.replace('day', '');
    
    // Find workout sections for this day
    const { data: workouts, error: workoutsError } = await supabase
      .from('workouts')
      .select('id')
      .eq('user_id', userId === 'piotrek' ? 'piotr' : 'tomasz')
      .eq('day_trigger', dayNumber);

    if (workoutsError) throw workoutsError;
    
    if (!workouts || workouts.length === 0) {
      return { success: false, message: `No workouts found for day: ${dayName}` };
    }

    // Get all sections for these workouts
    const workoutIds = workouts.map(w => w.id);
    const { data: sections, error: sectionsError } = await supabase
      .from('workout_sections')
      .select('id')
      .in('workout_id', workoutIds);

    if (sectionsError) throw sectionsError;

    if (!sections || sections.length === 0) {
      return { success: false, message: 'No sections found for this workout' };
    }

    const sectionIds = sections.map(section => section.id);

    // Reset only exercises from this day/workout
    const { error: resetError } = await supabase
      .from('exercises')
      .update({ is_completed: false })
      .in('section_id', sectionIds);

    if (resetError) throw resetError;

    // Show success notification
    notifications.show({
      title: 'Day Reset',
      message: `Workout for day ${dayNumber} has been reset successfully`,
      color: 'blue',
    });

    return {
      success: true,
      message: `Day ${dayNumber} progress has been reset successfully`
    };
  } catch (error) {
    console.error('Error resetting day training:', error);
    
    // Show error notification
    notifications.show({
      title: 'Day Reset Failed',
      message: error instanceof Error ? error.message : 'Failed to reset day training',
      color: 'red',
    });
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to reset day training'
    };
  }
} 