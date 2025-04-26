import { supabase } from '../supabaseClient';
import { transformWorkoutData } from './transformWorkoutData';

export async function loadWorkoutData() {
  try {
    // Fetch the JSON data
    const response = await fetch('/workouts.json');
    const jsonData = await response.json();
    
    // Transform the data
    const transformedData = transformWorkoutData(jsonData);
    
    // Load workouts
    for (const workout of transformedData) {
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .upsert({
          id: workout.id,
          name: workout.name,
          day_trigger: workout.day_trigger,
          user_name: workout.user_name
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Load sections
      if (!workout.workout_sections) continue;
      for (const section of workout.workout_sections) {
        const { data: sectionData, error: sectionError } = await supabase
          .from('workout_sections')
          .upsert({
            id: section.id,
            title: section.name,
            description: section.description,
            order_index: 0,
            workout_id: workout.id
          })
          .select()
          .single();

        if (sectionError) throw sectionError;

        // Load exercises
        for (const exercise of section.exercises ?? []) {
          const { data: exerciseData, error: exerciseError } = await supabase
            .from('exercises')
            .upsert({
              id: exercise.id,
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps,
              duration: exercise.duration,
              weight: exercise.weight,
              video_url: exercise.video_url,
              notes: exercise.notes,
              rest_time: exercise.rest_time,
              is_completed: exercise.is_completed,
              description: exercise.description,
              section_id: section.id
            })
            .select()
            .single();

          if (exerciseError) throw exerciseError;

          // Load exercise sets
          if (exercise.exercise_sets && exercise.exercise_sets.length > 0) {
            for (const set of exercise.exercise_sets) {
              const { error: setError } = await supabase
                .from('exercise_sets')
                .upsert({
                  id: set.id,
                  rest: set.rest_time ?? 0,
                  reps: set.reps,
                  weight: set.weight,
                  exercise_id: exercise.id
                });

              if (setError) throw setError;
            }
          }
        }
      }
    }

    console.log('Successfully loaded workout data into Supabase');
  } catch (error) {
    console.error('Error loading workout data:', error);
    throw error;
  }
} 