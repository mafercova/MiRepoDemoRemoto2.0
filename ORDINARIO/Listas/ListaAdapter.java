package com.example.listas;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class ListaAdapter extends RecyclerView.Adapter<ListaAdapter.ListaViewHolder> {

    private final List<String> temas;

    public ListaAdapter(List<String> temas) {
        this.temas = temas;
    }

    @NonNull
    @Override
    public ListaViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View vista = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_lista, parent, false);
        return new ListaViewHolder(vista);
    }

    @Override
    public void onBindViewHolder(@NonNull ListaViewHolder holder, int position) {
        holder.textoTema.setText(temas.get(position));
    }

    @Override
    public int getItemCount() {
        return temas.size();
    }

    static class ListaViewHolder extends RecyclerView.ViewHolder {

        final TextView textoTema;

        ListaViewHolder(@NonNull View itemView) {
            super(itemView);
            textoTema = itemView.findViewById(R.id.textoTema);
        }
    }
}
