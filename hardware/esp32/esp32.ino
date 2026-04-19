#include "secrets.h"
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <time.h>

#define AWS_IOT_PUBLISH_TOPIC   "esp_32/Node_Response"
#define AWS_IOT_SUBSCRIBE_TOPIC "esp_32/Node_Command"

// Hardware Constants
#define NodeId 0x1A
#define NodeCmd 0x1B
#define NodeResReq 0x1C
#define ValveOn 0x11
#define ValveOff 0x12
#define MotorOn 0x13
#define MotorOff 0x14
#define MoistureReq 0x15
#define NodeRes 0x1D

#define MOISTURE_PIN 34
#define PUMP_PIN 13
#define VALVE_PIN 12

// OLED settings
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Sensor Calibration Values
const int AIR_VAL = 2600;   // Calibrated: Air reading was originally ~45% with 3500
const int WATER_VAL = 1500; // Calibrated: Pure water

// Time zone offset in seconds (19800 = India Standard Time +05:30)
const long gmtOffset_sec = 19800;
const int daylightOffset_sec = 0;

WiFiClientSecure net = WiFiClientSecure();
PubSubClient client(net);

long lastMsg = 0;
int currentMoisturePercent = 0;
String pumpStatus = "2D"; // Default OFF (2D)
String valveStatus = "2B"; // Default Valve OFF (2B)

// Device geolocation (fetched via IP on boot)
String deviceLat = "";
String deviceLon = "";

void fetchGeoLocation() {
  Serial.println("Fetching device location via IP...");
  HTTPClient http;
  http.begin("http://ip-api.com/json/?fields=lat,lon,status,city");
  int httpCode = http.GET();

  if (httpCode == 200) {
    String payload = http.getString();
    JsonDocument geo;
    if (!deserializeJson(geo, payload)) {
      if (String((const char*)geo["status"]) == "success") {
        deviceLat = String((float)geo["lat"], 6);
        deviceLon = String((float)geo["lon"], 6);
        Serial.printf("Location: %s, %s (%s)\n", deviceLat.c_str(), deviceLon.c_str(), (const char*)geo["city"]);
      }
    }
  } else {
    Serial.printf("GeoLocation failed, HTTP code: %d\n", httpCode);
  }
  http.end();
}

void updateDisplay() {
  display.clearDisplay();
  
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  // Top row: Time + AWS Status
  display.setCursor(0, 0);
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    display.print("Time Sync");
  } else {
    display.printf("%02d:%02d:%02d", timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec);
  }

  display.setCursor(80, 0);
  if (client.connected()) {
    display.print("AWS: OK");
  } else {
    display.print("AWS: ERR");
  }

  // Draw separator line
  display.drawLine(0, 10, 128, 10, SSD1306_WHITE);

  // Middle: Moisture indicator
  display.setCursor(0, 18);
  display.setTextSize(1);
  display.print("Live Moisture:");
  
  display.setCursor(0, 32);
  display.setTextSize(3);
  display.printf("%d%%", currentMoisturePercent);

  // Solenoid Status
  display.setCursor(80, 18);
  display.setTextSize(1);
  display.print("Solenoid:");

  display.setCursor(80, 32);
  display.setTextSize(2);
  if (digitalRead(VALVE_PIN) == HIGH) {
    display.print("ON");
  } else {
    display.print("OFF");
  }
  
  display.display();
}

void connectAWS() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi Connected!");

  // AWS requires an accurate clock to validate TLS certificates.
  // We MUST sync the time before attempting to connect.
  Serial.println("Syncing time via NTP...");
  configTime(gmtOffset_sec, daylightOffset_sec, "pool.ntp.org", "time.nist.gov");
  
  time_t now = time(nullptr);
  while (now < 24 * 3600) { // Wait until year is > 1970
    delay(500);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println("");
  Serial.println("Time synchronized!");
  
  // Fetch device location now that time is synced (HTTP needs stable clock)
  fetchGeoLocation();

  updateDisplay(); // Pushes time to the OLED immediately!

  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  client.setServer(AWS_IOT_ENDPOINT, 8883);
  client.setBufferSize(1024);
  client.setCallback(callback);

  Serial.println("Connecting to AWS IOT");

  while (!client.connect(THINGNAME)) {
    // Keep sensor live while trying to connect
    int sensorValue = analogRead(MOISTURE_PIN);
    currentMoisturePercent = map(sensorValue, AIR_VAL, WATER_VAL, 0, 100);
    if (currentMoisturePercent < 0) currentMoisturePercent = 0;
    if (currentMoisturePercent > 100) currentMoisturePercent = 100;

    Serial.print(".");
    Serial.print(" Error Code: ");
    Serial.println(client.state());
    updateDisplay(); // Keeps OLED refreshed while polling
    delay(2000);
  }

  if (!client.connected()) {
    Serial.println("AWS IoT Timeout!");
    return;
  }

  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
  Serial.println("AWS IoT Connected!");
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  String messageTemp;
  for (int i = 0; i < length; i++) {
    messageTemp += (char)payload[i];
  }
  Serial.println(messageTemp);

  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, messageTemp);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  if (doc.containsKey("nodec")) {
    JsonArray nodecArray = doc["nodec"];
    String packetHex = nodecArray[0].as<String>();
    Serial.println("Received Hex Command Packet: " + packetHex);

    if (packetHex.length() >= 6) { // Minimum NodeID + MsgType + Command
      String nodeIdStr = packetHex.substring(0, 2); // First byte
      int targetNodeId = (int) strtol(nodeIdStr.c_str(), NULL, 16);
      
      String msgTypeStr = packetHex.substring(2, 4); // Second byte
      int msgType = (int) strtol(msgTypeStr.c_str(), NULL, 16);

      if (targetNodeId == NodeId && msgType == NodeCmd) {
        // Iterate through all sequenced commands
        for (int i = 4; i < packetHex.length(); i += 2) {
          String commandHexStr = packetHex.substring(i, i + 2);
          int commandByte = (int) strtol(commandHexStr.c_str(), NULL, 16);
          
          if (commandByte == ValveOn) {
            digitalWrite(VALVE_PIN, HIGH);
            valveStatus = "2A";
          } else if (commandByte == ValveOff) {
            digitalWrite(VALVE_PIN, LOW);
            valveStatus = "2B";
          } else if (commandByte == MotorOn) {
            digitalWrite(PUMP_PIN, HIGH);
            pumpStatus = "2C";
          } else if (commandByte == MotorOff) {
            digitalWrite(PUMP_PIN, LOW);
            pumpStatus = "2D";
          } else if (commandByte == MoistureReq) {
            publishMessage();
          }
        }
      }
    }
  }
}

#define I2C_SDA 21
#define I2C_SCL 22

void setup() {
  Serial.begin(115200);
  pinMode(MOISTURE_PIN, INPUT);
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(VALVE_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW); // Ensure pump is OFF on boot
  digitalWrite(VALVE_PIN, LOW); // Ensure valve is OFF on boot
  
  // Explicitly start I2C pins for DOIT ESP32
  Wire.begin(I2C_SDA, I2C_SCL);
  
  // Initialize OLED
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("SSD1306 allocation failed"));
  } else {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0,0);
    display.println("Connecting WiFi...");
    display.display();
  }

  connectAWS();
  
  // Initial Display Update
  updateDisplay();
}

void publishMessage() {
  char moistureHex[3];
  sprintf(moistureHex, "%02X", currentMoisturePercent);

  // 3-byte payload: NodeID + NodeRes MsgType + Moisture Val
  char packet[7];
  sprintf(packet, "%02X%02X%s", NodeId, NodeRes, moistureHex);

  JsonDocument doc;
  JsonArray noded = doc.createNestedArray("noded");
  noded.add(packet);

  // Include ESP32 field location for weather in the web app
  if (deviceLat.length() > 0) {
    doc["lat"] = deviceLat;
    doc["lon"] = deviceLon;
  }

  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);

  client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
}

void loop() {
  client.loop();

  long now = millis();
  
  // Update Display and Publish telemetry every 5 seconds
  if (now - lastMsg > 5000) {
    lastMsg = now;
    
    int sensorValue = analogRead(MOISTURE_PIN);
    
    currentMoisturePercent = map(sensorValue, AIR_VAL, WATER_VAL, 0, 100);
    if (currentMoisturePercent < 0) currentMoisturePercent = 0;
    if (currentMoisturePercent > 100) currentMoisturePercent = 100;

    // Local automatic irrigation logic based on moisture levels
    if (currentMoisturePercent < 30) {
      digitalWrite(VALVE_PIN, HIGH);
    } else if (currentMoisturePercent >= 60) {
      digitalWrite(VALVE_PIN, LOW);
    }

    Serial.print("Raw Sensor Value: ");
    Serial.print(sensorValue);
    Serial.print(" | Moisture: ");
    Serial.print(currentMoisturePercent);
    Serial.print("% | Solenoid Valve: ");
    if (digitalRead(VALVE_PIN)) {
      Serial.println("ON");
    } else {
      Serial.println("OFF");
    }

    updateDisplay();
    publishMessage();
  }
}
