"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Play, Square, Save, PlusCircle, X, Loader2 } from "lucide-react";
import mqttService, { SensorData, MQTTConfig } from "@/services/mqttService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { createClient } from "@supabase/supabase-js";
import env from "@/env";
import { useAuth } from "@/hooks/use-auth";

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
);

const DEFAULT_ACTIVITIES = [
  "standing",
  "sitting",
  "walking",
  "running",
  "upstairs",
  "downstairs",
];
const SUB_ACTIVITIES: Record<string, string[]> = {
  standing: ["None", "standing-eating", "standing-calling"],
  sitting: ["None", "sitting-working", "sitting-relaxing"],
  walking: ["None", "walking-fast", "walking-slow"],
  running: ["None", "running-fast", "running-slow"],
};

const DataCollectionForm = () => {
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [selectedSubActivity, setSelectedSubActivity] = useState<string>("");
  const [newActivity, setNewActivity] = useState<string>("");
  const [activities, setActivities] = useState<string[]>(DEFAULT_ACTIVITIES);
  const [isCollecting, setIsCollecting] = useState<boolean>(false);
  const [sensorData, setSensorData] = useState<any[]>([]);
  const [showNewActivityInput, setShowNewActivityInput] =
    useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const chartDataRef = useRef<any[]>([]);
  const activityRef = useRef<string>("");
  const subActivityRef = useRef<string>("");
  const { toast } = useToast(); 
  const {user} = useAuth();

  useEffect(() => {
    const config: MQTTConfig = {
      brokerUrl: env.VITE_BROKER_URL,
      clientId: `motionsense_${Date.now()}`,
      topic: "sensor/nodejs",
    };
    mqttService.configure(config);
    return () => mqttService.disconnect();
  }, []);

  useEffect(() => {
    activityRef.current = selectedActivity;
  }, [selectedActivity]);

  useEffect(() => {
    subActivityRef.current = selectedSubActivity;
  }, [selectedSubActivity]);

  const handleSensorData = (data: SensorData) => {
    const taggedData = {
      ...data,
      activity: activityRef.current,
      subActivity: subActivityRef.current,
    };
    chartDataRef.current.push(taggedData);
    setSensorData([...chartDataRef.current]);
  };

  const startCollection = async () => {
    try {
      await mqttService.connect(handleSensorData);
      setIsCollecting(true);
      chartDataRef.current = [];
      setSensorData([]);
      toast({ title: "Data Collection Started" });
    } catch {
      toast({
        title: "Connection Error",
        description: "MQTT broker connection failed",
        variant: "destructive",
      });
    }
  };

  const stopCollection = async () => {
    await mqttService.disconnect();
    setIsCollecting(false);
    toast({
      title: "Data Collection Stopped",
      description: `${chartDataRef.current.length} data points recorded.`,
    });
  };

  const saveData = async () => {
    if (chartDataRef.current.length === 0) {
      toast({
        title: "No Data",
        description: "No data to save",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.from("sensor_data").insert(
        chartDataRef.current.map((point) => ({
          activity: point.activity || null,
          sub_activity: point.subActivity || null,
          acc_x: point.acceleration.x,
          acc_y: point.acceleration.y,
          acc_z: point.acceleration.z,
          gyro_x: point.gyroscope.x,
          gyro_y: point.gyroscope.y,
          gyro_z: point.gyroscope.z,
          timestamp: Date.now(),
          user_id: user?.id
        })),
      );
      if (error) throw error;
      toast({
        title: "Data Saved",
        description: `${chartDataRef.current.length} data points saved.`,
      });
      chartDataRef.current = [];
      setSensorData([]);
    } catch (error: any) {
      toast({
        title: "Save Error",
        description: error.message || "Failed to save data",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addNewActivity = () => {
    if (!newActivity.trim()) {
      toast({
        title: "Invalid Activity",
        description: "Enter a valid name",
        variant: "destructive",
      });
      return;
    }
    const formatted = newActivity.trim().toLowerCase();
    if (activities.includes(formatted)) {
      toast({
        title: "Activity Exists",
        description: "Already exists",
        variant: "destructive",
      });
      return;
    }
    setActivities([...activities, formatted]);
    setSelectedActivity(formatted);
    setNewActivity("");
    setShowNewActivityInput(false);
    toast({ title: "Activity Added", description: `'${formatted}' added.` });
  };

  const formatChartData = (data: SensorData[]) => {
    return data.slice(-20).map((item, index) => ({
      name: index,
      accX: item.acceleration.x,
      accY: item.acceleration.y,
      accZ: item.acceleration.z,
      gyroX: item.gyroscope.x,
      gyroY: item.gyroscope.y,
      gyroZ: item.gyroscope.z,
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Collection</CardTitle>
          <CardDescription>
            Choose an activity and sub-activity while collecting data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Activity Selection */}
          <div className="space-y-2">
            <Label>Select Activity</Label>
            <div className="flex items-center space-x-2">
              {showNewActivityInput ? (
                <div className="flex flex-1 items-center space-x-2">
                  <Input
                    placeholder="New activity"
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                  />
                  <Button size="sm" onClick={addNewActivity}>
                    Add
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowNewActivityInput(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Select
                    value={selectedActivity}
                    onValueChange={(val) => {
                      setSelectedActivity(val);
                      setSelectedSubActivity("");
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select an activity" />
                    </SelectTrigger>
                    <SelectContent>
                      {activities.map((activity) => (
                        <SelectItem key={activity} value={activity}>
                          {activity.charAt(0).toUpperCase() + activity.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowNewActivityInput(true)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Sub-Activity Selection */}
          {selectedActivity && SUB_ACTIVITIES[selectedActivity]?.length > 0 && (
            <div className="space-y-2">
              <Label>Select Sub-Activity</Label>
              <Select
                value={selectedSubActivity}
                onValueChange={setSelectedSubActivity}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a sub-activity" />
                </SelectTrigger>
                <SelectContent>
                  {SUB_ACTIVITIES[selectedActivity].map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-between">
            <Button
              onClick={isCollecting ? stopCollection : startCollection}
              variant={isCollecting ? "destructive" : "default"}
            >
              {isCollecting ? (
                <>
                  <Square className="mr-2 h-4 w-4" /> Stop
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Start
                </>
              )}
            </Button>
            <Button
              onClick={saveData}
              variant="outline"
              disabled={isCollecting || !sensorData.length || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Sensor Data</CardTitle>
          <CardDescription>Accelerometer & Gyroscope data</CardDescription>
        </CardHeader>
        <CardContent>
          {sensorData.length > 0 ? (
            <>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Accelerometer</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={formatChartData(sensorData)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[-2, 2]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="accX" stroke="#3B82F6" />
                    <Line type="monotone" dataKey="accY" stroke="#10B981" />
                    <Line type="monotone" dataKey="accZ" stroke="#EF4444" />
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
                    <Line type="monotone" dataKey="gyroX" stroke="#8B5CF6" />
                    <Line type="monotone" dataKey="gyroY" stroke="#F59E0B" />
                    <Line type="monotone" dataKey="gyroZ" stroke="#EC4899" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {isCollecting ? (
                <p>Receiving data...</p>
              ) : (
                <p>Start recording to see visualization</p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {isCollecting
              ? `Recording ${selectedActivity} - ${
                  selectedSubActivity || "No sub-activity"
                } | ${sensorData.length} pts`
              : sensorData.length
                ? `${sensorData.length} points collected`
                : "Ready to start collection"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DataCollectionForm;
