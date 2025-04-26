-- Add totalPoints column to user_progress table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'user_progress'
        AND column_name = 'total_points'
    ) THEN
        ALTER TABLE user_progress
        ADD COLUMN total_points INTEGER DEFAULT 0 NOT NULL;
        
        -- Add comment to the column
        COMMENT ON COLUMN user_progress.total_points IS 'The total points accumulated by the user';
    END IF;
END
$$;
