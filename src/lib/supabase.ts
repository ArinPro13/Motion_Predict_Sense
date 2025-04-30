import { createClient } from '@supabase/supabase-js';

// Get environment variables or use fallback defaults (for development purposes only)
const supabaseUrl = 'https://bcruadamezzuczadbksn.supabase.co';
const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcnVhZGFtZXp6dWN6YWRia3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MTU3MjUsImV4cCI6MjA1OTE5MTcyNX0.DXoH7OUFiDEvL03f0BGse1ETW0iUKX7DmV52WA5lWO0';
// Create a mock Supabase client for development when credentials are missing
const createMockClient = () => {
  console.warn('Using mock Supabase client. Authentication features will not work.');

  return {
    auth: {
      signUp: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null }),
      signInWithPassword: async () => ({ data: { session: { user: { id: 'mock-user-id' } } }, error: null }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
        }),
        single: async () => ({ data: null, error: null }),
      }),
      insert: async () => ({ error: null }),
    }),
  };
};

// Create the Supabase client or use mock if credentials are missing
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are not set. Authentication features will use mock data.');
}

// Type for User Profile (example)
export type UserProfile = {
  id: string;
  email: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  created_at?: string;
};

// Optional: You can add methods here to interact with Supabase
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
};
