-- Check if points column exists and rename it to total_points in user_progress table
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_progress' 
        AND column_name = 'points'
    ) THEN
        ALTER TABLE user_progress 
        RENAME COLUMN points TO total_points;
    END IF;
END
$$;

-- Update any views or functions that rely on the points column name
-- Recreate the update_streak_days function to reference total_points instead of points
DROP FUNCTION IF EXISTS update_streak_days() CASCADE;

CREATE OR REPLACE FUNCTION update_streak_days()
RETURNS TRIGGER AS $$
BEGIN
    -- If it's been more than 48 hours since the last update, reset streak
    IF OLD.updated_at < NOW() - INTERVAL '48 hours' THEN
        NEW.streak_days := 1;
    -- If it's been between 20 and 48 hours, increment streak
    ELSIF OLD.updated_at < NOW() - INTERVAL '20 hours' THEN
        NEW.streak_days := OLD.streak_days + 1;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger for streak updates
CREATE TRIGGER update_streak_days_trigger
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_streak_days(); 