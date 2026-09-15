import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const getMagnitude = ({ x, y, z }) => Math.sqrt(x * x + y * y + z * z);

export default function CoinToss() {
  const [resultado, setResultado] = useState('Cara');
  const [isShaking, setIsShaking] = useState(false);
  const [glow, setGlow] = useState(false);

  const lastMagnitudeRef = useRef(0);
  const lastShakeTimeRef = useRef(0);
  const timeoutRef = useRef(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const resultScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const suscribir = Accelerometer.addListener((measurements) => {
      const magnitude = getMagnitude(measurements);
      const now = Date.now();
      const strongShake = magnitude > 1.4 && Math.abs(magnitude - lastMagnitudeRef.current) > 0.8;
      const cooldownPassed = now - lastShakeTimeRef.current > 1200;

      if (strongShake && cooldownPassed) {
        const nextResult = Math.random() >= 0.5 ? 'Cara' : 'Cruz';
        setResultado(nextResult);
        setIsShaking(true);
        setGlow(true);
        lastShakeTimeRef.current = now;

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.28,
              duration: 120,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 120,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(resultScaleAnim, {
              toValue: 1.3,
              duration: 120,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 200,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 200,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              useNativeDriver: true,
            }),
            Animated.timing(resultScaleAnim, {
              toValue: 1,
              duration: 200,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          setIsShaking(false);
          setGlow(false);
        });

        timeoutRef.current = setTimeout(() => {
          setIsShaking(false);
          setGlow(false);
        }, 800);
      }

      lastMagnitudeRef.current = magnitude;
    });

    Accelerometer.setUpdateInterval(80);

    return () => {
      suscribir.remove();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-30deg', '30deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Moneda al aire</Text>

      <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

      <Animated.View
        style={[
          styles.coin,
          isShaking && {
            transform: [
              { rotate: rotate },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <Animated.Text style={[styles.coinText, { transform: [{ scale: resultScaleAnim }] }]}>
          {resultado}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#edf2ff',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 28,
    color: '#1c2a3d',
    letterSpacing: 0.5,
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 214, 60, 0.25)',
    shadowColor: '#ffd93d',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  coin: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#f7d14a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 10,
    borderColor: '#d8a813',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.32,
    shadowRadius: 22,
    elevation: 20,
  },
  coinText: {
    fontSize: 35,
    fontWeight: '900',
    color: '#1d2b3a',
    textAlign: 'center',
  },
});
