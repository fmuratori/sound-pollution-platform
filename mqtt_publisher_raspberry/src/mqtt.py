import logging 
from time import sleep
from threading import Thread, Event

from paho.mqtt import client as mqtt

MQTT_KEEP_ALIVE = 60.0

class TerminalPublisherClient(Thread):
    update_event = None

    def __init__(self, buffer, update_event):
        super().__init__()
        self.buffer = buffer
        self.update_event = update_event

    def run(self): 
        while True:
            if self.buffer.is_empty():
                logging.info(f"[TERMINAL] Empty buffer, published nothing to the broker.")
            else:
                text = str(self.buffer.flush_all())
                logging.info(f"[TERMINAL] Published data. PAYLOAD: {text} ")

            self.update_event.wait(MQTT_KEEP_ALIVE) # wait at most 60 seconds
            self.update_event.clear() 

class MqttPublisherClient(Thread): 
    topic = None
    client = None
    buffer = None
    broker_port = None
    broker_ip = None
    name = None
    lat = None
    lng = None
    update_event = None

    def __init__(self, broker_port, broker_ip, topic, name, lat, lng, buffer, update_event):
        super().__init__()

        self.topic = topic
        self.buffer = buffer
        self.broker_port = broker_port
        self.broker_ip = broker_ip
        self.name = name
        self.coord_lat = lat
        self.coord_lng = lng
        self.update_event = update_event
        self.is_connected = False

        # Create an MQTT client
        self.client = mqtt.Client(self.name)

    def on_connect(self, client, userdata, flags, rc):
        logging.info(f"[MQTT] Connected to the broker.")
        self.is_connected = True

    def on_disconnect(self, client, userdata, rc):
        logging.info(f"[MQTT] Could not connect with the broker.")
        self.is_connected = False
        
    def connect(self):
        logging.info(f"[MQTT] Connecting to the broker ...")

        try:
            self.client.on_connect = self.on_connect
            self.client.on_disconnect = self.on_disconnect
            self.client.connect(self.broker_ip, self.broker_port, keepalive=int(MQTT_KEEP_ALIVE*10))
            
            self.client.loop_start()
        except ConnectionRefusedError:
            logging.info(f"[MQTT] Broker is unreachable.")


    def disconnect(self):
        logging.info(f"[MQTT] Disconnecting from the broker ...")
        self.client.disconnect()

    def run(self): 
        self.connect()      
        while True:
            if self.buffer.is_empty():
                logging.info(f"[MQTT] Empty buffer, published nothing to the broker.")
            elif not self.is_connected: # attempt reconnectino with broker
                logging.info(f"[MQTT] Client disconnected. Trying reconnection ...")
                self.connect()
            else:
                text = self.name + " " + \
                    self.coord_lat + " " + \
                    self.coord_lng + "\t" + \
                    str(self.buffer.flush_all())

                self.client.publish(self.topic, text, 2)

                logging.info(f"[MQTT] Published data to the broker. Data: {text}")

            self.update_event.wait(MQTT_KEEP_ALIVE) # wait at most 60 seconds
            self.update_event.clear()

