
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Play, Square, Activity, Bike, User, Coffee } from 'lucide-react';
import mqttService, { SensorData, MQTTConfig } from '@/services/mqttService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ActivityPrediction = () => {
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictedActivity, setPredictedActivity] = useState<string | null>(null);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [confidence, setConfidence] = useState<number>(0);
  const chartDataRef = useRef<SensorData[]>([]);
  const { toast } = useToast();

  // Configure MQTT
  useEffect(() => {
    const config: MQTTConfig = {
      brokerUrl: 'mqtt://broker.example.com', // This would be your real MQTT broker
      clientId: `motionsense_predict_${Date.now()}`,
      topic: 'esp32/sensor_data'
    };
    mqttService.configure(config);

    return () => {
      mqttService.disconnect();
    };
  }, []);

  // Activities with corresponding icons
  const activityIcons: Record<string, React.ReactNode> = {
    standing: <User className="h-full w-full" />,
    sitting: <Coffee className="h-full w-full" />,
    walking: <Activity className="h-full w-full" />,
    running: <Bike className="h-full w-full" />,
  };

  // Handle received sensor data
  const handleSensorData = (data: SensorData) => {
    const updatedData = [...chartDataRef.current, data];
    
    // Limit chart data to the most recent 20 points for better visualization
    if (updatedData.length > 20) {
      chartDataRef.current = updatedData.slice(updatedData.length - 20);
    } else {
      chartDataRef.current = updatedData;
    }
    
    setSensorData([...chartDataRef.current]);
    
    // Predict activity based on sensor data
    // This is a mock prediction for demo purposes
    if (updatedData.length > 5) {
      mockPredictActivity(updatedData);
    }
  };

  // Mock activity prediction (in a real app, this would use a trained model)
  const mockPredictActivity = (data: SensorData[]) => {
    const activities = ['standing', 'sitting', 'walking', 'running'];
    
    // Get the last data point
    const latestData = data[data.length - 1];
    
    // Simple mock prediction based on accelerometer z-axis value
    // In a real app, this would use an ML model
    let predicted = '';
    let randomConfidence = 0;
    
    const zAccel = Math.abs(latestData.acceleration.z);
    
    if (zAccel < 2) {
      predicted = 'sitting';
      randomConfidence = 70 + Math.random() * 20;
    } else if (zAccel < 4) {
      predicted = 'standing';
      randomConfidence = 65 + Math.random() * 25;
    } else if (zAccel < 7) {
      predicted = 'walking';
      randomConfidence = 75 + Math.random() * 20;
    } else {
      predicted = 'running';
      randomConfidence = 80 + Math.random() * 15;
    }
    
    // Add some randomness to make it more realistic
    if (Math.random() < 0.1) {
      predicted = activities[Math.floor(Math.random() * activities.length)];
      randomConfidence = 40 + Math.random() * 30;
    }
    
    setPredictedActivity(predicted);
    setConfidence(Math.round(randomConfidence));
  };

  // Start prediction
  const startPrediction = async () => {
    try {
      await mqttService.connect(handleSensorData);
      setIsPredicting(true);
      chartDataRef.current = [];
      setSensorData([]);
      setPredictedActivity(null);
      setConfidence(0);
      toast({
        title: 'Activity Prediction Started',
        description: 'Analyzing sensor data in real-time',
      });
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to MQTT broker',
        variant: 'destructive',
      });
    }
  };

  // Stop prediction
  const stopPrediction = async () => {
    await mqttService.disconnect();
    setIsPredicting(false);
    toast({
      title: 'Activity Prediction Stopped',
      description: 'Sensor data analysis has been stopped',
    });
  };

  // Format data for chart
  const formatChartData = (data: SensorData[]) => {
    return data.map((item, index) => ({
      name: index,
      accX: item.acceleration.x,
      accY: item.acceleration.y,
      accZ: item.acceleration.z,
      gyroX: item.gyroscope.x,
      gyroY: item.gyroscope.y,
      gyroZ: item.gyroscope.z,
    }));
  };

  // Get confidence class based on percentage
  const getConfidenceClass = (conf: number) => {
    if (conf >= 80) return 'text-green-600';
    if (conf >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Activity Prediction</CardTitle>
          <CardDescription>
            Predict your current activity using real-time sensor data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button
              onClick={isPredicting ? stopPrediction : startPrediction}
              variant={isPredicting ? "destructive" : "default"}
              className="px-6"
              size="lg"
            >
              {isPredicting ? (
                <>
                  <Square className="mr-2 h-5 w-5" /> Stop Prediction
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" /> Start Prediction
                </>
              )}
            </Button>
          </div>

          {isPredicting && (
            <div className="flex justify-center items-center mt-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Current Activity:</h3>
                {predictedActivity ? (
                  <>
                    <div className="mb-2 flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {activityIcons[predictedActivity] || <Activity className="h-12 w-12" />}
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-primary">
                      {predictedActivity.charAt(0).toUpperCase() + predictedActivity.slice(1)}
                    </h2>
                    <p className="mt-1">
                      Confidence: <span className={getConfidenceClass(confidence)}>{confidence}%</span>
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground animate-pulse">Analyzing data...</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sensor Data</CardTitle>
          <CardDescription>Real-time data from accelerometer and gyroscope</CardDescription>
        </CardHeader>
        <CardContent>
          {sensorData.length > 0 ? (
            <div className="data-visualization">
              <div className="mb-8">
                <h3 className="font-semibold mb-2">Accelerometer</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={formatChartData(sensorData)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[-10, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="accX" stroke="#3B82F6" name="X-Axis" />
                    <Line type="monotone" dataKey="accY" stroke="#10B981" name="Y-Axis" />
                    <Line type="monotone" dataKey="accZ" stroke="#EF4444" name="Z-Axis" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Gyroscope</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={formatChartData(sensorData)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[-10, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="gyroX" stroke="#8B5CF6" name="X-Axis" />
                    <Line type="monotone" dataKey="gyroY" stroke="#F59E0B" name="Y-Axis" />
                    <Line type="monotone" dataKey="gyroZ" stroke="#EC4899" name="Z-Axis" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {isPredicting ? 
                <p>Waiting for sensor data...</p> : 
                <p>Start prediction to see sensor data</p>
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityPrediction;
