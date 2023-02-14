package com.soundpollution.android_meter;

import android.util.Pair;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.concurrent.locks.Lock;

public class Buffer {
    private static final int BUFFER_SIZE = 60 * 24;
    private static Buffer instance = new Buffer();
    private Lock lock;
    private List<Pair<String, Integer>> buffer = new ArrayList<>();

    public static Buffer instance() {
        return instance;
    }

    public synchronized void put(String date, int value) {
        if (this.isFull()) {
            System.out.println("[BUFFER] Buffer is full, removing oldest element ...");
            buffer.remove(0);
        }
        buffer.add(new Pair<>(date, value));
        lock.unlock();
    }

    public synchronized List<Pair<String, Integer>> get() {
        List<Pair<String, Integer>> output = new ArrayList<>(buffer);
        buffer.clear();
        return output;
    }

    public synchronized boolean isFull() {
        return buffer.size() == BUFFER_SIZE;
    }

    public synchronized boolean isEmpty() {
        return buffer.size() == 0;
    }

}
