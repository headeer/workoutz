export interface ExerciseSet {
  id: number;
  exercise_id: number;
  set_number: number;
  reps?: number;
  weight?: number;
  duration?: number;
  rest_time?: number;
  is_completed: boolean;
}

export interface Exercise {
  id: number;
  section_id: number;
  name: string;
  description?: string;
  video_url?: string;
  sets?: number;
  reps?: string;
  duration?: string;
  weight?: string;
  notes?: string;
  rest_time?: number;
  is_completed: boolean;
  exercise_sets?: ExerciseSet[];
}

export interface WorkoutSection {
  id: number;
  workout_id: number;
  name: string;
  description?: string;
  exercises?: Exercise[];
}

export interface Workout {
  id: string;
  user_name: string;
  name: string;
  day_trigger: string;
  workout_sections?: WorkoutSection[];
}

export type WorkoutDay = Workout; 