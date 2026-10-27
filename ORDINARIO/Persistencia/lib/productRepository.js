import { supabase } from './supabase';

const columns = 'id, producto, descripcion, precio';

export async function getProducts() {
  const { data, error } = await supabase.from('productos').select(columns).order('id', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addProduct(product) {
  const { data, error } = await supabase.from('productos').insert(product).select('id').single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id, changes) {
  const { data, error } = await supabase.from('productos').update(changes).eq('id', id).select('id').maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('No se actualizó el registro. Revisa las políticas RLS.');
  return data;
}

export async function deleteProduct(id) {
  const { data, error } = await supabase.from('productos').delete().eq('id', id).select('id').maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('No se eliminó el registro. Revisa las políticas RLS.');
  return data;
}
