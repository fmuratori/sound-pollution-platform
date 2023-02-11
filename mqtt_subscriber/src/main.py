from datetime import datetime, timezone 
import paho.mqtt.client as mqtt
import pymongo
from bson.objectid import ObjectId
import logging

logging.basicConfig(level=logging.INFO)

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client.sound_pollution

def on_connect(client, userdata, flags, code):
    if code == 0:
        print("Connected to MQTT Broker")
    else:
        print(f"Failed to connect, return code {code}\n")

    client.subscribe("sound_pollution")

# callback for when a message is published
def on_message(client, userdata, msg):
    logging.info(f"Received telemetry from client {client}. Payload: {msg.payload}")
    msg_metadata, msg_data = str(msg.payload.decode('ASCII')).split("\t")
    name, gps_lat, gps_lng = msg_metadata.strip().split(" ")
    msg_data = eval(msg_data)

    # check if meter is already present in the database
    meter = db.meters.find_one(
        {"device_name": name},
    )

    if meter is None:
        logging.info("Adding new document into meters collection...")
        db.meters.insert_one({
            "device_name": name,
            "gps_lat": float(gps_lat),
            "gps_lng": float(gps_lng),
            "data": [
                {
                    "datetime": datetime.fromisoformat(item[0]),
                    "value": int(item[1])
                } for item in msg_data
            ],
            "last_update": datetime.now(timezone.utc),
            "active_since": datetime.now(timezone.utc)
        })
    else:
        logging.info("Updating existing document...")
        db.meters.update_one(
            {"device_name" : name}, { 
                "$set": {
                    "last_update": datetime.now(timezone.utc)
                },
                "$push" : { 
                    "data" : { 
                        "$each" : [
                            {
                                "value": int(item[1]), 
                                "datetime" : datetime.fromisoformat(item[0]),
                            } for item in msg_data
                        ]
                    } 
                }
            }, upsert=True
        )


client = mqtt.Client("test-sub-client")
client.on_connect = on_connect
client.on_message = on_message

client.connect("localhost", 1883)

# run the loop to process incoming messages
client.loop_forever()