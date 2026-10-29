package com.example.sensores_navdrawer;

import android.os.Bundle;
import android.widget.TextView;
import android.content.Intent;

import androidx.appcompat.app.AppCompatActivity;
import androidx.drawerlayout.widget.DrawerLayout;

import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.navigation.NavigationView;

abstract class SensorActivity extends AppCompatActivity {
    protected TextView valueView;
    protected DrawerLayout drawer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sensor);
        drawer = findViewById(R.id.sensor_drawer_layout);
        MaterialToolbar toolbar = findViewById(R.id.sensor_toolbar);
        toolbar.setTitle(getTitle());
        toolbar.setNavigationOnClickListener(v -> drawer.openDrawer(
                androidx.core.view.GravityCompat.START));
        valueView = findViewById(R.id.sensor_value);

        NavigationView navigationView = findViewById(R.id.sensor_navigation_view);
        navigationView.setCheckedItem(getCurrentMenuItem());
        navigationView.setNavigationItemSelectedListener(item -> {
            Class<?> activity = null;
            int id = item.getItemId();
            if (id == R.id.nav_inicio) {
                activity = MainActivity.class;
            } else if (id == R.id.nav_giroscopio) {
                activity = GiroscopioActivity.class;
            } else if (id == R.id.nav_acelerometro) {
                activity = AcelerometroActivity.class;
            } else if (id == R.id.nav_gps) {
                activity = GpsActivity.class;
            } else if (id == R.id.nav_magnetometro) {
                activity = MagnetometroActivity.class;
            }
            if (activity != null && activity != getClass()) {
                startActivity(new Intent(this, activity));
                finish();
            }
            drawer.closeDrawers();
            return true;
        });
    }

    private int getCurrentMenuItem() {
        if (this instanceof GiroscopioActivity) return R.id.nav_giroscopio;
        if (this instanceof AcelerometroActivity) return R.id.nav_acelerometro;
        if (this instanceof GpsActivity) return R.id.nav_gps;
        if (this instanceof MagnetometroActivity) return R.id.nav_magnetometro;
        return R.id.nav_inicio;
    }

    protected void showValue(String value) {
        valueView.setText(value);
    }
}
