import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error(
      '❌ Supabase configuration error: Missing environment variables.\n\n' +
      'Please create a `.env.local` file in the root directory with:\n\n' +
      'NEXT_PUBLIC_SUPABASE_URL=your-supabase-url\n' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key\n\n' +
      'See SETUP.md for your project credentials.'
    );
  }
  throw new Error(
    'Missing Supabase environment variables. Please check SETUP.md for configuration instructions.'
  );
}

// Initialize Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

