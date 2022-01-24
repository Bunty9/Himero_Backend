import paho.mqtt.client as mqtt
import socketio as socket
sio = socket.Client()
# ip and port of backend api
sio.connect('http://192.168.1.50:8000',
            auth={'token': 'token1234', 'id': 'raspberyypi'})  # add token for socket auth (also add the token in .env of backend)


# The callback for when the client connects to the broker
def on_connect(client, userdata, flags, rc):
    # Print result of connection attempt
    print("Connected with result code {0}".format(str(rc)))
    # Subscribe to the topic “digitest/test1”, receive any messages published on it
    client.subscribe("esptopic")


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print("Message received-> " + msg.topic + " " +
          str(msg.payload))  # Print a received msg
    sio.emit('esptopic', {'msg': str(msg.payload)})


# Create instance of client with client ID “digi_mqtt_test”
client = mqtt.Client("espComeback")
client.on_connect = on_connect  # Define callback function for successful connection
client.on_message = on_message  # Define callback function for receipt of a message
# client.connect("m2m.eclipse.org", 1883, 60)  # Connect to (broker, port, keepalive-time)
client.connect('localhost', 1883)
client.loop_forever()  # Start networking daemon
