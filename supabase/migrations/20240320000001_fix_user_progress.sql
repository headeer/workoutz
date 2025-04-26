-- Add missing columns to user_progress table
ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS level integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_exercises integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_days integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_weeks integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS streak_days integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_workouts integer DEFAULT 0;

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);

-- Add constraint to ensure user_id is unique
ALTER TABLE user_progress
DROP CONSTRAINT IF EXISTS user_progress_user_id_key,
ADD CONSTRAINT user_progress_user_id_key UNIQUE (user_id);

-- Insert default record for piotrek if not exists
INSERT INTO user_progress (user_id, level, points, completed_exercises, completed_days, completed_weeks, streak_days, total_workouts)
VALUES ('piotrek', 1, 0, 0, 0, 0, 0, 0)
ON CONFLICT (user_id) DO NOTHING; 