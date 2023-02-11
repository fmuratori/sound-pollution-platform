import os
import logging
from dotenv import load_dotenv

from arduino import ChannelObserver
from mqtt import MqttPublisherClient
from buffer import BoundedBuffer
import logging
load_dotenv()
logging.basicConfig(level=logging.INFO)

if __name__ == '__main__':

    buffer = BoundedBuffer(int(os.environ["BUFFER_SIZE"]))
    
    client = MqttPublisherClient(
        int(os.environ["MQTT_BROKER_PORT"]), 
        os.environ["MQTT_BROKER_IP"], 
        os.environ["MQTT_TOPIC"], 
        os.environ["DEVICE_NAME"],
        os.environ["GPS_LAT"],
        os.environ["GPS_LNG"],
        buffer,
        int(os.environ["UPDATE_DELTA"]),)
    client.start()

    serial = ChannelObserver(os.environ["DEVICE_SERIAL"], buffer)
    serial.start()
