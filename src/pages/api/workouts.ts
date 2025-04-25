import { supabase } from '../../lib/supabase';

export async function getWorkouts(userName?: string) {
  let query = supabase.from('workouts').select(`
    *,
    sections (
      *,
      exercises (
        *,
        exercise_sets (*)
      )
    )
  `);

  if (userName) {
    query = query.eq('user_name', userName);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getWorkoutById(id: number) {
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      sections (
        *,
        exercises (
          *,
          exercise_sets (*)
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateExercise(exerciseId: number, updates: any) {
  const { data, error } = await supabase
    .from('exercises')
    .update(updates)
    .eq('id', exerciseId)
    .select()
    .single();

  if (error) throw error;
  return data;
} 