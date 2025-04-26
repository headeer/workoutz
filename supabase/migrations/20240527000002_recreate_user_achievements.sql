-- Drop and recreate the user_achievements table with the correct structure
DROP TABLE IF EXISTS public.user_achievements;

CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    achievement_id TEXT NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- Add row level security policies
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own achievements" 
    ON public.user_achievements
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = 'admin@example.com'
    );

CREATE POLICY "Users can insert their own achievements" 
    ON public.user_achievements
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = 'admin@example.com'
    );

CREATE POLICY "Users can update their own achievements" 
    ON public.user_achievements
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = 'admin@example.com'
    );

CREATE POLICY "Users can delete their own achievements" 
    ON public.user_achievements
    FOR DELETE USING (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = 'admin@example.com'
    );

-- Seed initial achievements
INSERT INTO public.user_achievements (user_id, achievement_id)
VALUES
    -- Piotrek's achievements
    ('piotrek', 'first_exercise'),
    ('piotrek', 'first_workout'),
    ('piotrek', 'streak_3'),
    
    -- Tomasz's achievements
    ('tomasz', 'first_exercise'),
    ('tomasz', 'first_workout'); 