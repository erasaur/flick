int led1 = D0;
int led2 = D1;
int ledX = D7;

void setup()
{
  // configure pins
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(ledX, OUTPUT);

  // particle functions (called over cloud)
  Particle.function("toggle_light",lightToggle);
  Particle.function("toggle_music",musicToggle);

  // initial outputs
  digitalWrite(led1, LOW);
  digitalWrite(led2, LOW);
  digitalWrite(ledX, LOW);
}

void loop() {} // noop

int lightToggle(String command) {
  if (command=="on") {
    digitalWrite(led1,HIGH);
    digitalWrite(ledX,HIGH);
    return 1;
  }
  else if (command=="off") {
    digitalWrite(led1,LOW);
    digitalWrite(ledX,LOW);
    return 0;
  }
  else {
    return -1;
  }
}

int musicToggle(String command) {
  if (command=="on") {
    digitalWrite(led2,HIGH);
    digitalWrite(ledX,HIGH);
    return 1;
  }
  else if (command=="off") {
    digitalWrite(led2,LOW);
    digitalWrite(ledX,LOW);
    return 0;
  }
  else {
    return -1;
  }
}
