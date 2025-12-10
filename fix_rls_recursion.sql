-- Fix Infinite Recursion in Profiles RLS Policies
-- This script fixes the "infinite recursion detected in policy for relation 'profiles'" error
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Navigate to SQL Editor → New query
-- 4. Copy and paste this entire file into the editor
-- 5. Run the query
-- 6. Test your application - the profile loading should now work

-- Step 1: Drop all existing policies on the profiles table
-- This removes the problematic recursive policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON profiles;
DROP POLICY IF EXISTS "Teachers can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Teachers can update all profiles" ON profiles;

-- Step 2: Create new non-recursive policies
-- These policies use auth.uid() directly without querying the profiles table

-- Policy 1: Users can view their own profile
-- Uses auth.uid() directly - no recursion
CREATE POLICY "users_view_own_profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Users can insert their own profile
-- Only allows inserting a profile with their own user ID
CREATE POLICY "users_insert_own_profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy 3: Users can update their own profile
-- Only allows updating their own profile
CREATE POLICY "users_update_own_profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Step 3: Create a security definer function for admin access
-- This function checks user metadata for admin role without querying profiles
-- This avoids recursion by using auth.jwt() instead of querying the profiles table
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Check if user has 'teacher' role in their JWT metadata
  -- This avoids querying the profiles table
  RETURN (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'teacher'
    OR
    (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role' = 'teacher'
  );
END;
$$;

-- Step 4: Optional - Create policies for admin/teacher access
-- These use the security definer function which doesn't query profiles
-- Uncomment if you need teachers to view/update all profiles

-- Teachers can view all profiles (using security definer function)
CREATE POLICY "teachers_view_all_profiles"
ON profiles
FOR SELECT
TO authenticated
USING (is_admin_user());

-- Teachers can update all profiles (using security definer function)
CREATE POLICY "teachers_update_all_profiles"
ON profiles
FOR UPDATE
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- Alternative approach if the above doesn't work:
-- If you need to check the role from the profiles table for admin access,
-- you can use a security definer function that bypasses RLS:

-- CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
-- RETURNS text
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- STABLE
-- AS $$
-- DECLARE
--   user_role text;
-- BEGIN
--   -- This function runs with SECURITY DEFINER, so it bypasses RLS
--   SELECT role INTO user_role
--   FROM profiles
--   WHERE id = user_id;
--   RETURN user_role;
-- END;
-- $$;

-- Then use it in policies:
-- CREATE POLICY "teachers_view_all_profiles"
-- ON profiles
-- FOR SELECT
-- TO authenticated
-- USING (get_user_role(auth.uid()) = 'teacher');

-- Verification query (run this after applying the fix):
-- SELECT 
--   schemaname,
--   tablename,
--   policyname,
--   permissive,
--   roles,
--   cmd,
--   qual
-- FROM pg_policies
-- WHERE tablename = 'profiles'
-- ORDER BY policyname;

