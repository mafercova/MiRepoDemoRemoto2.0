import { ScrollView, StyleSheet, Text, View } from 'react-native';

const highlights = [
  { value: '12', label: 'planes cerca' },
  { value: '4', label: 'actividades disponibles' },
  { value: '3', label: 'lugares nuevos' },
];

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>TU PROXIMA AVENTURA</Text>
        <Text style={styles.title}>Vive mas.{`\n`}Planea menos.</Text>
        <Text style={styles.subtitle}>
          Descubre experiencias y lugares para salir de la rutina.
        </Text>
      </View>

      <View style={styles.stats}>
        {highlights.map((item) => (
          <View key={item.label} style={styles.stat}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Recomendado para hoy</Text>
      <View style={styles.card}>
        <View style={styles.cardAccent} />
        <View style={styles.cardBody}>
          <Text style={styles.cardTag}>CERCA DE TI</Text>
          <Text style={styles.cardTitle}>Explora algo diferente</Text>
          <Text style={styles.cardText}>
            Tu siguiente plan puede estar a solo unos minutos.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7F8',
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  hero: {
    backgroundColor: '#12263A',
    borderRadius: 24,
    padding: 24,
  },
  eyebrow: {
    color: '#FF8A65',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 40,
    marginTop: 12,
  },
  subtitle: {
    color: '#CAD7E0',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 14,
    maxWidth: 360,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 20,
  },
  stat: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    minHeight: 98,
    padding: 14,
  },
  statValue: {
    color: '#12263A',
    fontSize: 25,
    fontWeight: '800',
  },
  statLabel: {
    color: '#637381',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 5,
  },
  sectionTitle: {
    color: '#12263A',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardAccent: {
    backgroundColor: '#FF8A65',
    width: 8,
  },
  cardBody: {
    flex: 1,
    padding: 18,
  },
  cardTag: {
    color: '#E35D38',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardTitle: {
    color: '#12263A',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 7,
  },
  cardText: {
    color: '#637381',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
});
