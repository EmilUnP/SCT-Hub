# Supabase Integration Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vinbdgvmijczcunvkjde.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_3XpWDm7VwOHAkjfZKpIaEw_FE-z88jJ
```

**Important**: The `.env.local` file is gitignored and should not be committed to version control.

## Database Schema

The following database schema has been set up in your Supabase project:

### Profiles Table
- Stores user profile information
- Linked to Supabase Auth users via UUID
- Row Level Security (RLS) enabled
- Users can only access their own profile data

### Features Implemented

✅ **Authentication**
- Email/password registration
- Email/password login
- Session management
- Automatic profile creation on signup

✅ **User Profiles**
- Name, email, phone, company fields
- Role-based access (teacher, staff, student)
- Automatic profile loading on authentication

✅ **Security**
- Row Level Security policies
- Secure password handling
- Session-based authentication

## Testing the Integration

1. **Register a new user**:
   - Navigate to `/register`
   - Fill in the registration form
   - Submit to create an account
   - You'll be redirected to login

2. **Login**:
   - Navigate to `/login`
   - Use the email and password from registration
   - You'll be redirected to `/profile` on success

3. **Check your profile**:
   - After login, your profile data is loaded from Supabase
   - User information is displayed in the profile page

## Troubleshooting

### "Missing Supabase environment variables" error
- Ensure `.env.local` exists in the root directory
- Verify the environment variables are correctly set
- Restart your development server after creating/updating `.env.local`

### Authentication not working
- Check browser console for errors
- Verify Supabase project is active
- Ensure database migrations have been applied

### Profile not loading
- Check if the `profiles` table exists in your Supabase dashboard
- Verify RLS policies are correctly set up
- Check browser console for database errors

### "infinite recursion detected in policy for relation 'profiles'" error
This error (PostgreSQL error code `42P17`) occurs when RLS policies create a circular dependency. This typically happens when a policy on the `profiles` table queries the `profiles` table itself.

**Symptoms:**
- Console shows: `Error loading profile: {code: '42P17', message: 'infinite recursion detected in policy for relation "profiles"'}`
- Profile data fails to load after login
- 500 Internal Server Error when querying profiles

**Solution**: Run the SQL script provided in `fix_rls_recursion.sql`:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** → **New query**
4. Open the file `fix_rls_recursion.sql` in your project root
5. Copy and paste the entire SQL script into the editor
6. Click **Run** to execute the script
7. The script will:
   - Drop all existing problematic policies
   - Create new non-recursive policies that use `auth.uid()` directly
   - Add optional admin access policies using security definer functions
8. Test your application - profile loading should now work

**What the fix does:**
- Removes policies that query the `profiles` table (which causes recursion)
- Creates simple policies that only use `auth.uid()` to check if the user is accessing their own profile
- Uses security definer functions for admin access to avoid recursion

**Note**: After applying this fix, users can only view/update their own profiles. If you need admin users (teachers) to access all profiles, the script includes optional policies for that.

### "new row violates row-level security policy" error
This error occurs when trying to create a profile during user registration. The RLS policy is blocking the insert operation.

**Solution**: Run the SQL script provided in `supabase_fix_rls.sql`:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** → **New query**
4. Open the file `supabase_fix_rls.sql` in your project root
5. Copy and paste the SQL into the editor
6. **Choose one of the two options**:
   - **Option 1 (Recommended)**: Add an RLS policy that allows users to insert their own profile
   - **Option 2**: Use a database trigger to automatically create profiles (more automatic)
7. Run the selected option
8. The profile creation should now work during registration

**Note**: If you choose Option 2 (database trigger), profiles will be created automatically and you can remove the profile creation code from your application.

### "Email address is invalid" error
This error occurs when Supabase rejects an email address that appears valid. Common causes:

1. **Email Domain Restrictions**: Supabase may have domain restrictions configured
   - Go to your Supabase Dashboard: https://supabase.com/dashboard
   - Select your project
   - Navigate to **Authentication** → **Settings** (or **Providers** → **Email**)
   - Look for **"Email Domain Restrictions"** or **"Allowed Email Domains"** settings
   - If you see domain restrictions, you have two options:
     - **Option A**: Add your domain (e.g., `mail.ru`) to the allowed list
     - **Option B**: Remove domain restrictions entirely (for development/testing)
   - **Note**: Some Supabase projects may have email validation rules that block certain domains by default

2. **Disposable Email Blocking**: Some email providers may be blocked
   - Check Authentication → Settings → **"Email Templates"** or **"Email Auth"**
   - Look for any email validation or blocking rules
   - Disable disposable email blocking if needed for testing

3. **Quick Solution for Testing**: 
   - Use a Gmail, Outlook, or other common email provider for testing
   - These domains are typically allowed by default

4. **To Allow Specific Domains (e.g., mail.ru)**:
   - In Supabase Dashboard → Authentication → Settings
   - Find **"Email Domain Allowlist"** or similar setting
   - Add `mail.ru` (or your domain) to the allowed domains list
   - Save the changes
   - The change takes effect immediately

5. **If domain restrictions are not visible**:
   - Your Supabase project might be using default email validation
   - Contact Supabase support or check if there are custom email validation rules
   - Alternatively, use a different email provider for registration

