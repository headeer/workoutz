-- Seed initial achievements for Piotrek and Tomasz
INSERT INTO public.user_achievements (user_id, achievement_id)
VALUES
    -- Piotrek's achievements
    ('piotrek', 'first_exercise'),
    ('piotrek', 'first_workout'),
    ('piotrek', 'streak_3'),
    
    -- Tomasz's achievements
    ('tomasz', 'first_exercise'),
    ('tomasz', 'first_workout')
ON CONFLICT (user_id, achievement_id) DO NOTHING; 