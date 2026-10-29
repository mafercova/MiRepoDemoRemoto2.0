package com.example.sensores_navdrawer;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import java.util.Locale;

public class GpsActivity extends SensorActivity implements LocationListener {
    private static final int LOCATION_REQUEST = 100;
    private LocationManager locationManager;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        setTitle(R.string.menu_gps);
        super.onCreate(savedInstanceState);
        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
        requestLocationUpdates();
    }

    private void requestLocationUpdates() {
        boolean fineGranted = ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        boolean coarseGranted = ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;

        if (!fineGranted && !coarseGranted) {
            showValue(getString(R.string.permission_location_denied));
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION},
                    LOCATION_REQUEST);
            return;
        }

        if (locationManager == null) {
            showValue("El servicio de ubicación no está disponible.");
            return;
        }

        try {
            String provider = null;
            if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                provider = LocationManager.GPS_PROVIDER;
            } else if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                provider = LocationManager.NETWORK_PROVIDER;
            }

            if (provider == null) {
                showValue("La ubicación está desactivada.\nActívala en Ajustes para continuar.");
                return;
            }

            showValue(getString(R.string.location_waiting));
            locationManager.requestLocationUpdates(provider, 1000L, 1f, this);
        } catch (SecurityException exception) {
            showValue(getString(R.string.permission_location_denied));
        } catch (IllegalArgumentException exception) {
            showValue("No se pudo iniciar el proveedor de ubicación.");
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (locationManager != null) {
            try {
                if (ActivityCompat.checkSelfPermission(this,
                        Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                        || ActivityCompat.checkSelfPermission(this,
                        Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    locationManager.removeUpdates(this);
                }
            } catch (SecurityException ignored) {
                Log.w("GpsActivity", "No se pudieron detener las actualizaciones de ubicación", ignored);
            }
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (locationManager != null) requestLocationUpdates();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        boolean permissionGranted = false;
        for (int result : grantResults) {
            if (result == PackageManager.PERMISSION_GRANTED) {
                permissionGranted = true;
                break;
            }
        }
        if (requestCode == LOCATION_REQUEST && permissionGranted) {
            requestLocationUpdates();
        } else {
            showValue(getString(R.string.permission_location_denied));
        }
    }

    @Override
    public void onLocationChanged(@NonNull Location location) {
        showValue(String.format(Locale.getDefault(),
                "GPS\n\nLatitud: %.6f\nLongitud: %.6f\nAltitud: %.2f m\nPrecisión: %.2f m",
                location.getLatitude(), location.getLongitude(),
                location.hasAltitude() ? location.getAltitude() : 0f,
                location.hasAccuracy() ? location.getAccuracy() : 0f));
    }

    @Override public void onProviderEnabled(@NonNull String provider) { }
    @Override public void onProviderDisabled(@NonNull String provider) { }

    @Override
    @SuppressWarnings("deprecation")
    public void onStatusChanged(String provider, int status, Bundle extras) {
        // Necesario para compatibilidad con versiones antiguas de Android.
    }
}
