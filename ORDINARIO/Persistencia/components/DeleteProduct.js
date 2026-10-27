import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { deleteProduct, getProducts } from '../lib/productRepository';

export default function DeleteProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  function confirmDelete(item) {
    Alert.alert('Eliminar producto', '¿Eliminar "' + item.producto + '" de Supabase?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => handleDelete(item) },
    ]);
  }

  async function handleDelete(item) {
    try {
      await deleteProduct(item.id);
      setProducts((current) => current.filter((product) => product.id !== item.id));
      Alert.alert('Registro eliminado', 'Se eliminó el producto de Supabase.');
    } catch (err) { Alert.alert('No se pudo eliminar', err.message); }
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
          <Text style={styles.heading}>Eliminar producto</Text>
          <Text style={styles.hint}>DELETE · El registro se borrará de Supabase.</Text>
          {!!error && <Text style={styles.error}>{error}</Text>}
          {loading && <Text style={styles.loading}>Cargando productos…</Text>}
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.name}>{item.producto}</Text>
            <Text style={styles.meta}>ID {item.id} · $ {Number(item.precio).toFixed(2)}</Text>
          </View>
          <Pressable accessibilityRole="button" hitSlop={6} onPress={() => confirmDelete(item)} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Eliminar</Text>
          </Pressable>
        </View>
      )}
      ListEmptyComponent={!loading && !error ? <Text style={styles.empty}>No hay registros para eliminar.</Text> : null}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingBottom: 30, flexGrow: 1 },
  header: { marginBottom: 14 },
  heading: { color: '#202438', fontSize: 20, fontWeight: '800' },
  hint: { color: '#737c91', fontSize: 13, marginTop: 5 },
  error: { color: '#b42318', marginTop: 12 },
  loading: { color: '#737c91', fontSize: 13, marginTop: 12 },
  row: { alignItems: 'center', backgroundColor: '#fff', borderColor: '#e3e7f0', borderRadius: 12, borderWidth: 1, flexDirection: 'row', marginBottom: 9, padding: 14 },
  copy: { flex: 1, paddingRight: 10 },
  name: { color: '#202438', fontSize: 14, fontWeight: '700' },
  meta: { color: '#828b9e', fontSize: 12, marginTop: 4 },
  deleteButton: { backgroundColor: '#fff0f0', borderRadius: 9, paddingHorizontal: 12, paddingVertical: 4 },
  deleteText: { color: '#b42318', fontSize: 12, fontWeight: '800' },
  empty: { color: '#858da0', paddingVertical: 20, textAlign: 'center' },
});
