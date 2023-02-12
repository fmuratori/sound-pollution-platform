import logging 
from time import sleep
from threading import Thread, Event

import paho.mqtt.client as mqtt

class MqttPublisherClient(Thread): 
    topic = None
    client = None
    buffer = None
    broker_port = None
    broker_ip = None
    name = None
    lat = None
    lng = None
    update_delta = None

    def __init__(self, broker_port, broker_ip, topic, name, lat, lng, buffer, update_delta):
        super().__init__()

        self.topic = topic
        self.buffer = buffer
        self.broker_port = broker_port
        self.broker_ip = broker_ip
        self.name = name
        self.coord_lat = lat
        self.coord_lng = lng
        self.update_delta = update_delta

        # Create an MQTT client
        self.client = mqtt.Client(self.name)

    def connect(self):
        logging.info(f"[MQTT] Connecting to the broker ...")
        self.client.connect(self.broker_ip, self.broker_port, keepalive=600)
        
    def disconnect(self):
        logging.info(f"[MQTT] Disconnecting from the broker ...")
        self.client.disconnect()

    def run(self): 
        self.connect()      
        while True:
            if self.buffer.is_empty():
                logging.info(f"[MQTT] Empty buffer, published nothing to the broker.")
            # elif not self.client.is_connected():
            #     logging.info(f"[MQTT] Client disconnected, can't publish data.")
            #     self.connect()
            else:
                text = self.name + " " + \
                    self.coord_lat + " " + \
                    self.coord_lng + "\t" + \
                    str(self.buffer.flush_all())

                self.client.publish(self.topic, text, 2)

                logging.info(f"[MQTT] Published data to the broker. Data: {text}")

            sleep(self.update_delta)