int SENSOR_PIN = A0;
int CHECK_TIME = 100;
int UPDATE_TIME = 6000;

int loudness = 0;
int maxLoudness = 0;
int oldLoudness = 0;
int decibel = 0;

unsigned long currTime;
unsigned long lastUpdate;
 
void setup() {
    Serial.begin(9600);
    currTime = millis();
    lastUpdate = millis();
}
 
void loop() {
  currTime =  millis();

  if (currTime - lastUpdate > UPDATE_TIME) {
    if (maxLoudness != oldLoudness) {
      decibel = mapLoudness(maxLoudness);
      Serial.print("ANALOG ");
      Serial.println(decibel);
      oldLoudness = maxLoudness;
      maxLoudness = 0;  
    }
    lastUpdate = currTime;
  }

  loudness = analogRead(SENSOR_PIN);
  if (loudness > maxLoudness) {
    maxLoudness = loudness;
  }
  delay(CHECK_TIME);
}

int mapLoudness(int amplitude) {
  if (amplitude < 40) return 40;
  if (amplitude < 80) return map(amplitude, 40, 80, 40, 60);
  if (amplitude < 120) return map(amplitude, 80, 120, 60, 75);
  return 80;
}