import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Database, LineChart, Activity, Brain } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  console.log(user);

  const dashboardItems = [
    {
      title: "Collect Data",
      description: "Record and label sensor data for different activities",
      icon: <Database className="h-12 w-12 text-primary" />,
      path: "/collect",
      color: "bg-blue-50",
    },
    {
      title: "Predict Activity",
      description: "Use the trained model to predict your current activity",
      icon: <Activity className="h-12 w-12 text-secondary" />,
      path: "/predict",
      color: "bg-green-50",
    },
    {
      title: "Train Model",
      description: "Train a machine learning model with your collected data",
      icon: <Brain className="h-12 w-12 text-purple-500" />,
      path: "/train",
      color: "bg-purple-50",
    },
    {
      title: "View Statistics",
      description: "Analyze your collected data and model performance",
      icon: <LineChart className="h-12 w-12 text-amber-500" />,
      path: "#",
      color: "bg-amber-50",
      disabled: true,
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-gray-600">
          This dashboard helps you collect and analyze sensor data for activity
          recognition.
        </p>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{user?.age || "Not set"} years</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="font-medium">{user?.height || "Not set"} cm</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="font-medium">{user?.weight || "Not set"} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item, index) => (
          <Card
            key={index}
            className={`overflow-hidden border-t-4 border-t-primary`}
          >
            <div className={`${item.color} p-6 flex justify-center`}>
              {item.icon}
            </div>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                className="w-full"
                variant={item.disabled ? "outline" : "default"}
                asChild={!item.disabled}
                disabled={item.disabled}
              >
                {!item.disabled ? (
                  <Link to={item.path}>Go to {item.title}</Link>
                ) : (
                  <span>Coming Soon</span>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
