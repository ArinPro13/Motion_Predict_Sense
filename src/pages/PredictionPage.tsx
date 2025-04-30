
import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import ActivityPrediction from '@/components/prediction/ActivityPrediction';
import { useAuth } from '@/contexts/AuthContext';

const PredictionPage = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <ActivityPrediction />
      </div>
    </div>
  );
};

export default PredictionPage;
