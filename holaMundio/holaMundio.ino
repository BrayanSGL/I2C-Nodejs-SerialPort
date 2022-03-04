char dato;
int led=13;
void setup() {
  // put your setup code here, to run once:
pinMode(led, OUTPUT);
Serial.begin(9600);

}

void loop() {
  if(Serial.available()>0){
  dato=Serial.read();
if(dato=='1'){
  digitalWrite(led, HIGH);
  }
else if(dato=='0'){
digitalWrite(led, LOW);
    }
    
    }
    delay(500);
 }
