package com.example.verthorizon;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCompatActivity {

    private static final String TEXTO_GUARDADO = "texto_guardado";
    private EditText editTextDato;
    private TextView textViewResultado;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        editTextDato = findViewById(R.id.editTextDato);
        textViewResultado = findViewById(R.id.textViewResultado);
        Button buttonMostrar = findViewById(R.id.buttonMostrar);

        buttonMostrar.setOnClickListener(v -> {
            String dato = editTextDato.getText().toString();
            textViewResultado.setText(getString(R.string.dato_mostrado, dato));
        });

        if (savedInstanceState != null) {
            String datoGuardado = savedInstanceState.getString(TEXTO_GUARDADO, "");
            editTextDato.setText(datoGuardado);
            textViewResultado.setText(getString(R.string.dato_mostrado, datoGuardado));
        }

        mostrarMensaje(R.string.mensaje_on_create);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        outState.putString(TEXTO_GUARDADO, editTextDato.getText().toString());
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onPause() {
        super.onPause();
        mostrarMensaje(R.string.mensaje_on_pause);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mostrarMensaje(R.string.mensaje_on_destroy);
    }

    private void mostrarMensaje(int mensaje) {
        Toast.makeText(this, mensaje, Toast.LENGTH_SHORT).show();
    }
}