import { UserProfile, supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export function useAuthState() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);

      // Check for active Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Fetch user profile from profiles table
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error || !profile) {
          setUser(null);
        } else {
          setUser(profile);
        }
        setIsLoading(false);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated: !!user,
  };
}
