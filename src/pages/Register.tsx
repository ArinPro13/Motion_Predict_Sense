
import React from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { Activity } from 'lucide-react';

const Register = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md mb-6 text-center">
        <div className="flex justify-center mb-2">
          <Activity className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-1">MotionSense</h1>
        <p className="text-muted-foreground">
          Create an account to start collecting sensor data
        </p>
      </div>
      
      <RegisterForm />
    </div>
  );
};

export default Register;
