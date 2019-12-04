#include <DHT_U.h>
#include <DHT.h>

#include <pt.h>

#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

//Communication constants
const char* ssid = "ssid_here";
const char* password = "wifi_password_here";
const char* server = "http://192.168.0.216:5050/arduino";
String ID = "/plant_1";
#define DHTTYPE DHT22
#define DHTPIN D6

//Sensors
int moistureSensorPin = D0;
int photoSensorPin = D2;
int heatSensorPin = D1;
int heatSensor = D6;

//Relays
int heatPadRelayPin2 = D5;
int heatPadRelayPin = D4;
int SolenoidRelayPin = D3;

//States
bool heatPadState = false;
bool solenoidState = false;
bool lightState = false;

//threads
static struct pt webServer, sensors;

DHT dht(DHTPIN, DHTTYPE);

ESP8266WebServer Server(80);

void handlePadOverride() {
  heatPadState = !heatPadState;
  handleRelayStates();
  Server.sendHeader("Access-Control-Allow-Origin", "*");
  Server.send(200, "text/plain", "Heat pad state changed");
}

void handleSolenoidOverride() {
  solenoidState = !solenoidState;
  handleRelayStates();
  Server.sendHeader("Access-Control-Allow-Origin", "*");
  Server.send(200, "text/plain", "Solenoid state changed");
}

void handleLightOverride() {
  lightState = !lightState;
  handleRelayStates();
  Server.sendHeader("Access-Control-Allow-Origin", "*");
  Server.send(200, "text/plain", "Light state changed");
}

void sendSensorData(String endPoint, int sensor) {
  digitalWrite(sensor, HIGH);
  HTTPClient http;

  Serial.println(server + ID + endPoint);
  http.begin(server + ID + endPoint);
  http.addHeader("Content-Type", "text/plain");

  int httpCode = http.POST(String(analogRead(A0)));

  Serial.println(endPoint + ": " + httpCode);

  http.end();
  digitalWrite(sensor, LOW);
}

void sendTempAndHumidityData() {
  digitalWrite(heatSensorPin, HIGH);
  delay(1000);
  
  HTTPClient http;
  
  http.begin(server + ID + "/temp");
  http.addHeader("Content-Type", "text/plain");

  int httpCode = http.POST(String(dht.readTemperature(true)));

  http.end();

  http.begin(server + ID + "/humidity");
  http.addHeader("Content-Type", "text/plain");

  int httpCode2 = http.POST(String(dht.readHumidity()));

  http.end();
  digitalWrite(heatSensorPin, LOW);
}

void connectToServer() {
  HTTPClient http;

  http.begin(server + ID + "/connect");
  http.addHeader("Content-Type", "text/plain");

  int httpCode = http.POST(WiFi.localIP().toString());

  http.end();
}

String getState(String endPoint) {
  HTTPClient http;

  http.begin(server + ID + endPoint);

  int httpCode = http.GET();
  String value = http.getString();
  
  http.end();
  
  if (httpCode == 200) {
    return value;
  }

  return "ERROR";
}

void sendMoistureData() {
  sendSensorData("/moisture", moistureSensorPin);
}

void sendPhotoData() {
  sendSensorData("/photoSensor", photoSensorPin);
}

void shouldTurnOnHeatPads() {
  String state = getState("/heat");

  if (state == "ON") {
    heatPadState = true;
  } else if (state == "OFF") {
    heatPadState = false;
  }

  Serial.print("Heat pad is on: ");
  Serial.println(heatPadState);
}

void shouldOpenSolenoid() {
  String state = getState("/solenoid");

  if (state == "ON") {
    solenoidState = true;
  } else if (state == "OFF") {
    solenoidState = false;
  }

  Serial.print("Solenoid is open: ");
  Serial.println(solenoidState);
}

void shouldTurnOnLight() {
  String state = getState("/light");

  if (state == "ON") {
    lightState = true;
  } else if (state == "OFF") {
    lightState = false;
  }

  Serial.print("Light is on: ");
  Serial.println(lightState);
}

void handleRelayStates() {
  if (solenoidState) {
    digitalWrite(SolenoidRelayPin, HIGH);
  } else {
    digitalWrite(SolenoidRelayPin, LOW);
  }

  if (heatPadState) {
    digitalWrite(heatPadRelayPin, HIGH);
    digitalWrite(heatPadRelayPin2, HIGH);
    
  } else {
    digitalWrite(heatPadRelayPin, LOW);
    digitalWrite(heatPadRelayPin2, LOW);
  }
}

static int serverThread(struct pt *pt) {
  static unsigned long timestamp = 0;
  PT_BEGIN(pt);

  while (true) {
    PT_WAIT_UNTIL(pt, millis() - timestamp > 0);
    timestamp = millis();
    Server.handleClient();
  }

  PT_END(pt);
}

static int sensorThread(struct pt *pt, int interval) {
  static unsigned long timestamp = 0;
  PT_BEGIN(pt);

  while (true) {
    PT_WAIT_UNTIL(pt, millis() - timestamp > interval);
    timestamp = millis();
    sendMoistureData();
    sendPhotoData();
    sendTempAndHumidityData();
    shouldTurnOnHeatPads();
    shouldOpenSolenoid();
    shouldTurnOnLight();
    handleRelayStates();
  }

  PT_END(pt);
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  WiFi.begin(ssid, password);

  pinMode(D0, OUTPUT);
  pinMode(D1, OUTPUT);
  pinMode(D2, OUTPUT);
  pinMode(D3, OUTPUT);
  pinMode(D4, OUTPUT);
  pinMode(D5, OUTPUT);

  digitalWrite(D1, HIGH);
  
  dht.begin();
  
  Serial.print("Connecting to WIFI");

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("\n");
  Serial.println("Connected!!!");
  Serial.println("IP Address:\t");
  Serial.println(WiFi.localIP());

  Server.on("/heat_override", HTTP_GET, []() {
    handlePadOverride();
  });
  Server.on("/heat_override", HTTP_OPTIONS, []() {
    Server.sendHeader("Access-Control-Allow-Origin", "*");
    Server.send(204);
  });
  
  Server.on("/solenoid_override", HTTP_GET, []() {
    handleSolenoidOverride();
  });
  Server.on("/solenoid_override", HTTP_OPTIONS, []() {
    Server.sendHeader("Access-Control-Allow-Origin", "*");
    Server.send(204);
  });
  
  Server.on("/light_override", HTTP_GET, []() {
    handleLightOverride();
  });
  Server.on("/light_override", HTTP_OPTIONS, []() {
    Server.sendHeader("Access-Control-Allow-Origin", "*");
    Server.send(204);
  });

  Server.begin();

  connectToServer();
  
  PT_INIT(&webServer);
  PT_INIT(&sensors);
}

void loop() {
  serverThread(&webServer);
  sensorThread(&sensors, 300000);
}
