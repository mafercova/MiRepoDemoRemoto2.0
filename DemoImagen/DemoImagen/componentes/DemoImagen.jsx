import {StyleSheet, View , ImageBackground, Dimensions, Image, Text} from 'react-native';

const DemoImagen = () =>{
  return (
    <View style={styles.container} >
      <ImageBackground
        style={styles.fondo}
        source={require('../assets/fondo.jpg')}
      >
        <View style={styles.container}>
          <Text style={styles.titulo}>GARFIELD</Text>
        <Image style={styles.foto}
            source={{uri: 'https://depor.com/resizer/v2/HHC6ZU5D3NATHANHGULGLJTUZA.jpg?auth=c7c5c32d147fe389c641e53dff291eb9119fe08d19e6f3ad6afb3c71188aae3e&width=1600&height=1200&quality=90&smart=true'}}
        />

        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fondo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  foto: {
    width: 200,
    height: 200,
    borderRadius: 16,
    borderWidth: 10,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0,height: 2},
    shadowRadius: 10,
    elevation: 8,
  },
  titulo: {
  color: '#e6b632',
  fontSize: 28,
  fontWeight: 'bold',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: 10,
  marginBottom: 20,
  textAlign: 'center',
  alignSelf: 'stretch',
  },
},
);

export default DemoImagen;