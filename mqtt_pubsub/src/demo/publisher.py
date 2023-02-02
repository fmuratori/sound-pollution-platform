import paho.mqtt.client as mqtt
import time

def on_connect(client, userdata, flags, code):
    if code == 0:
        print("Connected to MQTT Broker")
    else:
        print(f"Failed to connect, return code {code}\n")

    # Publish a message to a topic
    client.publish("sound_pollution", "123")


# Create an MQTT client
client = mqtt.Client("test-pub-client")
client.on_connect = on_connect

# Connect the client to the server
client.connect("localhost", 1883)

client.loop_forever()