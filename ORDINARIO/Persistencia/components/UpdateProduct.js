import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { getProducts, updateProduct } from '../lib/productRepository';

export default function UpdateProduct() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [producto, setProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function refresh() {
    setLoading(true); setError('');
    try { setProducts(await getProducts()); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    let active = true;
    getProducts().then((rows) => { if (active) setProducts(rows); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function chooseProduct(item) {
    setSelected(item); setProducto(item.producto);
    setDescripcion(item.descripcion || ''); setPrecio(String(item.precio));
  }

  async function handleUpdate() {
    const numericPrice = Number(precio.replace(',', '.'));
    if (!selected) return Alert.alert('Selecciona un producto', 'Elige un registro de la lista.');
    if (!producto.trim()) return Alert.alert('Falta el producto', 'El nombre no puede estar vacío.');
    if (!precio.trim() || !Number.isFinite(numericPrice) || numericPrice < 0)
      return Alert.alert('Precio no válido', 'Escribe un precio igual o mayor que cero.');

    setSaving(true);
    try {
      await updateProduct(selected.id, { producto: producto.trim(), descripcion: descripcion.trim() || null, precio: numericPrice });
      Alert.alert('Registro actualizado', 'Los cambios se guardaron en Supabase.');
      setSelected(null); setProducto(''); setDescripcion(''); setPrecio('');
      await refresh();
    } catch (err) { Alert.alert('No se pudo actualizar', err.message); }
    finally { setSaving(false); }
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      refreshing={loading}
      onRefresh={refresh}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.heading}>Actualizar producto</Text>
          <Text style={styles.hint}>UPDATE · Selecciona un registro y edita sus campos.</Text>
          {!!error && <Text style={styles.error}>{error}</Text>}
          {selected && <View style={styles.form}>
            <Text style={styles.selected}>Editando ID {selected.id}</Text>
            <Text style={styles.label}>Producto</Text>
            <TextInput value={producto} onChangeText={setProducto} style={styles.input} maxLength={100} />
            <Text style={styles.label}>Descripción</Text>
            <TextInput value={descripcion} onChangeText={setDescripcion} style={[styles.input, styles.multiline]} multiline maxLength={500} />
            <Text style={styles.label}>Precio</Text>
            <TextInput value={precio} onChangeText={setPrecio} keyboardType="decimal-pad" style={styles.input} />
            <Pressable hitSlop={6} onPress={handleUpdate} disabled={saving} style={styles.button}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar cambios</Text>}
            </Pressable>
          </View>}
          <Text style={styles.choose}>{loading ? 'Cargando productos…' : 'Toca un producto para editarlo:'}</Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable onPress={() => chooseProduct(item)} style={[styles.row, selected?.id === item.id && styles.rowSelected]}>
          <View style={styles.copy}>
            <Text style={styles.name}>{item.producto}</Text>
            <Text style={styles.meta}>ID {item.id} · $ {Number(item.precio).toFixed(2)}</Text>
          </View>
          <Text style={styles.selectText}>{selected?.id === item.id ? 'Seleccionado' : 'Editar'}</Text>
        </Pressable>
      )}
      ListEmptyComponent={!loading && !error ? <Text style={styles.empty}>No hay registros para actualizar.</Text> : null}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingBottom: 30, flexGrow: 1 },
  header: { marginBottom: 14 },
  heading: { color: '#202438', fontSize: 20, fontWeight: '800' },
  hint: { color: '#737c91', fontSize: 13, marginTop: 5 },
  error: { color: '#b42318', marginTop: 12 },
  form: { backgroundColor: '#fff', borderColor: '#e3e7f0', borderRadius: 16, borderWidth: 1, marginTop: 16, padding: 16 },
  selected: { color: '#5148df', fontSize: 13, fontWeight: '800' },
  label: { color: '#515a70', fontSize: 13, fontWeight: '700', marginBottom: 7, marginTop: 14 },
  input: { backgroundColor: '#fbfcff', borderColor: '#e0e4ee', borderRadius: 10, borderWidth: 1, color: '#202438', fontSize: 15, minHeight: 46, paddingHorizontal: 12 },
  multiline: { minHeight: 70, paddingTop: 10, textAlignVertical: 'top' },
  button: { alignItems: 'center', backgroundColor: '#635bff', borderRadius: 11, justifyContent: 'center', marginTop: 18, minHeight: 32 },
  buttonText: { color: '#fff', fontWeight: '700' },
  choose: { color: '#687087', fontSize: 13, marginTop: 18, marginBottom: 10 },
  row: { alignItems: 'center', backgroundColor: '#fff', borderColor: '#e3e7f0', borderRadius: 12, borderWidth: 1, flexDirection: 'row', marginBottom: 8, padding: 14 },
  rowSelected: { borderColor: '#635bff', borderWidth: 2 },
  copy: { flex: 1 },
  name: { color: '#202438', fontSize: 14, fontWeight: '700' },
  meta: { color: '#828b9e', fontSize: 12, marginTop: 4 },
  selectText: { color: '#5148df', fontSize: 12, fontWeight: '800' },
  empty: { color: '#858da0', paddingVertical: 20, textAlign: 'center' },
});
