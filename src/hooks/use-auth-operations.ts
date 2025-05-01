import { supabase } from "@/lib/supabase";
import { RegisterData } from "@/types/auth";
import type { UserProfile } from "@/lib/supabase";

export function useAuthOperations(
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isMockMode: boolean,
) {
  // Login function
  const login = async (username: string, password: string) => {
    setIsLoading(true);

    try {
      if (isMockMode) {
        // For development without Supabase, use mock login
        if (username === "demo") {
          const mockUser: UserProfile = {
            id: "mock-id-123",
            email: "demo",
            name: "Demo User",
            age: 25,
            height: 170,
            weight: 70,
            created_at: new Date().toISOString(),
          };

          setUser(mockUser);
          localStorage.setItem("mockUser", JSON.stringify(mockUser));
          return;
        } else {
          throw new Error('In demo mode, only username "demo" is accepted');
        }
      }

      // First, get user by username to get their email
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (profileError || !userProfile) {
        throw new Error("Invalid credentials");
      }

      // Then sign in with email/password
      const { error } = await supabase.auth.signInWithPassword({
        email: `${username}@example.com`, // Using username as email for demo
        password,
      });

      if (error) {
        throw error;
      }

      setUser(userProfile as UserProfile);
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    setIsLoading(true);

    try {
      if (isMockMode) {
        // For development without Supabase, use mock registration
        const mockUser: UserProfile = {
          id: `mock-id-${Date.now()}`,
          email: userData.email,
          name: userData.name,
          age: userData.age,
          height: userData.height,
          weight: userData.weight,
          created_at: new Date().toISOString(),
        };

        setUser(mockUser);
        localStorage.setItem("mockUser", JSON.stringify(mockUser));
        return;
      }

      // Check if email already exists
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", userData.email)
        .single();

      if (existingUser) {
        throw new Error("Username already exists");
      }

      // Create auth user first (using username as email for simplicity)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError || !authData.user) {
        throw authError || new Error("Failed to create user");
      }
      console.log("created auth user");

      // Create user profile in profiles table
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          age: userData.age,
          height: userData.height,
          weight: userData.weight,
        },
      ]);

      if (profileError) {
        throw profileError;
      }
      console.log("created profile user");

      // Get the created profile
      const { data: newProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      setUser(newProfile as UserProfile);
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Registration failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    if (isMockMode) {
      // For development without Supabase, clear local storage
      localStorage.removeItem("mockUser");
      setUser(null);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
  };

  return {
    login,
    register,
    logout,
  };
}
