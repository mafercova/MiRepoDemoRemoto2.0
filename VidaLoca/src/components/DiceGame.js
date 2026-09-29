import { useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const pipPositions = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function Die({ value, animation }) {
  const spin = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[styles.die, { transform: [{ rotate: spin }, { scale: animation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.82, 1] }) }] }]}
    >
      {Array.from({ length: 9 }, (_, index) => (
        <View key={index} style={styles.pipCell}>
          {pipPositions[value].includes(index) && <View style={styles.pip} />}
        </View>
      ))}
    </Animated.View>
  );
}

export default function DiceGame() {
  const [dice, setDice] = useState([1, 1]);
  const [rolling, setRolling] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  function rollDice() {
    if (rolling) {
      return;
    }

    setRolling(true);
    setDice([
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ]);
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 450,
      useNativeDriver: false,
    }).start(() => setRolling(false));
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>PRUEBA TU SUERTE</Text>
      <Text style={styles.title}>Lanzar dados</Text>
      <View style={styles.diceRow}>
        <Die value={dice[0]} animation={animation} />
        <Die value={dice[1]} animation={animation} />
      </View>
      <Text style={styles.total}>Total: {dice[0] + dice[1]}</Text>
      <Pressable
        accessibilityRole="button"
        disabled={rolling}
        onPress={rollDice}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          rolling && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>{rolling ? 'Lanzando...' : 'Lanzar'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F7F8',
    justifyContent: 'center',
    padding: 24,
  },
  eyebrow: {
    color: '#E35D38',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: '#12263A',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 8,
  },
  diceRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 34,
  },
  die: {
    width: 112,
    height: 112,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 13,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 12px rgba(18, 38, 58, 0.16)',
      },
      default: {
        elevation: 6,
      },
    }),
  },
  pipCell: {
    width: '33.333%',
    height: '33.333%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pip: {
    width: 17,
    height: 17,
    backgroundColor: '#12263A',
    borderRadius: 9,
  },
  total: {
    color: '#526675',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 26,
  },
  button: {
    minWidth: 180,
    alignItems: 'center',
    backgroundColor: '#E35D38',
    borderRadius: 14,
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 15,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonDisabled: {
    backgroundColor: '#9CAAB4',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
