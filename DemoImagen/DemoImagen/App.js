import { StyleSheet, Text, View } from 'react-native';
import {StatusBar} from 'expo-status-bar';
import DemoImagen from './componentes/DemoImagen';

export default function App() {
  return (
    <View style={styles.container}>
      <DemoImagen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#154423',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel1: {
    flex: 1,
    backgroundColor: '#2c8338',
  },
  panel2: {
    flex: 1,
    backgroundColor: '#3eb64e',
  },
  panel3: {
    flex: 1,
    backgroundColor: '"#4bda61',
  },
});
