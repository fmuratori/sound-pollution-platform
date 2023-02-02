import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, code):
    if code == 0:
        print("Connected to MQTT Broker")
    else:
        print(f"Failed to connect, return code {code}\n")

    client.subscribe("sound_pollution")

# callback for when a message is published
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))


client = mqtt.Client("test-sub-client")
client.on_connect = on_connect
client.on_message = on_message

client.connect("localhost", 1883)

# run the loop to process incoming messages
client.loop_forever()