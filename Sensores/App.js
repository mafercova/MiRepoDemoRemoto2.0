import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Compass from './components/Compass';
import GyroscopeSensor from './components/GyroscopeSensor';
import MagnetometerSensor from './components/MagnetometerSensor';
import PedometerSensor from './components/PedometerSensor';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <PedometerSensor />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
