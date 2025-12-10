import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 
    '❌ Supabase configuration error: Missing environment variables.\n\n' +
    'Please ensure `.env.local` exists in the root directory with:\n\n' +
    'NEXT_PUBLIC_SUPABASE_URL=your-supabase-url\n' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key\n\n' +
    'After creating/updating `.env.local`, restart your dev server.\n' +
    'See SETUP.md for your project credentials.';
  
  if (typeof window !== 'undefined') {
    console.error(errorMessage);
    // Show user-friendly error in browser console
    console.error('Current env values:', {
      url: supabaseUrl || 'MISSING',
      key: supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'MISSING'
    });
    // Additional help for production
    if (process.env.NODE_ENV === 'production') {
      console.error('🔧 To fix this in Vercel:');
      console.error('1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
      console.error('2. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
      console.error('3. Redeploy your application');
      console.error('See VERCEL_DEPLOYMENT.md for detailed instructions.');
    }
  } else {
    // Server-side: log but don't throw to allow build to complete
    console.warn('⚠️ Supabase environment variables are missing. The application may not work correctly.');
  }
}

// Log in development to help debug
if (process.env.NODE_ENV === 'development' && supabaseUrl && supabaseAnonKey) {
  console.log('✅ Supabase configured:', {
    url: supabaseUrl,
    keyPrefix: supabaseAnonKey.substring(0, 20) + '...'
  });
}

// Initialize Supabase client with performance optimizations
// Don't throw during build - let it fail at runtime if needed
// This allows the build to complete even if env vars aren't set in CI/CD
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-client-info': 'stc-hub-portal',
      },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Runtime check for production (after client is created)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ WARNING: Supabase environment variables are missing in production!');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your deployment environment.');
  }
}

