-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    completed_exercises INTEGER DEFAULT 0,
    completed_workouts INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, achievement_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON user_achievements;

-- Create RLS policies for user_progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
    ON user_progress 
    FOR SELECT
    USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own progress"
    ON user_progress 
    FOR UPDATE
    USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can insert their own progress"
    ON user_progress 
    FOR INSERT
    WITH CHECK (user_id::text = auth.uid()::text);

-- Create RLS policies for user_achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
    ON user_achievements 
    FOR SELECT
    USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can insert their own achievements"
    ON user_achievements 
    FOR INSERT
    WITH CHECK (user_id::text = auth.uid()::text);

-- Function to update streak days
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_streak_days_trigger ON user_progress;

-- Create trigger for streak updates
CREATE TRIGGER update_streak_days_trigger
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_streak_days(); 