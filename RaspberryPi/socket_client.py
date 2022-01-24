import paho.mqtt.client as mqtt
import json
import socketio
sio = socketio.Client(logger=True, engineio_logger=True)

client = mqtt.Client('python')
client.connect("localhost", 1883)


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


@sio.event
def connect():
    print('connected to server')


@sio.event
def test(msg):
    print(msg)
    client.publish("test", json.dumps(msg))


if __name__ == '__main__':
    sio.connect('http://192.168.1.50:8000',  # ip and port address of your backend
                auth={'token': 'token1234', 'id': 'raspberyypi'})  # token for socket auth (also add this token in .env of backend)
    sio.wait()
    client.on_connect = on_connect  # Define callback function for successful connection
    client.on_message = on_message
    client.loop_forever()
