# How to Set Up Admin Access

This guide explains how to set up admin access and manage user roles in the SCT Hub application.

## Understanding User Roles

The application has three user roles:

- **Student** (default): Regular users who can view content and manage their profile
- **Staff**: Staff members with limited admin privileges
- **Teacher**: Full admin access to manage content, users, and all features

## Step 1: Register a User Account

1. **Start your development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to the registration page**:
   - Go to `http://localhost:3000/register`
   - Or click "Register" from the login page

3. **Fill in the registration form**:
   - Enter your name
   - Enter your email address
   - Enter your phone number (optional)
   - Enter a password (minimum 6 characters)
   - Confirm your password
   - Click "Create Account"

4. **After registration**, you'll be redirected to the login page

## Step 2: Login

1. **Navigate to the login page**:
   - Go to `http://localhost:3000/login`
   - Or use the link from the registration success page

2. **Enter your credentials**:
   - Email: The email you used during registration
   - Password: The password you created

3. **Click "Login"**

4. **You'll be redirected to your profile page** (`/profile`)

## Step 3: Make Your User an Admin

To access the admin panel, you need to change your user role to `teacher`. You have **three options**:

### Option 1: Using Admin Panel (Recommended - If you already have an admin)

If you already have a user with `teacher` role:

1. **Ask the existing admin** to log in and go to `/admin/users`
2. **Find your user** in the user management table
3. **Change your role** from the dropdown menu to `teacher`
4. **Logout and login again** to refresh your session
5. You should now see the Shield icon (🛡️) in the header

### Option 2: Using Supabase Dashboard (Manual Method)

### Option A: Using Supabase Dashboard

1. **Go to your Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard
   - Select your project: "S-hub-academy"

2. **Navigate to the Table Editor**:
   - Click on "Table Editor" in the left sidebar
   - Select the `profiles` table

3. **Find your user profile**:
   - Look for the row with your email address
   - If you don't see your profile, it means it wasn't created automatically (this can happen)

4. **Update the role**:
   - Click on the `role` field for your user
   - Change it from `student` to `teacher`
   - Click "Save" or press Enter

### Option B: Using SQL Editor in Supabase (Quick Method)

1. **Go to your Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard
   - Select your project: "S-hub-academy"

2. **Open SQL Editor**:
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run this SQL command** (replace `your-email@example.com` with your actual email):
   ```sql
   UPDATE profiles 
   SET role = 'teacher' 
   WHERE email = 'your-email@example.com';
   ```

4. **Click "Run"** to execute the query

### Option C: Create Profile Manually (If profile doesn't exist)

If your profile wasn't created automatically, you can create it manually:

1. **First, get your user ID**:
   - Go to "Authentication" → "Users" in Supabase Dashboard
   - Find your user and copy the User UID

2. **Create the profile**:
   ```sql
   INSERT INTO profiles (id, email, name, role)
   VALUES (
     'your-user-id-here',  -- Paste your User UID
     'your-email@example.com',
     'Your Name',
     'teacher'
   );
   ```

## Step 4: Access the Admin Panel

1. **Logout and login again** (to refresh your session):
   - Click on your profile in the header
   - Or go to `/profile` and logout
   - Login again with your credentials

2. **Access the admin panel**:
   - You should now see a **Shield icon (🛡️)** in the header navigation
   - Click on it to go to `/admin`
   - Or navigate directly to: `http://localhost:3000/admin`

3. **You should see the Admin Dashboard** with:
   - Statistics for news, trainings, and services
   - Quick action buttons
   - Navigation sidebar

## Troubleshooting

### I don't see the Shield icon after updating my role

- **Logout and login again** - Your session needs to refresh
- **Check your browser console** for any errors
- **Verify the role was updated** in the Supabase dashboard

### I get "Access Denied" when trying to access `/admin`

- Make sure your role is set to `teacher` (not `staff` or `student`)
- Verify the profile exists in the `profiles` table
- Try logging out and logging back in

### My profile doesn't exist in the profiles table

- This can happen if registration didn't complete properly
- Use Option C above to create it manually
- Make sure to use the correct User UID from the Authentication section

### I can't find my user in Supabase

- Go to "Authentication" → "Users" in Supabase Dashboard
- Check if your user was created
- If not, try registering again

## Admin Panel Features

Once you have admin access, you can:

- **Manage News**: Create, edit, and delete news articles
- **Manage Trainings**: Add and update training courses
- **Manage Services**: Configure services and their features
- **Manage Users**: Change user roles (Student, Staff, Teacher) from the admin panel
- **View Statistics**: See counts of all content items and users

All changes you make will immediately appear on the frontend pages!

## Managing User Roles

### For Admins (Teachers)

1. **Go to Admin Panel** → **Users** (`/admin/users`)
2. **Find the user** you want to update (use search or filters)
3. **Select a new role** from the dropdown menu:
   - **Student**: Regular user (default)
   - **Staff**: Limited admin access
   - **Teacher**: Full admin access
4. **The change takes effect immediately** (user needs to logout/login to see changes)

### For Regular Users

If you're a student and want to become a teacher or staff:

1. **Ask an existing admin** to update your role in the admin panel
2. **Or follow Option 2/3** in Step 3 above to update it manually in Supabase
3. **Logout and login again** to refresh your session
4. You'll see the Shield icon (🛡️) in the header if you're a teacher

