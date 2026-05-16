# 📊 Results & Sample Output

Real-world output from the Automated Irrigation System during a live test run.

---

## 🔌 ESP32 Serial Monitor Output

Captured from Arduino IDE Serial Monitor (115200 baud) during a normal operating cycle:

```
Connecting to Wi-Fi....
WiFi Connected!
Syncing time via NTP.....
Time synchronized!
Fetching device location via IP...
Location: 12.971599, 77.594604 (Bengaluru)
Connecting to AWS IOT..
AWS IoT Connected!

Raw Sensor Value: 2102 | Moisture: 22% | Solenoid Valve: ON
Raw Sensor Value: 2044 | Moisture: 26% | Solenoid Valve: ON
Raw Sensor Value: 1940 | Moisture: 34% | Solenoid Valve: ON
Raw Sensor Value: 1821 | Moisture: 43% | Solenoid Valve: ON
Raw Sensor Value: 1704 | Moisture: 52% | Solenoid Valve: ON
Raw Sensor Value: 1621 | Moisture: 58% | Solenoid Valve: ON
Raw Sensor Value: 1563 | Moisture: 63% | Solenoid Valve: OFF
```

> **Observation:** The ESP32 autonomously opened the valve at 22% (below the 30% threshold) and closed it once moisture exceeded 60% — no cloud command needed.

---

## 📡 MQTT Telemetry Payload

Published by ESP32 to topic `esp_32/Node_Response` every 5 seconds:

```json
{
  "noded": ["1A1D16"],
  "lat": "12.971599",
  "lon": "77.594604"
}
```

**Payload breakdown:**
| Field | Value | Meaning |
|---|---|---|
| `noded[0]` | `"1A1D16"` | Node `0x1A`, Response type `0x1D`, Moisture = `0x16` = **22%** |
| `lat` | `"12.971599"` | Device latitude (from IP geolocation) |
| `lon` | `"77.594604"` | Device longitude (from IP geolocation) |

---

## 🗄️ DynamoDB Record

After Lambda processes the MQTT message, a record is written to the `IrrigationStatus` table:

```json
{
  "zone": "zone1",
  "moisture": 22,
  "status": "START_WATER",
  "lastUpdated": "2026-04-21T08:32:15.000Z",
  "lat": "12.971599",
  "lon": "77.594604"
}
```

---

## 🎛️ Remote Control Packet

When "Start Irrigation" is clicked on the dashboard, the Next.js API publishes this to `esp_32/Node_Command`:

```json
{
  "nodec": ["1A1B111315"]
}
```

**Packet breakdown:**
| Bytes | Hex | Command |
|---|---|---|
| Byte 1 | `1A` | Target Node ID |
| Byte 2 | `1B` | Message type: Command |
| Byte 3 | `11` | ValveOn |
| Byte 4 | `13` | MotorOn |
| Byte 5 | `15` | MoistureRequest (trigger immediate response) |

---

## 🌦️ Live Weather API Response

`GET /api/weather?lat=12.9716&lon=77.5946`

```json
{
  "temperature": 31,
  "humidity": 68,
  "uvIndex": 7.2,
  "weatherCode": 2,
  "weatherLabel": "Partly Cloudy",
  "windSpeed": 14,
  "unit": "°C"
}
```

---

## 🌡️ Dashboard Live Status

`GET /api/status` — response from DynamoDB scan:

```json
[
  {
    "zone": "zone1",
    "moisture": 58,
    "status": "START_WATER",
    "lastUpdated": "2026-04-21T08:37:45.000Z",
    "lat": "12.971599",
    "lon": "77.594604"
  }
]
```

---

## 📌 Key Observations from Testing

| Scenario | Result |
|---|---|
| Moisture below 30% | ESP32 autonomously opens valve — confirmed in serial output |
| Moisture above 60% | ESP32 autonomously closes valve — no cloud intervention |
| Dashboard "Start" button | Hex packet received by ESP32 within ~200ms via MQTT |
| Weather widget location | Correctly reflects the ESP32's physical location (Bengaluru) |
| OLED display | Shows live moisture %, solenoid state, time, and AWS connection status |
| NTP before TLS | Without time sync, AWS rejects the TLS handshake — syncing first resolves this |
