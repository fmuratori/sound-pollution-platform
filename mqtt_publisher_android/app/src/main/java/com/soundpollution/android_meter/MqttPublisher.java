package com.soundpollution.android_meter;

import android.content.Context;
import android.util.Pair;

import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import info.mqtt.android.service.Ack;
import info.mqtt.android.service.MqttAndroidClient;

public class MqttPublisher extends Thread {
    private final int UPDATE_TIME = 1000 * 60;
    private final String DEVICE_NAME = "android_meter_002";
    private final double GPS_LAT = 43.914376;
    private final double GPS_LNG = 12.611327;

    private MqttAndroidClient mqttClient = null;
    private boolean isConnected = false;
    private boolean stopRunning = false;

    public MqttPublisher(Context context) {
        String clientId = MqttClient.generateClientId();
        mqttClient = new MqttAndroidClient(context, "tcp://192.168.0.100:1883",clientId, Ack.AUTO_ACK);
    }

    public boolean isConnected() {
        return isConnected;
    }

    public void connect() {
        IMqttToken token = mqttClient.connect();
        token.setActionCallback(new IMqttActionListener() {
            @Override
            public void onSuccess(IMqttToken asyncActionToken) {
                System.out.println("[MQTT CLIENT] Client successfully connected to broker");
                isConnected = true;
            }

            @Override
            public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                System.out.println("[MQTT CLIENT] Client did not connect to broker");
                isConnected = false;
            }
        });
    }

    public void terminate() {
        this.stopRunning = true;
        IMqttToken token = mqttClient.disconnect(null, null);
        token.setActionCallback(new IMqttActionListener() {
            @Override
            public void onSuccess(IMqttToken asyncActionToken) {
                System.out.println("[MQTT CLIENT] Client successfully disconnect from broker");
                isConnected = false;
            }

            @Override
            public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                System.out.println("[MQTT CLIENT] Client did not disconnect from broker");
                isConnected = true;
            }
        });
    }

    @Override
    public void run() {
        mqttClient.connect();

        while(!stopRunning) {

            if (!Buffer.instance().isEmpty()) {
                String fullMessage = DEVICE_NAME + " " + GPS_LAT + " " + GPS_LNG + "\t[";
                for (Pair<String,Integer> p : Buffer.instance().get())
                    fullMessage += "(\"" + p.first + "\", " + p.second + "), ";
                fullMessage = fullMessage.substring(0, fullMessage.length() - 2);
                fullMessage += "]";

                System.out.println("[MQTT CLIENT] Publishing data: " + fullMessage);

                MqttMessage message = new MqttMessage();
                message.setPayload(fullMessage.getBytes());
                message.setQos(1);
                message.setRetained(false);
                if (mqttClient.isConnected())
                    mqttClient.publish("sound_pollution", message, false, new IMqttActionListener() {
                        @Override
                        public void onSuccess(IMqttToken asyncActionToken) {
                            System.out.println("[MQTT CLIENT] Published data with SUCCESS");
                            Buffer.instance().clear();
                        }

                        @Override
                        public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                            System.out.println("[MQTT CLIENT] Data now published");
                        }
                    });
            }

            try {
                Thread.sleep(UPDATE_TIME);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
