// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration in .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});

// Add session management functions
export const clearAuthSession = async () => {
  await supabase.auth.signOut();
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('sb-auth-token');
    window.localStorage.removeItem('sb-' + supabaseUrl.split('//')[1] + '-auth-token');
  }
};

// Test function
export async function testConnection() {
  const { data, error } = await supabase
    .from('jason_products')
    .select('name')
    .limit(1);

  if (error) {
    console.error('Connection test failed. Please verify:');
    console.log('1. Table exists in Supabase dashboard');
    console.log('2. RLS policies allow access');
    console.log('3. Correct project URL in .env');
    throw error;
  }
  return data;
}