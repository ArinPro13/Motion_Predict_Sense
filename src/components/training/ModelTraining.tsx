
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Brain, CheckCircle2, Play, RefreshCcw } from 'lucide-react';

const ModelTraining = () => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [trainingComplete, setTrainingComplete] = useState<boolean>(false);
  const [modelAccuracy, setModelAccuracy] = useState<number | null>(null);
  const { toast } = useToast();

  // Available activities
  const activities = [
    { id: 'standing', label: 'Standing', count: 120 },
    { id: 'sitting', label: 'Sitting', count: 135 },
    { id: 'walking', label: 'Walking', count: 95 },
    { id: 'running', label: 'Running', count: 40 },
  ];

  // Toggle activity selection
  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  // Start model training
  const startTraining = () => {
    if (selectedActivities.length < 2) {
      toast({
        title: 'Error',
        description: 'Please select at least two activities for training',
        variant: 'destructive',
      });
      return;
    }

    setIsTraining(true);
    setProgress(0);
    setTrainingComplete(false);
    setModelAccuracy(null);

    toast({
      title: 'Training Started',
      description: `Training model with ${selectedActivities.length} selected activities`,
    });

    // Simulate training progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          setTrainingComplete(true);
          
          // Generate random accuracy between 85% and 95%
          const accuracy = 85 + Math.random() * 10;
          setModelAccuracy(parseFloat(accuracy.toFixed(2)));
          
          toast({
            title: 'Training Complete',
            description: `Model trained with ${accuracy.toFixed(2)}% accuracy`,
          });
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };

  // Reset training state
  const resetTraining = () => {
    setTrainingComplete(false);
    setModelAccuracy(null);
    setProgress(0);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Model Training</CardTitle>
          <CardDescription>
            Train a machine learning model with your collected sensor data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Select Activities to Include in Training</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors"
                >
                  <Checkbox 
                    id={activity.id} 
                    checked={selectedActivities.includes(activity.id)}
                    onCheckedChange={() => toggleActivity(activity.id)}
                    disabled={isTraining}
                  />
                  <div className="flex flex-1 justify-between items-center">
                    <Label htmlFor={activity.id} className="cursor-pointer">
                      {activity.label}
                    </Label>
                    <Badge count={activity.count} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {trainingComplete ? (
            <div className="flex flex-col items-center space-y-4 p-6 bg-muted/30 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-center">Training Complete</h3>
              
              {modelAccuracy !== null && (
                <div className="flex flex-col items-center">
                  <p className="text-muted-foreground mb-1">Model Accuracy</p>
                  <p className="text-3xl font-bold text-primary">{modelAccuracy}%</p>
                </div>
              )}
              
              <Button 
                onClick={resetTraining} 
                variant="outline" 
                className="mt-2"
              >
                <RefreshCcw className="mr-2 h-4 w-4" /> Train Another Model
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {isTraining ? (
                <div className="space-y-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Training Progress</span>
                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Training model with {selectedActivities.length} activities...
                  </p>
                </div>
              ) : (
                <Button 
                  onClick={startTraining} 
                  disabled={selectedActivities.length < 2}
                  className="w-full"
                  size="lg"
                >
                  <Brain className="mr-2 h-5 w-5" /> Start Training
                </Button>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <p>
            Training a model requires collected data for at least two different activities.
            The more data available, the better the model performance will be.
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Training Information</CardTitle>
          <CardDescription>How model training works</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">What happens during training?</h3>
              <p className="text-muted-foreground">
                During training, the system processes your collected sensor data to learn patterns 
                that distinguish different activities. The model analyzes accelerometer and gyroscope 
                readings to identify unique characteristics of each activity.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">How to improve model accuracy</h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Collect more data for each activity type</li>
                <li>Ensure consistent sensor placement during data collection</li>
                <li>Collect data in various environments and conditions</li>
                <li>Include transitions between activities in your training data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Badge component for activity counts
const Badge = ({ count }: { count: number }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
    {count} samples
  </span>
);

export default ModelTraining;
