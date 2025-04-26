-- Add user_id column to exercises table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'exercises' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE exercises ADD COLUMN user_id TEXT;
        
        -- Update the user_id based on workout sections and workouts
        UPDATE exercises e
        SET user_id = w.user_id
        FROM workout_sections s
        JOIN workouts w ON s.workout_id = w.id
        WHERE e.section_id = s.id;
    END IF;
END $$; 