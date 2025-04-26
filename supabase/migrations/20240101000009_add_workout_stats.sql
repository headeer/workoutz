-- Create workout_stats table
CREATE TABLE IF NOT EXISTS workout_stats (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    last_workout_date TIMESTAMP WITH TIME ZONE,
    weekly_workouts INTEGER DEFAULT 0,
    monthly_workouts INTEGER DEFAULT 0,
    preferred_days TEXT[] DEFAULT ARRAY[]::TEXT[],
    average_exercises_per_workout FLOAT DEFAULT 0,
    favorite_exercises TEXT[] DEFAULT ARRAY[]::TEXT[],
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);

-- Create personal_bests table
CREATE TABLE IF NOT EXISTS personal_bests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    weight FLOAT,
    reps INTEGER,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workout_stats_user_id ON workout_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_bests_user_id ON personal_bests(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_bests_exercise_id ON personal_bests(exercise_id);

-- Enable RLS
ALTER TABLE workout_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_bests ENABLE ROW LEVEL SECURITY;

-- Create policies for workout_stats
CREATE POLICY "Users can view their own workout stats"
    ON workout_stats
    FOR SELECT
    USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own workout stats"
    ON workout_stats
    FOR UPDATE
    USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can insert their own workout stats"
    ON workout_stats
    FOR INSERT
    WITH CHECK (user_id::text = auth.uid()::text);

-- Create policies for personal_bests
CREATE POLICY "Users can view their own personal bests"
    ON personal_bests
    FOR SELECT
    USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can insert their own personal bests"
    ON personal_bests
    FOR INSERT
    WITH CHECK (user_id::text = auth.uid()::text);

-- Function to update workout stats
CREATE OR REPLACE FUNCTION update_workout_stats()
RETURNS TRIGGER AS $$
DECLARE
    exercise_count INTEGER;
    favorite_count INTEGER := 3;
BEGIN
    -- Update last workout date
    NEW.last_workout_date := CURRENT_TIMESTAMP;
    
    -- Calculate weekly workouts (last 7 days)
    SELECT COUNT(DISTINCT DATE(created_at))
    INTO NEW.weekly_workouts
    FROM exercises e
    WHERE e.user_id = NEW.user_id
    AND e.created_at >= CURRENT_DATE - INTERVAL '7 days'
    AND e.is_completed = true;
    
    -- Calculate monthly workouts (last 30 days)
    SELECT COUNT(DISTINCT DATE(created_at))
    INTO NEW.monthly_workouts
    FROM exercises e
    WHERE e.user_id = NEW.user_id
    AND e.created_at >= CURRENT_DATE - INTERVAL '30 days'
    AND e.is_completed = true;
    
    -- Calculate average exercises per workout
    SELECT COUNT(*) / NULLIF(COUNT(DISTINCT DATE(created_at)), 0)
    INTO NEW.average_exercises_per_workout
    FROM exercises e
    WHERE e.user_id = NEW.user_id
    AND e.is_completed = true;
    
    -- Update favorite exercises (most completed)
    NEW.favorite_exercises := ARRAY(
        SELECT name
        FROM exercises e
        WHERE e.user_id = NEW.user_id
        AND e.is_completed = true
        GROUP BY name
        ORDER BY COUNT(*) DESC
        LIMIT favorite_count
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for workout stats updates
CREATE TRIGGER update_workout_stats_trigger
    BEFORE UPDATE ON workout_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_workout_stats(); 