import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const rates = {
  USD: 1,
  EUR: 0.92,
  MXN: 17.1,
  COP: 3950,
  GBP: 0.79,
};

const currencies = Object.keys(rates);

function CurrencySelector({ label, selected, onSelect }) {
  return (
    <View style={styles.selectorGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.currencyList}>
        {currencies.map((currency) => (
          <Pressable
            accessibilityRole="button"
            key={currency}
            onPress={() => onSelect(currency)}
            style={[styles.currency, selected === currency && styles.currencySelected]}
          >
            <Text
              style={[
                styles.currencyText,
                selected === currency && styles.currencyTextSelected,
              ]}
            >
              {currency}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('MXN');
  const numericAmount = Number(amount.replace(',', '.'));
  const result = Number.isFinite(numericAmount)
    ? (numericAmount / rates[from]) * rates[to]
    : 0;

  function swapCurrencies() {
    setFrom(to);
    setTo(from);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Conversion de divisas</Text>
      <Text style={styles.description}>
        Conversion sin conexion con tasas de referencia guardadas localmente.
      </Text>

      <View style={styles.panel}>
        <Text style={styles.label}>Cantidad</Text>
        <TextInput
          accessibilityLabel="Cantidad a convertir"
          keyboardType="decimal-pad"
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor="#9CAAB4"
          style={styles.input}
          value={amount}
        />

        <CurrencySelector label="De" selected={from} onSelect={setFrom} />
        <Pressable accessibilityRole="button" onPress={swapCurrencies} style={styles.swapButton}>
          <Text style={styles.swapText}>Intercambiar</Text>
        </Pressable>
        <CurrencySelector label="A" selected={to} onSelect={setTo} />

        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Resultado</Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.result}>
            {result.toFixed(2)} {to}
          </Text>
          <Text style={styles.rateText}>
            1 {from} = {(rates[to] / rates[from]).toFixed(4)} {to}
          </Text>
        </View>
      </View>

      <Text style={styles.disclaimer}>
        Tasas fijas de demostracion. No usar para operaciones financieras.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7F8',
  },
  content: {
    alignSelf: 'center',
    maxWidth: 620,
    padding: 20,
    paddingBottom: 40,
    width: '100%',
  },
  title: {
    color: '#12263A',
    fontSize: 30,
    fontWeight: '800',
  },
  description: {
    color: '#637381',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 8,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginTop: 22,
    padding: 20,
  },
  label: {
    color: '#526675',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 9,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F5F7F8',
    borderColor: '#D9E2E8',
    borderRadius: 14,
    borderWidth: 1,
    color: '#12263A',
    fontSize: 28,
    fontWeight: '800',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  selectorGroup: {
    marginTop: 20,
  },
  currencyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  currency: {
    backgroundColor: '#EDF1F3',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  currencySelected: {
    backgroundColor: '#12263A',
  },
  currencyText: {
    color: '#526675',
    fontSize: 14,
    fontWeight: '800',
  },
  currencyTextSelected: {
    color: '#FFFFFF',
  },
  swapButton: {
    alignSelf: 'flex-start',
    borderColor: '#E35D38',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  swapText: {
    color: '#C94728',
    fontSize: 13,
    fontWeight: '800',
  },
  resultBox: {
    backgroundColor: '#E6F4FE',
    borderRadius: 16,
    marginTop: 24,
    padding: 18,
  },
  resultLabel: {
    color: '#526675',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  result: {
    color: '#12263A',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 5,
  },
  rateText: {
    color: '#526675',
    fontSize: 13,
    marginTop: 5,
  },
  disclaimer: {
    color: '#7B8D99',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 14,
    textAlign: 'center',
  },
});
