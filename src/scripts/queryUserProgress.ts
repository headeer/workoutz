import { supabase } from '../lib/supabaseClient';

async function queryUserProgress() {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*');

    if (error) {
      console.error('Error querying user_progress:', error);
      return;
    }

    console.log('User Progress Data:');
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Execute the query
queryUserProgress(); 