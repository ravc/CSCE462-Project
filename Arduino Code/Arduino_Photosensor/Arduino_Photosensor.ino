// Initialize the variables
int photoRPin = 0;
int lightLevel;

void setup() {
  // One-time setup. 9600 is a value that is called the "baud rate"
  Serial.begin(9600);
}

void loop() {
  // Collect a data point
  lightLevel=analogRead(photoRPin);

  // Send the adjusted Light level result to Serial port
  Serial.println(lightLevel);

  // Slow down the transmission to keep the call-stack down. 500ms!
  delay(500);
}
