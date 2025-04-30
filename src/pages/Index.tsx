
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, Database, Brain, ChevronRight } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-background to-muted/40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">MotionSense</span>
            </div>
            <div>
              {isAuthenticated ? (
                <Button asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button variant="ghost" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl">
            Activity Recognition with ESP32 Sensors
          </h1>
          <p className="text-xl mb-10 max-w-2xl text-muted-foreground">
            Collect, analyze, and predict human activities using accelerometer and 
            gyroscope data from ESP32 devices.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                Get Started <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={isAuthenticated ? "/collect" : "/login"}>
                Try Demo
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Database className="h-10 w-10 text-primary" />}
              title="Data Collection"
              description="Record and label accelerometer and gyroscope data for different physical activities."
            />
            <FeatureCard 
              icon={<Activity className="h-10 w-10 text-secondary" />}
              title="Activity Recognition"
              description="Use machine learning to predict your current activity in real-time using sensor data."
            />
            <FeatureCard 
              icon={<Brain className="h-10 w-10 text-purple-500" />}
              title="Custom Model Training"
              description="Train personalized models using your own data for improved accuracy."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard 
              number={1}
              title="Connect Your ESP32"
              description="Connect your ESP32 device via MQTT to stream sensor data to the application."
            />
            <StepCard 
              number={2}
              title="Record Activities"
              description="Collect and label sensor data for various activities like standing, sitting, or walking."
            />
            <StepCard 
              number={3}
              title="Predict & Analyze"
              description="Train models using your data and predict activities in real-time."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            Join MotionSense today and start exploring the possibilities of sensor-based activity recognition.
          </p>
          <Button size="lg" asChild>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              {isAuthenticated ? "Go to Dashboard" : "Create Account"}
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">MotionSense</span>
            </div>
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} MotionSense. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const StepCard = ({ number, title, description }: { 
  number: number, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="relative bg-white p-6 rounded-lg shadow-sm border">
      <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 mt-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
