Servo myservo; // servo object to control servo
int pos = 50; // servo position

void setup()
{
  Particle.function("toggle_light",switchToggle);
  myservo.attach(D0);  // attaches the servo on the D0 pin to the servo object
  // Only supported on pins that have PWM
  myservo.write(pos);  
}

int switchToggle(String command) {
    if (command=="on") {
        for(pos; pos < 95; pos+=2) // goes from 0 degrees to 180 degrees
        {                          // in steps of 2 degree
            myservo.write(pos);    // tell servo to go to position in variable 'pos'
            delay(15);             // waits 15ms for the servo to reach the position
        }
    }
    else if (command=="off") {
        for(pos; pos > 50; pos-= 2) // goes from 0 degrees to 180 degrees
        {                           // in steps of 2 degree
            myservo.write(pos);     // tell servo to go to position in variable 'pos'
            delay(15);              // waits 15ms for the servo to reach the position
        }
    }
    else {
        return -1;
    }
}

void loop() {}