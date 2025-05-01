import { UserProfile } from "@/integrations/supabase/client";

export type AuthContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
};

export type RegisterData = {
  email: string;
  password: string;
  full_name: string;
  age: number;
  height: number;
  weight: number;
};
