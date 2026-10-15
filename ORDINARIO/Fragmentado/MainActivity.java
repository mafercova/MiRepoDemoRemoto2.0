package com.example.fragmentado;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        findViewById(R.id.btnFragmentoUno).setOnClickListener(v ->
                mostrarFragmento(new PrimerFragment()));
        findViewById(R.id.btnFragmentoDos).setOnClickListener(v ->
                mostrarFragmento(new SegundoFragment()));
        findViewById(R.id.btnFragmentoTres).setOnClickListener(v ->
                mostrarFragmento(new TercerFragment()));

        if (savedInstanceState == null) {
            mostrarFragmento(new PrimerFragment());
        }
    }

    private void mostrarFragmento(Fragment fragmento) {
        FragmentManager fragmentManager = getSupportFragmentManager();
        fragmentManager.beginTransaction()
                .replace(R.id.contenedorFragmento, fragmento)
                .commit();
    }
}