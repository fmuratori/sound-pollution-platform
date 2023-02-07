import logging 
from time import sleep
from threading import Thread, Event

import paho.mqtt.client as mqtt

# TODO: gestire errori di rete
# TODO: fixare callback connection non richiamata

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

        # def on_connect(client, userdata, flags, code):
        #     logging.info("ASD")
        #     if code == 0:
        #         logging.info("[MQTT] Connected to MQTT Broker")
        #         self.is_connected = True
        #         self.connectionEvent.set()
        #     else:
        #         logging.info(f"[MQTT] Failed to connect, return code {code}\n")

        # self.client.on_connect = on_connect

    def connect(self):
        logging.info(f"[MQTT] Connecting to the broker ...")
        self.client.connect(self.broker_ip, self.broker_port)
        
    def disconnect(self):
        self.client.disconnect()

    def run(self): 
        self.connect()       

        while True:
            try:
                if not self.buffer.is_empty():
                    text = self.name + " " + \
                        self.coord_lat + " " + \
                        self.coord_lng + "\t" + \
                        str(self.buffer.flush_all())

                    self.client.publish(self.topic, text)

                    logging.info(f"[MQTT] Published data to the broker. Data: {text}")
                else:
                    logging.info(f"[MQTT] Empty buffer, published nothing to the broker.")
            finally:
                sleep(self.update_delta)