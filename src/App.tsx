import React from 'react';
import { MantineProvider } from '@mantine/core';
import { WorkoutList } from './components/WorkoutList';
import { UserPoints } from './components/UserPoints';
import { supabase } from './lib/supabase';

function App() {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [points, setPoints] = React.useState(0);
  const [showConfetti, setShowConfetti] = React.useState(false);

  React.useEffect(() => {
    // Get the current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    if (userId) {
      // Fetch user points
      supabase
        .from('user_progress')
        .select('points')
        .eq('user_id', userId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching points:', error);
            return;
          }
          setPoints(data?.points ?? 0);
        });

      // Subscribe to points changes
      const subscription = supabase
        .channel('user_progress_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'user_progress',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            setPoints(payload.new.points);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userId]);

  const handleExerciseComplete = async (userId: string, pointsToAdd: number) => {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        points: points + pointsToAdd,
      });

    if (error) {
      console.error('Error updating points:', error);
    }
  };

  return (
    <MantineProvider>
      <div className="app">
        <UserPoints username={userId ?? 'Guest'} points={points} showConfetti={showConfetti} />
        <WorkoutList
          trainingId={1}
          workouts={[]}
          onExerciseComplete={handleExerciseComplete}
        />
      </div>
    </MantineProvider>
  );
}

export default App; 