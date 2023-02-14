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

import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;
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

    private MqttPublisher mqttPublisher = null;
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
        recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        recorder.setOutputFile(fileName);
        recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);

        mqttPublisher = new MqttPublisher(this.getApplicationContext());
        mqttPublisher.start();

        new Thread(() -> {
            final int PUBLISH_TIME = 60; // 60 secondi
            final int CHECK_TIME = 100;  // 100 millisecondi

            int oldDecibel = 0;
            int newDecibel;
            int aValue = 0;
            int aNewValue;

            int currTime = (int) (System.currentTimeMillis()  / 1000);
            int oldPublishTime = currTime;

            TimeZone tz = TimeZone.getTimeZone("UTC");
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            df.setTimeZone(tz);

            while (isRunning) {
                currTime = (int) (System.currentTimeMillis() / 1000);

                if (currTime - oldPublishTime > PUBLISH_TIME) {
                    // check and add new measure to list
                    newDecibel = (int) Math.round(20 * log10(aValue));
//                    if (Math.abs(newDecibel - oldDecibel) > 1) {
                    System.out.println("[METER] Adding element to buffer. Decibel: " + newDecibel);
                    Buffer.instance().put(df.format(new Date()) , newDecibel);
                    oldDecibel = newDecibel;
                    aValue = -1;
//                    }
                    oldPublishTime = currTime;
                }

                aNewValue = recorder.getMaxAmplitude();
                if (aNewValue > aValue) {
                    aValue = aNewValue;
                }

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

        mqttPublisher.terminate();

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