import { supabase } from '../../lib/supabase';

export async function getUserProgress(userName: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_name', userName)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProgress(userName: string, progress: any) {
  const { data, error } = await supabase
    .from('user_progress')
    .update(progress)
    .eq('user_name', userName)
    .select()
    .single();

  if (error) throw error;
  return data;
} 