-- Fix user_achievements table to use TEXT instead of UUID for user_id
ALTER TABLE IF EXISTS public.user_achievements
ALTER COLUMN user_id TYPE TEXT; 