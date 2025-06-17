
-- Add 'visitor' role to the existing profiles table
-- First check if visitor role already exists, if not we'll handle it in the constraint
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('coach', 'player', 'visitor'));

-- Update the UserRole type to include visitor
COMMENT ON COLUMN public.profiles.role IS 'User role: coach, player, or visitor';
