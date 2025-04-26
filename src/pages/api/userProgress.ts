import { supabase } from '../../lib/supabaseClient';

export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProgress(userId: string, progress: any) {
  const { data, error } = await supabase
    .from('user_progress')
    .update(progress)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
} 