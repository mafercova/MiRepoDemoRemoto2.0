import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AccelerometerSensor from './AccelerometerSensor';

export default function AccelerometerScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Moneda al aire</Text>
      <AccelerometerSensor />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
    color: '#1f2d3d',
  },
});
