
import React, { createContext, useContext } from 'react';
import { useAuthState } from '@/hooks/use-auth-state';
import { useAuthOperations } from '@/hooks/use-auth-operations';
import type { AuthContextType } from '@/types/auth';

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    setUser, 
    isLoading, 
    setIsLoading, 
    isAuthenticated, 
    isMockMode 
  } = useAuthState();
  
  const { login, register, logout } = useAuthOperations(
    setUser,
    setIsLoading,
    isMockMode
  );

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

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
