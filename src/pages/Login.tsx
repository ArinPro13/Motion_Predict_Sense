
import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Activity } from 'lucide-react';

const Login = () => {
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
          Activity recognition with ESP32 sensor data
        </p>
      </div>
      
      <LoginForm />
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Demo credentials: username: <span className="font-medium">demo</span>, password: any value
      </p>
    </div>
  );
};

export default Login;
