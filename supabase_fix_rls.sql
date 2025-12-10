-- ============================================
-- Fix RLS Policy for Profiles Table
-- ============================================
-- This SQL script fixes the Row Level Security issue
-- that prevents profile creation during user signup.
--
-- Run this in your Supabase SQL Editor:
-- 1. Go to https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to SQL Editor
-- 4. Paste and run this script
-- ============================================

-- Option 1: Add INSERT policy to allow users to create their own profile
-- This is the recommended approach for most use cases
-- ============================================

-- First, check if the policy already exists and drop it if needed
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create a policy that allows users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ============================================
-- Option 2: Use a Database Trigger (Alternative)
-- This automatically creates a profile when a user signs up
-- ============================================

-- Create a function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, name, phone, company)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'company'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that fires after a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Notes:
-- ============================================
-- Option 1 (RLS Policy): 
--   - Allows users to create their own profile via the application
--   - More flexible, allows custom profile creation logic in your app
--   - Recommended if you want to handle profile creation in your code
--
-- Option 2 (Database Trigger):
--   - Automatically creates profile when user signs up
--   - Runs with SECURITY DEFINER, so it bypasses RLS
--   - More automatic, but less flexible
--   - Recommended if you want automatic profile creation
--
-- You can use BOTH options together, but Option 2 (trigger) is usually sufficient
-- If you use Option 2, you can remove the profile creation code from AuthContext.tsx
-- ============================================

