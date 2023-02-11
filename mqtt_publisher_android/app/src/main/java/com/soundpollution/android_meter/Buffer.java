package com.soundpollution.android_meter;

import android.util.Pair;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

public class Buffer {
    private static final int BUFFER_SIZE = 60 * 24;
    private static Buffer instance = new Buffer();
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
    }

    public synchronized void clear() {
        buffer.clear();
    }

    public synchronized List<Pair<String, Integer>> get() {
        return new ArrayList<>(buffer);
    }

    public synchronized boolean isFull() {
        return buffer.size() == BUFFER_SIZE;
    }

    public synchronized boolean isEmpty() {
        return buffer.size() == 0;
    }

}
