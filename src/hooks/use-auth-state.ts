
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/lib/supabase';

export function useAuthState() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMockMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      
      // Check for active Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Fetch user profile from profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile && !error) {
          setUser(profile as UserProfile);
        }
      } else if (isMockMode) {
        // For development without Supabase, use demo user
        const storedUser = localStorage.getItem('mockUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
      
      setIsLoading(false);
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            setUser(profile as UserProfile);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [isMockMode]);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated: !!user,
    isMockMode
  };
}
