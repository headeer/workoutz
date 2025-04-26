-- Create user_achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    name TEXT,
    description TEXT,
    icon TEXT DEFAULT 'trophy',
    achieved BOOLEAN DEFAULT TRUE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);

-- Add row level security policies
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
    -- Check and create SELECT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_achievements' 
        AND policyname = 'Users can view their own achievements'
    ) THEN
        CREATE POLICY "Users can view their own achievements" 
        ON public.user_achievements
        FOR SELECT USING (
            auth.uid() = user_id OR 
            auth.jwt() ->> 'email' = 'admin@example.com'
        );
    END IF;

    -- Check and create INSERT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_achievements' 
        AND policyname = 'Users can insert their own achievements'
    ) THEN
        CREATE POLICY "Users can insert their own achievements" 
        ON public.user_achievements
        FOR INSERT WITH CHECK (
            auth.uid() = user_id OR 
            auth.jwt() ->> 'email' = 'admin@example.com'
        );
    END IF;

    -- Check and create UPDATE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_achievements' 
        AND policyname = 'Users can update their own achievements'
    ) THEN
        CREATE POLICY "Users can update their own achievements" 
        ON public.user_achievements
        FOR UPDATE USING (
            auth.uid() = user_id OR 
            auth.jwt() ->> 'email' = 'admin@example.com'
        );
    END IF;

    -- Check and create DELETE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_achievements' 
        AND policyname = 'Users can delete their own achievements'
    ) THEN
        CREATE POLICY "Users can delete their own achievements" 
        ON public.user_achievements
        FOR DELETE USING (
            auth.uid() = user_id OR 
            auth.jwt() ->> 'email' = 'admin@example.com'
        );
    END IF;
END
$$;

-- Add comment to table
COMMENT ON TABLE public.user_achievements IS 'Stores user achievement data'; 