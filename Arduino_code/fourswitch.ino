#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>


#include <AceButton.h> // https://github.com/bxparks/AceButton
using namespace ace_button;

//Switch
const int BUTTON1_PIN = 14;
const int BUTTON2_PIN = 12;
const int BUTTON3_PIN = 13;
const int BUTTON4_PIN = 3;
//Relay
const int RELAY1_PIN = 5;
const int RELAY2_PIN = 4;
const int RELAY3_PIN = 0;
const int RELAY4_PIN = 2;

//get device id from mongo database
String device_ID_1 = "deviceid1";
String device_ID_2 = "deviceid2";
String device_ID_3 = "deviceid3";
String device_ID_4 = "deviceid4";
//get room id from mongo database
String roomid = "roomid";

ButtonConfig config1;
AceButton button1(&config1);
ButtonConfig config2;
AceButton button2(&config2);
ButtonConfig config3;
AceButton button3(&config3);
ButtonConfig config4;
AceButton button4(&config4);

void handleEvent1(AceButton*, uint8_t, uint8_t);
void handleEvent2(AceButton*, uint8_t, uint8_t);
void handleEvent3(AceButton*, uint8_t, uint8_t);
void handleEvent4(AceButton*, uint8_t, uint8_t);


// WiFi
const char *ssid = "ssid"; // Enter your WiFi name
const char *password = "password";  // Enter WiFi password
// MQTT Broker
const char *mqtt_broker = "192.168.1.40"; // Replace with your Raspberry Pi's ip address
const char *topic = "test";
const char *espTopic = "esptopic";
const int mqtt_port = 1883; 

WiFiClient espClient;
PubSubClient client(espClient);
void setup() {

  pinMode(BUTTON1_PIN, INPUT_PULLUP); // INPUT_PULLUP so no need a 10K resistor
  pinMode(BUTTON2_PIN, INPUT_PULLUP); // INPUT_PULLUP so no need a 10K resistor
  pinMode(BUTTON3_PIN, INPUT_PULLUP); // INPUT_PULLUP so no need a 10K resistor
  pinMode(BUTTON4_PIN, INPUT_PULLUP); // INPUT_PULLUP so no need a 10K resistor
  
  //setup the relays
  pinMode(RELAY1_PIN, OUTPUT);
  pinMode(RELAY2_PIN, OUTPUT);
  pinMode(RELAY3_PIN, OUTPUT);
  pinMode(RELAY4_PIN, OUTPUT);
  
  digitalWrite(RELAY1_PIN,HIGH);
  digitalWrite(RELAY2_PIN,HIGH);
  digitalWrite(RELAY3_PIN,HIGH);
  digitalWrite(RELAY4_PIN,HIGH);

  config1.setEventHandler(button1Handler);
  config2.setEventHandler(button2Handler);
  config3.setEventHandler(button3Handler);
  config4.setEventHandler(button4Handler);


  button1.init(BUTTON1_PIN);
  button2.init(BUTTON2_PIN);
  button3.init(BUTTON3_PIN);
  button4.init(BUTTON4_PIN);
  
 // Set software serial baud to 115200;
 Serial.begin(115200);
 pinMode(RELAY_PIN, OUTPUT);
 digitalWrite(RELAY_PIN, HIGH);
 
 // connecting to a WiFi network
 WiFi.begin(ssid, password);
 while (WiFi.status() != WL_CONNECTED) {
  delay(500);
  Serial.println("Connecting to WiFi..");
 }
 
 Serial.println("Connected to the WiFi network");
 
 //connecting to a mqtt broker
 client.setServer(mqtt_broker, mqtt_port);
 client.setCallback(callback);
 
 while (!client.connected()) {
 String client_id = "esp8266-client-";
 client_id += String(WiFi.macAddress());
 
 Serial.printf("The client %s connects to mosquitto mqtt broker\n", client_id.c_str());
 
 if (client.connect(client_id.c_str())) {
  Serial.println("Public emqx mqtt broker connected");
 } else {
  Serial.print("failed with state ");
  Serial.print(client.state());
  delay(2000);
 }
}
 
 // publish and subscribe

 client.subscribe(topic);
}

void setPowerState(String deviceId, bool stats) {

    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.createObject();
    root["roomid"] = roomid;
    root["deviceid"] = deviceId;
    root["status"] = stats;
    String output;
    
    root.printTo(output);
    char Buf[100];
    output.toCharArray(Buf, 100);
    client.publish(espTopic, Buf);
}


void callback(char *topic, byte *payload, unsigned int length) {
 
    String msg ="";
    for (int i = 0; i < length; i++) {
        msg.concat((char)payload[i]);
    }
    String deviceid = msg.substring(14,38);

    char json[200];
    msg.toCharArray(json,200);

    StaticJsonBuffer<300> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(json);
    // Test if parsing succeeds.
    if (!root.success()) {
        Serial.println("parseObject() failed");
        return;
    }
    const char* device = root["deviceid"];
    // Print values.
    Serial.println(device);
    const char* stats = root["status"];
    Serial.println(stats);

    if(String(stats) == "true") {
    Serial.println("switchon");
        turnOn(String(device));
    } else if(String(stats) == "false"){
        turnOff(String(device));
        Serial.println("switchoff");
    }
    msg ="";
    Serial.println();
}


void loop() {
 client.loop();
 
  button1.check();
  button2.check();
  button3.check();
  button4.check();
}



void button1Handler(AceButton* button, uint8_t eventType, uint8_t buttonState) {
  Serial.println("EVENT1");
  switch (eventType) {
    case AceButton::kEventPressed:
      Serial.println("kEventPressed");
      setPowerState(device_ID_1, true);
      digitalWrite(RELAY1_PIN, LOW);
      break;
    case AceButton::kEventReleased:
      Serial.println("kEventReleased");
      setPowerState(device_ID_1, false);
      digitalWrite(RELAY1_PIN, HIGH);
      break;
  }
}
void button2Handler(AceButton* button, uint8_t eventType, uint8_t buttonState) {
  Serial.println("EVENT2");
  switch (eventType) {
    case AceButton::kEventPressed:
      Serial.println("kEventPressed");
      setPowerState(device_ID_2, true);
      digitalWrite(RELAY2_PIN, LOW);
      break;
    case AceButton::kEventReleased:
      Serial.println("kEventReleased");
      setPowerState(device_ID_2, false);
      digitalWrite(RELAY2_PIN, HIGH);
      break;
  }
}

void button3Handler(AceButton* button, uint8_t eventType, uint8_t buttonState) {
  Serial.println("EVENT3");
  switch (eventType) {
    case AceButton::kEventPressed:
      Serial.println("kEventPressed");
      setPowerState(device_ID_3, true);
      digitalWrite(RELAY3_PIN, LOW);
      break;
    case AceButton::kEventReleased:
      Serial.println("kEventReleased");
      setPowerState(device_ID_3, false);
      digitalWrite(RELAY3_PIN, HIGH);
      break;
  }
}

void button4Handler(AceButton* button, uint8_t eventType, uint8_t buttonState) {
  Serial.println("EVENT4");
  switch (eventType) {
    case AceButton::kEventPressed:
      Serial.println("kEventPressed");
      setPowerState(device_ID_4, true);
      digitalWrite(RELAY4_PIN, LOW);
      break;
    case AceButton::kEventReleased:
      Serial.println("kEventReleased");
      setPowerState(device_ID_4, false);
      digitalWrite(RELAY4_PIN, HIGH);
      break;
  }
}


void turnOn(String deviceId) {
  if (deviceId == device_ID_1) // Device ID of first device
  {
    Serial.print("Turn on device id: ");
    Serial.println(deviceId);
    digitalWrite(RELAY1_PIN, LOW);
  }
  if (deviceId == device_ID_2) // Device ID of second device
  {
    Serial.print("Turn on device id: ");
    Serial.println(deviceId);
    digitalWrite(RELAY2_PIN, LOW);
  }
  if (deviceId == device_ID_3) // Device ID of third device
  {
    Serial.print("Turn on device id: ");
    Serial.println(deviceId);
    digitalWrite(RELAY3_PIN, LOW);
  }
  if (deviceId == device_ID_4) // Device ID of fourth device
  {
    Serial.print("Turn on device id: ");
    Serial.println(deviceId);
    digitalWrite(RELAY4_PIN, LOW);
  }else {
    Serial.print("Turn on for unknown device id: ");
    Serial.println(deviceId);    
  }
}
void turnOff(String deviceId) {
  if (deviceId == device_ID_1) // Device ID of first device
  {
    Serial.print("Turn off Device ID: ");
    Serial.println(deviceId);
    digitalWrite(RELAY1_PIN, HIGH);
  }
  if (deviceId == device_ID_2) // Device ID of second device
  {
    Serial.print("Turn off Device ID: ");
    Serial.println(deviceId);
    digitalWrite(RELAY2_PIN, HIGH);
  }
  if (deviceId == device_ID_3) // Device ID of third device
  {
    Serial.print("Turn off Device ID: ");
    Serial.println(deviceId);
    digitalWrite(RELAY3_PIN, HIGH);
  }
  if (deviceId == device_ID_4) // Device ID of fourth device
  {
    Serial.print("Turn off Device ID: ");
    Serial.println(deviceId);
    digitalWrite(RELAY4_PIN, HIGH);
  }
}