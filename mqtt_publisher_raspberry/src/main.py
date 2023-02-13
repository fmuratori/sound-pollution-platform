import os
import logging
from dotenv import load_dotenv

from threading import Event
from arduino import ChannelObserver
from mqtt import MqttPublisherClient, TerminalPublisherClient
from buffer import BoundedBuffer
import logging
load_dotenv()
logging.basicConfig(level=logging.INFO)

if __name__ == '__main__':

    buffer_update_event = Event()

    buffer = BoundedBuffer(int(os.environ["BUFFER_SIZE"]), buffer_update_event)
    
    # MQTT client
    client = MqttPublisherClient(
        int(os.environ["MQTT_BROKER_PORT"]), 
        os.environ["MQTT_BROKER_IP"], 
        os.environ["MQTT_TOPIC"], 
        os.environ["DEVICE_NAME"],
        os.environ["GPS_LAT"],
        os.environ["GPS_LNG"],
        buffer,
        buffer_update_event,)
    client.start()

    # Debug client
    # client = TerminalPublisherClient(
    #     buffer,
    #     buffer_update_event,)
    # client.start()

    serial = ChannelObserver(os.environ["DEVICE_SERIAL"], buffer)
    serial.start()
