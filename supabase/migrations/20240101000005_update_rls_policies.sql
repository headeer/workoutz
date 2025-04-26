-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own workouts" ON workouts;
DROP POLICY IF EXISTS "Users can view their own sections" ON workout_sections;
DROP POLICY IF EXISTS "Users can view their own exercises" ON exercises;
DROP POLICY IF EXISTS "Users can view their own exercise sets" ON exercise_sets;

-- Create new public access policies
CREATE POLICY "Public can view workouts" ON workouts FOR SELECT USING (true);
CREATE POLICY "Public can view sections" ON workout_sections FOR SELECT USING (true);
CREATE POLICY "Public can view exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "Public can view exercise sets" ON exercise_sets FOR SELECT USING (true); 