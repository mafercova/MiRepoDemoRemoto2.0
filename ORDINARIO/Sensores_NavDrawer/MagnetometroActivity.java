package com.example.sensores_navdrawer;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

import java.util.Locale;

public class MagnetometroActivity extends SensorActivity implements SensorEventListener {
    private SensorManager sensorManager;
    private Sensor sensor;

    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        setTitle(R.string.menu_magnetometro);
        super.onCreate(savedInstanceState);
        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        sensor = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
        if (sensor == null) showValue(getString(R.string.sensor_unavailable));
    }

    @Override protected void onResume() {
        super.onResume();
        if (sensor != null) sensorManager.registerListener(this, sensor, SensorManager.SENSOR_DELAY_UI);
    }

    @Override protected void onPause() {
        super.onPause();
        if (sensorManager != null) sensorManager.unregisterListener(this);
    }

    @Override public void onSensorChanged(SensorEvent event) {
        showValue(String.format(Locale.getDefault(),
                "Magnetómetro\n\nX: %.3f μT\nY: %.3f μT\nZ: %.3f μT",
                event.values[0], event.values[1], event.values[2]));
    }

    @Override public void onAccuracyChanged(Sensor sensor, int accuracy) { }
}
