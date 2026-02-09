# FinLogic Consulting & Training

A modern, professional portal for FinLogic Consulting & Training showcasing accounting, HR, tax services, and SERP system integration.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **Lucide React** - Icon library
- **Supabase** - Backend as a Service (Authentication & Database)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase project set up (already configured)

### Environment Setup

1. Create a `.env.local` file in the root directory:

2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Start production server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase Integration

This project uses Supabase for:
- **Authentication**: User login and registration
- **Database**: User profiles stored in PostgreSQL
- **Row Level Security**: Secure data access policies

### Database Schema

The `profiles` table stores user information:
- `id` (UUID) - References auth.users
- `email` (TEXT) - User email
- `name` (TEXT) - User full name
- `phone` (TEXT) - User phone number
- `company` (TEXT) - Company name (optional)
- `role` (TEXT) - User role: 'teacher', 'staff', or 'student'
- `created_at` (TIMESTAMP) - Account creation time
- `updated_at` (TIMESTAMP) - Last update time

### Authentication Flow

1. **Registration**: Users sign up with email/password, profile is automatically created
2. **Login**: Users authenticate with Supabase Auth
3. **Session Management**: Auth state is managed by Supabase and synced across tabs
4. **Profile Loading**: User profile is loaded from the database on authentication

## Admin Panel

The application includes a comprehensive admin panel for managing content. Access is restricted to users with the `teacher` role.

### Accessing the Admin Panel

1. **Login** with an account that has the `teacher` role
2. Click the **Shield icon** in the header navigation
3. Or navigate directly to `/admin`

### Admin Features

The admin panel provides full CRUD (Create, Read, Update, Delete) operations for:

- **News Management** (`/admin/news`)
  - Create, edit, and delete news articles
  - Manage categories, dates, and content
  - Upload images for articles

- **Trainings Management** (`/admin/trainings`)
  - Create and manage training courses
  - Set duration, price, trainer, and dates
  - Organize by categories

- **User Management** (`/admin/users`)
  - View all users
  - Manage user roles (teacher, staff, student)
  - Update user permissions

### Setting Up Admin Access

To grant admin access to a user:

1. Go to your Supabase dashboard
2. Navigate to the `profiles` table
3. Find the user you want to make an admin
4. Update their `role` field to `teacher`

Alternatively, you can use SQL in Supabase:

```sql
UPDATE profiles 
SET role = 'teacher' 
WHERE email = 'admin@example.com';
```

### Database Tables

The admin panel manages the following tables:

- **profiles** - User profiles and authentication data
- **news** - News articles and updates
- **trainings** - Training courses and workshops

**Note:** Services are hardcoded in `lib/data.ts` and are not stored in the database.

All tables have Row Level Security (RLS) enabled:
- Public read access for news and trainings
- Users can view/update their own profile
- Admin-only write access (users with `teacher` role) for all content

## Project Structure

- `/app` - Next.js App Router pages and layouts
  - `/admin` - Admin panel pages and routes
- `/components` - Reusable React components
  - `/admin` - Admin-specific components
- `/contexts` - React context providers (Auth, Language)
- `/lib` - Utility functions and Supabase client
  - `admin.ts` - Admin CRUD operations
- `/types` - TypeScript type definitions
- `/locales` - Internationalization files

