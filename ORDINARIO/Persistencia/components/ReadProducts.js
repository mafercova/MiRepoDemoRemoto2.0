import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getProducts } from '../lib/productRepository';

export default function ReadProducts() {
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

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      refreshing={loading}
      onRefresh={refresh}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.heading}>Productos</Text>
              <Text style={styles.hint}>READ · Consulta registros en Supabase.</Text>
            </View>
            <Pressable hitSlop={6} onPress={refresh} style={styles.refresh}><Text style={styles.refreshText}>Actualizar</Text></Pressable>
          </View>
          {!!error && <Text style={styles.error}>{error}</Text>}
          {loading && products.length === 0 && <ActivityIndicator color="#635bff" style={styles.spinner} />}
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.copy}>
            <Text style={styles.name}>{item.producto}</Text>
            <Text style={styles.description}>{item.descripcion || 'Sin descripción'}</Text>
            <Text style={styles.id}>ID: {item.id}</Text>
          </View>
          <Text style={styles.price}>$ {Number(item.precio).toFixed(2)}</Text>
        </View>
      )}
      ListEmptyComponent={!loading && !error ? <Text style={styles.empty}>No hay productos todavía.</Text> : null}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingBottom: 30, flexGrow: 1 },
  header: { marginBottom: 14 },
  titleRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  heading: { color: '#202438', fontSize: 20, fontWeight: '800' },
  hint: { color: '#737c91', fontSize: 13, marginTop: 5 },
  refresh: { backgroundColor: '#e8e7ff', borderRadius: 9, paddingHorizontal: 12, paddingVertical: 4 },
  refreshText: { color: '#5148df', fontSize: 12, fontWeight: '700' },
  spinner: { marginTop: 20 },
  error: { color: '#b42318', fontSize: 13, marginTop: 14 },
  card: { alignItems: 'center', backgroundColor: '#fff', borderColor: '#e3e7f0', borderRadius: 14, borderWidth: 1, flexDirection: 'row', marginBottom: 10, padding: 15 },
  copy: { flex: 1, paddingRight: 12 },
  name: { color: '#202438', fontSize: 15, fontWeight: '700' },
  description: { color: '#737c91', fontSize: 13, marginTop: 4 },
  id: { color: '#9aa1b0', fontSize: 11, marginTop: 5 },
  price: { color: '#5148df', fontSize: 15, fontWeight: '800' },
  empty: { color: '#858da0', paddingVertical: 24, textAlign: 'center' },
});
