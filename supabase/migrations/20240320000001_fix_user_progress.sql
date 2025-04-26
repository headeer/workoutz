-- Add missing columns to user_progress table using a safer approach
DO $$
BEGIN
    -- Add level column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'level') THEN
        ALTER TABLE user_progress ADD COLUMN level integer DEFAULT 1;
    END IF;
    
    -- Check for either points or total_points column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'total_points') AND
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'points') THEN
        ALTER TABLE user_progress ADD COLUMN total_points integer DEFAULT 0;
    END IF;
    
    -- Add other columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'completed_exercises') THEN
        ALTER TABLE user_progress ADD COLUMN completed_exercises integer DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'completed_days') THEN
        ALTER TABLE user_progress ADD COLUMN completed_days integer DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'completed_weeks') THEN
        ALTER TABLE user_progress ADD COLUMN completed_weeks integer DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'streak_days') THEN
        ALTER TABLE user_progress ADD COLUMN streak_days integer DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'total_workouts') THEN
        ALTER TABLE user_progress ADD COLUMN total_workouts integer DEFAULT 0;
    END IF;
END $$;

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);

-- Add constraint to ensure user_id is unique
ALTER TABLE user_progress
DROP CONSTRAINT IF EXISTS user_progress_user_id_key,
ADD CONSTRAINT user_progress_user_id_key UNIQUE (user_id);

-- Insert default record for piotrek if not exists
INSERT INTO user_progress (user_id, level, total_points, completed_exercises, completed_days, completed_weeks, streak_days, total_workouts)
VALUES ('piotrek', 1, 0, 0, 0, 0, 0, 0)
ON CONFLICT (user_id) DO NOTHING; 