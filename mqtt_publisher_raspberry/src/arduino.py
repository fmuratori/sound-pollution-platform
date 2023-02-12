import re
import logging 
from threading import Thread

import serial as ser

MESSAGE_REGEX = "(ANALOG)\s\d+"

class ChannelObserver(Thread):
    serial = None
    buffer = None 
    device = None

    def __init__(self, device, buffer):
        self.device = device
        self.buffer = buffer
        super().__init__()

    def connect(self):
        self.serial = ser.Serial(self.device, 9600, timeout=1)
        self.serial.reset_input_buffer()

    def run(self):
        self.connect()

        while True:
            if self.serial.in_waiting > 0:
                line = self.serial.readline().decode('utf-8').rstrip()
                if re.fullmatch(MESSAGE_REGEX, line) is not None:
                    value = line.split("\t")[0].split(" ")[1]
                    self.buffer.put(value)
                    logging.info(f"[SERIAL] New measure received from Arduino. Value: {value}")