import mqttService, { MQTTConfig, SensorData } from './mqttService';

const config: MQTTConfig = {
  brokerUrl: 'mqtt://test.mosquitto.org', // Or your broker
  clientId: 'mqtt-demo-client',
  topic: 'test/sensors'
};

mqttService.configure(config);

mqttService.connect((data: SensorData) => {
  console.log('Received Sensor Data:', data);
}).then(() => {
  console.log('MQTT connection established and data transmission started.');
}).catch(console.error);


