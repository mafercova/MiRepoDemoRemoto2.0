import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { addProduct } from '../lib/productRepository';

export default function CreateProduct({ onCreated }) {
  const [producto, setProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    const numericPrice = Number(precio.replace(',', '.'));
    if (!producto.trim()) return Alert.alert('Falta el producto', 'Escribe el nombre del producto.');
    if (!precio.trim() || !Number.isFinite(numericPrice) || numericPrice < 0)
      return Alert.alert('Precio no válido', 'Escribe un precio igual o mayor que cero.');
    setSaving(true);
    try {
      await addProduct({ producto: producto.trim(), descripcion: descripcion.trim() || null, precio: numericPrice });
      setProducto(''); setDescripcion(''); setPrecio('');
      Alert.alert('Registro creado', 'El producto se guardó en Supabase.');
      onCreated?.();
    } catch (error) { Alert.alert('No se pudo crear', error.message); }
    finally { setSaving(false); }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.heading}>Crear producto</Text>
          <Text style={styles.hint}>CREATE · Agrega un registro nuevo a Supabase.</Text>
          <Text style={styles.label}>Producto</Text>
          <TextInput value={producto} onChangeText={setProducto} placeholder="Ej. Cuaderno" style={styles.input} maxLength={100} />
          <Text style={styles.label}>Descripción</Text>
          <TextInput value={descripcion} onChangeText={setDescripcion} placeholder="Descripción (opcional)" style={[styles.input, styles.multiline]} multiline maxLength={500} />
          <Text style={styles.label}>Precio</Text>
          <TextInput value={precio} onChangeText={setPrecio} placeholder="0.00" keyboardType="decimal-pad" style={styles.input} />
          <Pressable hitSlop={6} onPress={handleCreate} disabled={saving} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar producto</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 28 },
  card: { backgroundColor: '#fff', borderColor: '#e3e7f0', borderRadius: 18, borderWidth: 1, padding: 18 },
  heading: { color: '#202438', fontSize: 20, fontWeight: '800' },
  hint: { color: '#737c91', fontSize: 13, marginTop: 5 },
  label: { color: '#515a70', fontSize: 13, fontWeight: '700', marginBottom: 7, marginTop: 17 },
  input: { backgroundColor: '#fbfcff', borderColor: '#e0e4ee', borderRadius: 11, borderWidth: 1, color: '#202438', fontSize: 15, minHeight: 48, paddingHorizontal: 13 },
  multiline: { minHeight: 78, paddingTop: 12, textAlignVertical: 'top' },
  button: { alignItems: 'center', backgroundColor: '#635bff', borderRadius: 12, justifyContent: 'center', marginTop: 22, minHeight: 32 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.75 },
});
