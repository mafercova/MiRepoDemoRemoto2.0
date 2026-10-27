import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import CreateProduct from './components/CreateProduct';
import ReadProducts from './components/ReadProducts';
import UpdateProduct from './components/UpdateProduct';
import DeleteProduct from './components/DeleteProduct';

const sections = ['CREATE', 'READ', 'UPDATE', 'DELETE'];

export default function App() {
  const [activeSection, setActiveSection] = useState('READ');
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.kicker}>PERSISTENCIA · SUPABASE</Text>
        <Text style={styles.title}>CRUD de productos</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {sections.map((section) => (
          <Pressable key={section} onPress={() => setActiveSection(section)}
            style={[styles.tab, activeSection === section && styles.activeTab]}>
            <Text style={[styles.tabText, activeSection === section && styles.activeTabText]}>{section}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.body}>
        {activeSection === 'CREATE' && <CreateProduct onCreated={() => setActiveSection('READ')} />}
        {activeSection === 'READ' && <ReadProducts />}
        {activeSection === 'UPDATE' && <UpdateProduct />}
        {activeSection === 'DELETE' && <DeleteProduct />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f6fb', paddingTop: 52 },
  header: { paddingHorizontal: 22, paddingBottom: 16 },
  kicker: { color: '#635bff', fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: '#171a2b', fontSize: 28, fontWeight: '800', marginTop: 6 },
  tabs: { paddingHorizontal: 18, gap: 8, paddingBottom: 14 },
  tab: { borderRadius: 10, backgroundColor: '#e9ebf3', paddingHorizontal: 15, paddingVertical: 4, minHeight: 30, justifyContent: 'center' },
  activeTab: { backgroundColor: '#635bff' },
  tabText: { color: '#60697d', fontSize: 12, fontWeight: '800' },
  activeTabText: { color: '#fff' },
  body: { flex: 1 },
});
