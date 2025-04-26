-- Check if user_name column exists and rename it to user_id in workouts table
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'workouts' 
        AND column_name = 'user_name'
    ) THEN
        ALTER TABLE workouts 
        RENAME COLUMN user_name TO user_id;
    END IF;
END
$$;

-- Update RLS policies to use user_id instead of user_name
DROP POLICY IF EXISTS "Users can view their own workouts" ON workouts;
DROP POLICY IF EXISTS "Users can view their own sections" ON workout_sections;
DROP POLICY IF EXISTS "Users can view their own exercises" ON exercises;
DROP POLICY IF EXISTS "Users can view their own exercise sets" ON exercise_sets;

-- Create updated policies
CREATE POLICY "Users can view their own workouts"
  ON workouts FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own sections"
  ON workout_sections FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = workout_sections.workout_id
    AND workouts.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can view their own exercises"
  ON exercises FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workout_sections
    JOIN workouts ON workouts.id = workout_sections.workout_id
    WHERE workout_sections.id = exercises.section_id
    AND workouts.user_id = auth.uid()::text
  ));

CREATE POLICY "Users can view their own exercise sets"
  ON exercise_sets FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM exercises
    JOIN workout_sections ON workout_sections.id = exercises.section_id
    JOIN workouts ON workouts.id = workout_sections.workout_id
    WHERE exercises.id = exercise_sets.exercise_id
    AND workouts.user_id = auth.uid()::text
  ));

-- Update indexes
DROP INDEX IF EXISTS idx_workouts_user_name;
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id); 