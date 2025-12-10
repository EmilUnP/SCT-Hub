import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables (log warning but don't throw during module load)
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error(
      '❌ Supabase configuration error: Missing environment variables.\n\n' +
      'Please create a `.env.local` file in the root directory with:\n\n' +
      'NEXT_PUBLIC_SUPABASE_URL=your-supabase-url\n' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key\n\n' +
      'See SETUP.md for your project credentials.'
    );
  } else {
    // Server-side: log but don't throw to allow build to complete
    console.warn(
      '⚠️ Supabase environment variables are missing. The application may not work correctly.'
    );
  }
}

// Initialize Supabase client
// Use fallback values to prevent errors during build/runtime initialization
// Actual operations will fail if env vars are missing, but module will load
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

