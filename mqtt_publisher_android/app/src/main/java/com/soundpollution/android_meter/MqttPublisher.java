package com.soundpollution.android_meter;

import android.content.Context;
import android.util.Pair;

import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
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
        MqttConnectOptions options = new MqttConnectOptions();
        options.setKeepAliveInterval(60*10);
        IMqttToken token = mqttClient.connect(options);
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
        this.connect();

        while(!stopRunning) {
            if (Buffer.instance().isEmpty()) {
                System.out.println("[MQTT CLIENT] Empty buffer nothing published ");
            } else if (!mqttClient.isConnected()) {
                System.out.println("[MQTT CLIENT] MQTT Client is not connected ");
                this.connect();
            } else {
                StringBuilder fullMessage = new StringBuilder(DEVICE_NAME + " " + GPS_LAT + " " + GPS_LNG + "\t[");
                for (Pair<String,Integer> p : Buffer.instance().get())
                    fullMessage.append("(\"").append(p.first).append("\", ").append(p.second).append("), ");
                fullMessage = new StringBuilder(fullMessage.substring(0, fullMessage.length() - 2));
                fullMessage.append("]");

                System.out.println("[MQTT CLIENT] Publishing data: " + fullMessage);

                MqttMessage message = new MqttMessage();
                message.setPayload(fullMessage.toString().getBytes());
                message.setQos(2);
                message.setRetained(true);

                mqttClient.publish("sound_pollution", message, false, null);
            }
            try {
                Thread.sleep(UPDATE_TIME);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
