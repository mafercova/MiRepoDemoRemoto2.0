import { StyleSheet, Text, View } from 'react-native';
import  Cat  from './componentes/Cat';
import Mensaje from './componentes/Mensaje';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text style={styles.texto_rojo}>Esto es otro componente de texto</Text>
      <Cat></Cat>
      <Mensaje msg="Mi mensaje como propiedad"/>
      <Text style={styles.texto_morado}>ESTO ES UN TEXTO NUEVO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto_rojo: {
    color: 'red',
  },
  texto_morado: {
    color: 'purple',
    backgroundColor: 'yellow',
  }
});
