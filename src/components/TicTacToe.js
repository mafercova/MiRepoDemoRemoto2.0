import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board) {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const winner = getWinner(board);
  const isDraw = !winner && board.every(Boolean);

  function play(index) {
    if (board[index] || winner) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = turn;
    setBoard(nextBoard);
    setTurn(turn === 'X' ? 'O' : 'X');
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setTurn('X');
  }

  const message = winner
    ? `Ganador: ${winner}`
    : isDraw
      ? 'Empate'
      : `Turno de ${turn}`;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <Text style={styles.status}>{message}</Text>
      <View style={styles.board}>
        {board.map((cell, index) => (
          <Pressable
            accessibilityLabel={`Casilla ${index + 1}${cell ? `: ${cell}` : ''}`}
            accessibilityRole="button"
            key={index}
            onPress={() => play(index)}
            style={({ pressed }) => [styles.cell, pressed && !cell && styles.cellPressed]}
          >
            <Text style={[styles.mark, cell === 'O' && styles.markO]}>{cell}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable accessibilityRole="button" onPress={reset} style={styles.button}>
        <Text style={styles.buttonText}>Nueva partida</Text>
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
    padding: 20,
  },
  title: {
    color: '#12263A',
    fontSize: 32,
    fontWeight: '800',
  },
  status: {
    color: '#E35D38',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 24,
    marginTop: 8,
  },
  board: {
    width: 296,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cell: {
    width: 93,
    height: 93,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
  },
  cellPressed: {
    backgroundColor: '#E6F4FE',
  },
  mark: {
    color: '#12263A',
    fontSize: 46,
    fontWeight: '800',
  },
  markO: {
    color: '#E35D38',
  },
  button: {
    backgroundColor: '#12263A',
    borderRadius: 14,
    marginTop: 28,
    paddingHorizontal: 26,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
