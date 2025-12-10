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

### "Email address is invalid" error
This error occurs when Supabase rejects an email address that appears valid. Common causes:

1. **Email Domain Restrictions**: Supabase may have domain restrictions configured
   - Go to your Supabase Dashboard → Authentication → Settings
   - Check "Site URL" and "Redirect URLs" settings
   - Look for any "Email Domain Restrictions" or "Allowed Email Domains" settings
   - If present, add your email domain (e.g., `mail.ru`) to the allowed list

2. **Disposable Email Blocking**: Some email providers may be blocked
   - Check Authentication → Settings → "Email Templates"
   - Look for any email validation or blocking rules

3. **Solution**: Try using a different email address (like Gmail, Outlook, etc.) to test if it's domain-specific

4. **If you need to allow specific domains**:
   - In Supabase Dashboard, go to Authentication → Settings
   - Check if there's an "Allowed Email Domains" or "Blocked Email Domains" setting
   - If your project has domain restrictions, contact your Supabase project administrator

