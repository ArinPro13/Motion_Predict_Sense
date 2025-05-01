import { supabase, UserProfile } from "@/integrations/supabase/client";
import { RegisterData } from "@/types/auth";

export function useAuthOperations(
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      console.log("Starting login process for email:", email);

      // First sign in with email/password
      console.log("Attempting to sign in with password...");
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      console.log("Auth sign in result:", {
        success: !authError,
        session: authData?.session ? "exists" : "null",
        error: authError,
      });

      if (authError) {
        throw authError;
      }

      // Then get the user profile
      console.log("Fetching user profile...");
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      console.log("Profile fetch result:", {
        success: !profileError,
        profile: userProfile ? "exists" : "null",
        error: profileError,
      });

      if (profileError || !userProfile) {
        throw new Error("User profile not found");
      }

      console.log("Login successful, user profile:", userProfile);
      setUser(userProfile);
      setIsLoading(false);
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
      console.log("Starting registration with data:", userData);

      // Check if email already exists
      const { data: existingUser, error: existingUserError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", userData.email)
        .single();

      console.log("Existing user check:", { existingUser, existingUserError });

      if (existingUser) {
        throw new Error("Email already exists");
      }

      console.log("Creating auth user...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      console.log("Auth signup result:", { authData, authError });

      if (authError || !authData.user) {
        throw authError || new Error("Failed to create user");
      }

      // Create user profile in profiles table
      console.log("Creating profile...");
      const profileData = {
        id: authData.user.id,
        email: userData.email,
        full_name: userData.full_name,
        age: userData.age,
        height: userData.height,
        weight: userData.weight,
      };

      console.log("Profile data to insert:", profileData);

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([profileData]);

      console.log("Profile insert result:", { profileError });

      if (profileError) {
        throw profileError;
      }

      // Get the created profile
      console.log("Fetching created profile...");
      const { data: newProfile, error: fetchProfileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      console.log("Fetch profile result:", { newProfile, fetchProfileError });

      if (fetchProfileError) {
        console.error("Error fetching new profile:", fetchProfileError);
      }

      setUser(newProfile);
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
  };

  return {
    login,
    register,
    logout,
  };
}
