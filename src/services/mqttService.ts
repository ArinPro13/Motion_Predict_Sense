// services/mqttService.ts

import mqtt from 'mqtt';

export type SensorData = {
  acceleration: { x: number; y: number; z: number };
  gyroscope:    { x: number; y: number; z: number };
  timestamp:    number;
};

export type MQTTConfig = {
  brokerUrl: string;
  clientId:  string;
  topic:     string;
};

class MQTTService {
  private client:           mqtt.MqttClient | null               = null;
  private onMessageCallback: ((data: SensorData) => void) | null = null;
  private isConnected:      boolean                              = false;
  private config:           MQTTConfig | null                    = null;

  configure(config: MQTTConfig) {
    this.config = config;
    this.client = mqtt.connect(config.brokerUrl, { clientId: config.clientId });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker.');
      this.isConnected = true;
      this.client?.subscribe(config.topic, (err) => {
        if (err) console.error('Subscription error:', err);
        else      console.log(`Subscribed to topic: ${config.topic}`);
      });
    });

    this.client.on('message', (_, message) => {
      try {
        // 1) parse the raw JSON
        const raw = JSON.parse(message.toString());

        // 2) detect flat format (acc_x etc.) and remap to SensorData
        let data: SensorData;
        if (
          typeof raw.acc_x === 'number' &&
          typeof raw.acc_y === 'number' &&
          typeof raw.acc_z === 'number' &&
          typeof raw.gyro_x === 'number' &&
          typeof raw.gyro_y === 'number' &&
          typeof raw.gyro_z === 'number'
        ) {
          data = {
            acceleration: { x: raw.acc_x, y: raw.acc_y, z: raw.acc_z },
            gyroscope:    { x: raw.gyro_x, y: raw.gyro_y, z: raw.gyro_z },
            timestamp:    raw.timestamp ?? Date.now(),
          };
        } else if (
          raw.acceleration && raw.gyroscope && typeof raw.timestamp === 'number'
        ) {
          // already in nested format
          data = raw as SensorData;
        } else {
          console.warn('Received sensor data in unknown format:', raw);
          return;
        }

        // 3) call your callback
        this.onMessageCallback?.(data);
      } catch (err) {
        console.error('Failed to parse MQTT message:', err);
      }
    });

    this.client.on('error', (error) => {
      console.error('MQTT Client Error:', error);
    });
  }

  async connect(callback: (data: SensorData) => void): Promise<void> {
    if (!this.client) {
      throw new Error('MQTT client not configured. Call configure() first.');
    }
    this.onMessageCallback = callback;
    if (this.isConnected) {
      return;
    }
    // wait for the actual 'connect' event
    return new Promise((resolve, reject) => {
      this.client!.once('connect', () => {
        this.isConnected = true;
        resolve();
      });
      this.client!.once('error', reject);
    });
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      return new Promise((resolve, reject) => {
        this.client!.end(false, {}, (err) => {
          if (err) {
            console.error('MQTT Disconnect Error:', err);
            reject(err);
          } else {
            console.log('Disconnected from MQTT broker.');
            this.isConnected = false;
            resolve();
          }
        });
      });
    }
  }
}

export default new MQTTService();
