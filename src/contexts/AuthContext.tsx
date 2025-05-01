import { useAuthOperations } from "@/hooks/use-auth-operations";
import { useAuthState } from "@/hooks/use-auth-state";
import type { AuthContextType } from "@/types/auth";
import React, { createContext } from "react";

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, setUser, isLoading, setIsLoading, isAuthenticated } =
    useAuthState();

  const { login, register, logout } = useAuthOperations(setUser, setIsLoading);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
