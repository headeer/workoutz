export interface ExerciseSetInfo {
  description?: string;
  reps?: string;
  rest?: number;
}

export interface ExerciseSet {
  name: string;
  sets?: number | ExerciseSetInfo[];
  reps?: string;
  duration?: string;
  notes?: string;
  description?: string;
  videoUrl?: string;
  isCompleted?: boolean;
  restTime?: number;
}

export interface WorkoutSection {
  title: string;
  description?: string;
  exercises: ExerciseSet[];
}

export interface WorkoutDay {
  id: string;
  name: string;
  day_trigger: string;
  user_name: string;
  workout_sections: WorkoutSection[];
}

export interface Progress {
  id: number;
  date: string;
  exerciseName: string;
  weight?: number;
  reps?: number;
  duration?: string;
  notes: string;
} 