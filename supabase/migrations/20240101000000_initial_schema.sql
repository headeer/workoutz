-- Drop existing tables if they exist
DROP TABLE IF EXISTS exercise_sets CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS workout_sections CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;

-- Create workouts table
CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  day_trigger TEXT NOT NULL,
  user_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create sections table
CREATE TABLE workout_sections (
  id SERIAL PRIMARY KEY,
  workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create exercises table
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES workout_sections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets INTEGER,
  reps TEXT,
  duration TEXT,
  weight TEXT,
  video_url TEXT,
  notes TEXT,
  rest_time INTEGER,
  is_completed BOOLEAN DEFAULT FALSE,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create exercise_sets table
CREATE TABLE exercise_sets (
  id SERIAL PRIMARY KEY,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps TEXT,
  weight TEXT,
  rest_time INTEGER,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_progress table
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  completed_exercises INTEGER DEFAULT 0,
  completed_days INTEGER DEFAULT 0,
  completed_weeks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_workouts_user_name ON workouts(user_name);
CREATE INDEX idx_workout_sections_workout_id ON workout_sections(workout_id);
CREATE INDEX idx_exercises_section_id ON exercises(section_id);
CREATE INDEX idx_exercise_sets_exercise_id ON exercise_sets(exercise_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- Enable Row Level Security
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own workouts"
  ON workouts FOR SELECT
  USING (auth.uid()::text = user_name);

CREATE POLICY "Users can view their own sections"
  ON workout_sections FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = workout_sections.workout_id
    AND workouts.user_name = auth.uid()::text
  ));

CREATE POLICY "Users can view their own exercises"
  ON exercises FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workout_sections
    JOIN workouts ON workouts.id = workout_sections.workout_id
    WHERE workout_sections.id = exercises.section_id
    AND workouts.user_name = auth.uid()::text
  ));

CREATE POLICY "Users can view their own exercise sets"
  ON exercise_sets FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM exercises
    JOIN workout_sections ON workout_sections.id = exercises.section_id
    JOIN workouts ON workouts.id = workout_sections.workout_id
    WHERE exercises.id = exercise_sets.exercise_id
    AND workouts.user_name = auth.uid()::text
  ));

CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid()::text = user_id); 