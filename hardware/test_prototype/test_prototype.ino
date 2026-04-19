#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define MOISTURE_PIN 34
#define I2C_SDA 21
#define I2C_SCL 22

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Default calibration values (you can adjust these later)
int AIR_VAL = 3500;   
int WATER_VAL = 1500; 

void setup() {
  Serial.begin(115200);
  pinMode(MOISTURE_PIN, INPUT);
  
  // Explicitly initialize I2C pins for DOIT ESP32 DevKit V1
  Wire.begin(I2C_SDA, I2C_SCL);
  
  // Initialize the OLED
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("OLED initialization failed!"));
    for(;;); // Loop forever if OLED fails
  }
  
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0,0);
  display.println("Hardware");
  display.println("Test OK!");
  display.display();
  delay(2000);
}

void loop() {
  // Read the analog signal from the moisture sensor
  int sensorValue = analogRead(MOISTURE_PIN);
  
  // Convert Raw signal to a 0-100% scale
  int percent = map(sensorValue, AIR_VAL, WATER_VAL, 0, 100);
  
  // Constrain the percentage so it doesn't go below 0 or above 100
  if(percent < 0) percent = 0;
  if(percent > 100) percent = 100;

  // Print to the Arduino IDE Serial Monitor (Tools > Serial Monitor)
  Serial.print("Raw Value: ");
  Serial.print(sensorValue);
  Serial.print("  | Moisture: ");
  Serial.print(percent);
  Serial.println("%");

  // Output to the OLED Display
  display.clearDisplay();
  
  display.setTextSize(1);
  display.setCursor(0,0);
  display.println("--- SENSOR TEST ---");
  
  display.setCursor(0, 20);
  display.print("Raw Analog: ");
  display.println(sensorValue);
  
  display.setCursor(0, 40);
  display.print("Moist: ");
  display.setTextSize(2);
  display.print(percent);
  display.println("%");
  
  display.display();
  
  // Update the screen every half second
  delay(500); 
}
