import mqtt from 'mqtt';
import * as fs from 'fs';

export type SensorData = {
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope: {
    x: number;
    y: number;
    z: number;
  };
  timestamp: number;
};

export type MQTTConfig = {
  brokerUrl: string;
  username?: string;
  password?: string;
  clientId: string;
  topic: string;
};

class MQTTService {
  private client: mqtt.MqttClient | null = null;
  private onMessageCallback: ((data: SensorData) => void) | null = null;
  private config: MQTTConfig | null = null;
  private isConnected: boolean = false;
  private sensorDataArray: SensorData[] = [];
  private dataIndex: number = 0;

  configure(config: MQTTConfig): void {
    this.config = config;
  }

  connect(onMessageCallback: (data: SensorData) => void): Promise<void> {
    if (!this.config) {
      return Promise.reject(new Error('MQTT not configured'));
    }

    return new Promise((resolve, reject) => {
      try {
        console.log(`Connecting to MQTT broker: ${this.config?.brokerUrl}`);
        
        this.client = mqtt.connect(this.config.brokerUrl, {
          clientId: this.config.clientId,
          username: this.config.username,
          password: this.config.password
        });

        this.onMessageCallback = onMessageCallback;

        this.client.on('connect', () => {
          console.log('Connected to MQTT broker');
          
          if (this.config && this.client) {
            this.client.subscribe(this.config.topic, (err) => {
              if (err) {
                console.error('Failed to subscribe to topic:', err);
                reject(err);
              } else {
                console.log(`Subscribed to topic: ${this.config.topic}`);
                this.loadSensorDataFromFile();
                resolve();
              }
            });
          }
        });

        this.client.on('message', (topic, message) => {
          try {
            const parsedData: SensorData = JSON.parse(message.toString());
            if (this.onMessageCallback) {
              this.onMessageCallback(parsedData);
            }
          } catch (error) {
            console.error('Error parsing MQTT message:', error);
          }
        });

        this.client.on('error', (err) => {
          console.error('MQTT connection error:', err);
          reject(err);
        });
      } catch (error) {
        console.error('Error connecting to MQTT broker:', error);
        reject(error);
      }
    });
  }

  private loadSensorDataFromFile(): void {
    try {
      const jsonData = fs.readFileSync('sensor_data.json', 'utf-8');
      this.sensorDataArray = JSON.parse(jsonData);
      this.startSendingSensorData();
    } catch (error) {
      console.error('Error reading sensor data JSON file:', error);
    }
  }

  private startSendingSensorData(): void {
    if (!this.onMessageCallback || this.sensorDataArray.length === 0) return;
    
    const interval = setInterval(() => {
      if (!this.isConnected || !this.onMessageCallback) {
        clearInterval(interval);
        return;
      }

      const data = this.sensorDataArray[this.dataIndex];
      if (data) {
        this.onMessageCallback(data);
        this.dataIndex = (this.dataIndex + 1) % this.sensorDataArray.length;
      }
    }, 1000);
  }

  disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.client && this.isConnected) {
        this.client.end(true, () => {
          this.isConnected = false;
          this.onMessageCallback = null;
          console.log('Disconnected from MQTT broker');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  isConnectedToBroker(): boolean {
    return this.isConnected;
  }
}

const mqttService = new MQTTService();
export default mqttService;
