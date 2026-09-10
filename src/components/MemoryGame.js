import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const symbols = ['A', 'B', 'C', 'D', 'E', 'F'];

function createDeck() {
  return [...symbols, ...symbols]
    .map((value, index) => ({ id: index, value }))
    .sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
  const [cards, setCards] = useState(createDeck);
  const [openIds, setOpenIds] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function selectCard(card) {
    if (
      openIds.length === 2 ||
      openIds.includes(card.id) ||
      matchedIds.includes(card.id)
    ) {
      return;
    }

    if (openIds.length === 0) {
      setOpenIds([card.id]);
      return;
    }

    const firstCard = cards.find((item) => item.id === openIds[0]);
    const nextOpenIds = [openIds[0], card.id];
    setOpenIds(nextOpenIds);
    setMoves((current) => current + 1);

    timer.current = setTimeout(() => {
      if (firstCard.value === card.value) {
        setMatchedIds((current) => [...current, ...nextOpenIds]);
      }
      setOpenIds([]);
    }, firstCard.value === card.value ? 350 : 750);
  }

  function reset() {
    clearTimeout(timer.current);
    setCards(createDeck());
    setOpenIds([]);
    setMatchedIds([]);
    setMoves(0);
  }

  const completed = matchedIds.length === cards.length;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Memorama</Text>
      <Text style={styles.status}>
        {completed ? `Completado en ${moves} movimientos` : `Movimientos: ${moves}`}
      </Text>
      <View style={styles.board}>
        {cards.map((card) => {
          const isVisible = openIds.includes(card.id) || matchedIds.includes(card.id);
          return (
            <Pressable
              accessibilityLabel={isVisible ? `Carta ${card.value}` : 'Carta oculta'}
              accessibilityRole="button"
              key={card.id}
              onPress={() => selectCard(card)}
              style={({ pressed }) => [
                styles.card,
                isVisible && styles.cardVisible,
                matchedIds.includes(card.id) && styles.cardMatched,
                pressed && !isVisible && styles.cardPressed,
              ]}
            >
              <Text style={[styles.cardText, !isVisible && styles.hiddenText]}>
                {isVisible ? card.value : '?'}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable accessibilityRole="button" onPress={reset} style={styles.button}>
        <Text style={styles.buttonText}>Reiniciar</Text>
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
    padding: 16,
  },
  title: {
    color: '#12263A',
    fontSize: 32,
    fontWeight: '800',
  },
  status: {
    color: '#637381',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: 7,
  },
  board: {
    width: 292,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    width: 92,
    height: 76,
    alignItems: 'center',
    backgroundColor: '#12263A',
    borderRadius: 14,
    justifyContent: 'center',
  },
  cardVisible: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D9E2E8',
    borderWidth: 2,
  },
  cardMatched: {
    backgroundColor: '#DDF3E8',
    borderColor: '#63A983',
  },
  cardPressed: {
    backgroundColor: '#243F57',
  },
  cardText: {
    color: '#E35D38',
    fontSize: 30,
    fontWeight: '800',
  },
  hiddenText: {
    color: '#CAD7E0',
  },
  button: {
    backgroundColor: '#E35D38',
    borderRadius: 14,
    marginTop: 22,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
