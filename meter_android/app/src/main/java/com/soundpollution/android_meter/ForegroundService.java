package com.soundpollution.android_meter;

import static java.lang.Math.log10;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.IBinder;
import android.util.Pair;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

//import org.eclipse.paho.android.service.MqttAndroidClient;
import info.mqtt.android.service.Ack;
import info.mqtt.android.service.MqttAndroidClient;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

public class ForegroundService extends Service {
    public static final String CHANNEL_ID = "ForegroundServiceChannel";
    public boolean isRunning = false;
    private MediaRecorder recorder = null;
    private static String fileName = null;

    private MqttAndroidClient mqttClient = null;
    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        fileName = getExternalCacheDir().getAbsolutePath();
        fileName += "/audiorecordtest.3gp";

        String input = intent.getStringExtra("inputExtra");
        createNotificationChannel();
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this,
                0, notificationIntent, 0);

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Foreground Service")
                .setContentText(input)
                .setContentIntent(pendingIntent)
                .build();

        startForeground(1, notification);

        isRunning = true;

        recorder = new MediaRecorder();
        recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        recorder.getMaxAmplitude();
        recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        recorder.setOutputFile(fileName);
        recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);

        String clientId = MqttClient.generateClientId();
        mqttClient = new MqttAndroidClient(this.getApplicationContext(), "tcp://192.168.0.100:1883",clientId, Ack.AUTO_ACK);

        mqttClient.connect();

        new Thread(() -> {
            final int PUBLISH_TIME = 10; // 10 secondi
            final int UPDATE_TIME = 1;   // 1 secondo
            final int CHECK_TIME = 100;      // 100 millisecondi

            int aOldValue = 0;
            int aValue = 0;
            int aNewValue = 0;

            int currTime = (int) (System.currentTimeMillis()  / 1000);
            int oldPublishTime = currTime;
            int oldUpdateTime = currTime;

            List<Pair<String, Integer>> recorded = new ArrayList<>();

            TimeZone tz = TimeZone.getTimeZone("UTC");
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            df.setTimeZone(tz);

            while (isRunning) {
                currTime = (int) (System.currentTimeMillis()  / 1000);

                if (currTime - oldUpdateTime > UPDATE_TIME) {
                    if (Math.abs(Math.round(20 * log10(aValue)) - Math.round(20 * log10(aOldValue))) > 2) {
                        recorded.add(new Pair<>(
                                df.format(new Date()) , (int) Math.round(20 * log10(aValue))));
                        aOldValue = aValue;
                        aValue = -1;
                    }
                    oldUpdateTime = currTime;
                }

                if (currTime - oldPublishTime > PUBLISH_TIME) {
                    String fullMessage = "android_meter_002" + " 43.914376 12.611327\t[";
                    for (Pair<String,Integer> p : recorded)
                        fullMessage += "(\"" + p.first + "\", " + p.second + "), ";
                    fullMessage = fullMessage.substring(0, fullMessage.length() - 2);
                    fullMessage += "]";

                    System.out.println(fullMessage);

                    MqttMessage message = new MqttMessage();
                    message.setPayload(fullMessage.getBytes());
                    message.setQos(1);
                    message.setRetained(false);
                    if (mqttClient.isConnected())
                        mqttClient.publish("sound_pollution", message, false, null);

                    oldPublishTime = currTime;
                    recorded.clear();
                }

                aNewValue = recorder.getMaxAmplitude();
                if (aNewValue > aValue)
                    aValue = aNewValue;

                try {
                    Thread.sleep(CHECK_TIME);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }).start();

        try {
            recorder.prepare();
        } catch (IOException e) {}

        recorder.start();

        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        recorder.stop();
        recorder.release();
        recorder = null;

        mqttClient.disconnect(null, null);

        isRunning = false;
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Foreground Service Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );

            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }
    }
}