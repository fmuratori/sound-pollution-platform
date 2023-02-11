unsigned long UPDATE_TIME = 60000;
unsigned long CHECK_TIME = 100;
int LED_PIN = 7;

int aSensorPin = A3; 
int aSensorValue = 0; 

int aValue = -1;
int aOldValue = 0; 

unsigned long timer = 0;
unsigned long currTime = 0;

void setup () {
  Serial.begin (9600);
  pinMode(LED_PIN, OUTPUT);

}

void loop () {
  
  currTime = millis();

  /* 
   * Ogni UPDATE_TIME millisecondi verifico il livello di rumore 
   * massimo ottenuto e decido se inviarlo oppure no 
   */
  if (currTime - timer > UPDATE_TIME) {
    if (aValue != aOldValue) {
      
      /*
       * Dettaglio implementativo poco importante - non è inviata
       * la prima misurazione registrata
       */
      if (aOldValue != 0) {
        /* 
        * Invio dei livelli di rumore in seriale
        */
        int decibel = deltaValueToDecibel(aOldValue, aValue);
        Serial.print("ANALOG ");
        Serial.println(decibel);

        /*
        * Impostazione led di allarme rumore elevato
        */
        if (decibel >= 75)
          digitalWrite(LED_PIN, HIGH);   
        else 
          digitalWrite(LED_PIN, LOW);
      }

      aOldValue = aValue;
      aValue = -1;
    }
    timer = currTime;
  }

  /* 
   * Cattura il massimo livello di rumore registrato in un 
   * intervallo di lunghezza UPDATE_TIME millisecondi 
   */
  aSensorValue = analogRead(aSensorPin);
  if (aSensorValue > aValue)
    aValue = aSensorValue;

  delay(CHECK_TIME);
}

/* 
 * Work around - il delta tra misurazioni successive definisce
 * l'intensità del rumore tra 40 e 80 db 
 */
int deltaValueToDecibel(int oldValue, int value) {
  int delta = value - oldValue;
  if (delta > 0) {
    int decibel = map(delta, 0, 8, 40, 80);
    if (decibel < 40) return 40;
    if (decibel > 80) return 80;
    return decibel;
    
  } else return 40;
}

/* Tentativo di utilizzo dei valori ottenuti dal dispositivo */
// int valueToDecibel(int value) {
//   int decibel = map(value, 796, 800, 40, 80);
//   if (decibel < 40) return 40;
//   if (decibel > 80) return 80;
//   return decibel;
// }

