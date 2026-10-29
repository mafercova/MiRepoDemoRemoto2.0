package com.example.sensores_navdrawer;

import android.os.Bundle;
import android.content.Intent;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;
import androidx.drawerlayout.widget.DrawerLayout;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.navigation.NavigationView;

public class MainActivity extends AppCompatActivity {
    private DrawerLayout drawer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        drawer = findViewById(R.id.drawer_layout);
        MaterialToolbar toolbar = findViewById(R.id.toolbar);
        toolbar.setNavigationOnClickListener(v -> drawer.openDrawer(
                androidx.core.view.GravityCompat.START));

        NavigationView navigationView = findViewById(R.id.navigation_view);
        navigationView.setCheckedItem(R.id.nav_inicio);
        navigationView.setNavigationItemSelectedListener(item -> {
            Class<?> activity = null;
            int id = item.getItemId();
            if (id == R.id.nav_giroscopio) {
                activity = GiroscopioActivity.class;
            } else if (id == R.id.nav_acelerometro) {
                activity = AcelerometroActivity.class;
            } else if (id == R.id.nav_gps) {
                activity = GpsActivity.class;
            } else if (id == R.id.nav_magnetometro) {
                activity = MagnetometroActivity.class;
            }
            if (activity != null) {
                startActivity(new Intent(this, activity));
            }
            drawer.closeDrawers();
            return true;
        });
    }

    public void openDrawer(View view) {
        drawer.openDrawer(androidx.core.view.GravityCompat.START);
    }
}