import mqtt from 'mqtt';
import fs from 'fs';
import { insertSensorData } from './supabase.js';

const client = mqtt.connect('ws://192.168.0.141:9001');
const topic = 'sensor/nodejs';

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(topic);
});

client.on('message', async (_, message) => {
  const data = JSON.parse(message.toString());
  console.log('Received data:', data);

  // Save to Supabase
  await insertSensorData(data);

  // Save to CSV
  const row = [
    data.timestamp,
    data.acceleration.x,
    data.acceleration.y,
    data.acceleration.z,
    data.gyroscope.x,
    data.gyroscope.y,
    data.gyroscope.z
  ].join(',') + '\n';
  
  fs.appendFileSync('sensor_data.csv', row);
});
