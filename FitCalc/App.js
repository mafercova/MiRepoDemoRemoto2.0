import { StyleSheet, Text, View, TextInput, Button, Modal } from 'react-native';
import React, {useState} from 'react';

export default function App() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setImc] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const calcularIMC = () => {
    const alturaMetros = altura / 100;
    const imcCalculado = peso / (alturaMetros * alturaMetros);
    setImc(imcCalculado.toFixed(4));
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculadora IMC</Text>
      <TextInput style={styles.input}
        placeholder="Peso (kg)"
        value={peso}
        onChangeText={setPeso}
      />
      <TextInput style={styles.input}
        placeholder="Altura (cm)"
        value={altura}
        onChangeText={setAltura}
      />
      <Button title="Calcular IMC" onPress={calcularIMC} />
      <Modal
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalResult}>Resultado: {imc}</Text>
          <Button title="Cerrar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    fontSize: 18,
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalResult: {
    fontSize: 24,
    fontWeight: 'bold',
  },

});
