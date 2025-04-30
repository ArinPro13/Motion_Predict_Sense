#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <MPU6050.h>

const char* ssid = "your-SSID";
const char* password = "your-PASSWORD";
const char* mqtt_server = "your-mqtt-broker.com";

WiFiClient espClient;
PubSubClient client(espClient);
MPU6050 mpu;

void setup_wifi() {
  delay(10);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("ESP32Client")) break;
    delay(5000);
  }
}

void setup() {
  Serial.begin(115200);
  Wire.begin();
  mpu.initialize();

  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  String payload = "{";
  payload += "\"acceleration\":{\"x\":" + String(ax) + ",\"y\":" + String(ay) + ",\"z\":" + String(az) + "},";
  payload += "\"gyroscope\":{\"x\":" + String(gx) + ",\"y\":" + String(gy) + ",\"z\":" + String(gz) + "},";
  payload += "\"timestamp\":" + String(millis());
  payload += "}";

  client.publish("esp32/sensor_data", payload.c_str());
  delay(1000);
}
