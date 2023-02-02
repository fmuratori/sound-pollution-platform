int UPDATE_TIME = 1000;
int CHECK_TIME = 10;

int aSensorPin = A3; 
int aSensorValue = 0; 

int aValue = -1;
int aOldValue = 0; 

int timer = 0;
int currTime = 0;

void setup () {
  Serial.begin (9600);
}

void loop () {
  
  currTime = millis();

  if (currTime - timer > UPDATE_TIME) {
    if (aValue != aOldValue) {
      aOldValue = aValue;
      Serial.print("ANALOG ");
      Serial.println(aValue);;
      aValue = -1;
    }
    timer = currTime;
  }

  aSensorValue = analogRead(aSensorPin);
  if (aSensorValue > aValue)
    aValue = aSensorValue;

  delay(CHECK_TIME);
}

int valueToDecibel(int value) {
  int decibel = map(value, 782, 800, 40, 80);
  if (decibel < 40) return 40;
  if (decibel > 80) return 80;
  return decibel;
}

