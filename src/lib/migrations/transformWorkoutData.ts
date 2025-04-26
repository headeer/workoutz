import { WorkoutDay } from '../../types/workout';

export function transformWorkoutData(data: any): WorkoutDay[] {
  return data.workouts.map((workout: any) => ({
    id: workout.id,
    name: workout.name,
    day_trigger: workout.dayTrigger,
    user_name: workout.user,
    workout_sections: workout.sections.map((section: any) => ({
      id: section.id || Math.floor(Math.random() * 1000000), // Generate a random ID if not present
      title: section.title,
      description: section.description,
      order_index: section.order_index || 0,
      exercises: section.exercises.map((exercise: any) => ({
        id: exercise.id || Math.floor(Math.random() * 1000000), // Generate a random ID if not present
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        duration: exercise.duration,
        weight: exercise.weight,
        video_url: exercise.videoUrl,
        notes: exercise.notes,
        rest_time: exercise.restTime,
        is_completed: exercise.isCompleted || false,
        description: exercise.description,
        exercise_sets: exercise.sets ? exercise.sets.map((set: any, index: number) => ({
          id: set.id || Math.floor(Math.random() * 1000000), // Generate a random ID if not present
          rest: set.rest || exercise.restTime || 0,
          reps: set.reps || exercise.reps,
          weight: set.weight || exercise.weight,
          notes: set.notes || exercise.notes
        })) : []
      }))
    }))
  }));
} 