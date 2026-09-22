import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Flatlist, Image, ActivityIndicator } from 'react-native';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://localhost:4000/movies')
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch(
        (error) => console.log(error)
      );
  }, []
);

if (loading) {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#07f" />
    </View>
  );
}

const renderItem = ({ item }) => (
  <View style={styles.card}>
    {item.poster ? (
      <Image source={{ uri: item.poster }} />
    ) : (
      <View>
        <Text>No Imagen</Text>
      </View>
    )}
    <View>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.fullplot || "Sin descripcion"}</Text>
    </View>
  </View>
); 

return (
  <Flatlist
    data={movies}
    keyExtractor={ (item) => item._id}
    renderItem={renderItem}
  />
);
}

const styles = StyleSheet.create({
  loader: {

  },
  card: {
    flexDirection:"row",
    padding:10,
    margin:10,
    backgroundColor:"#fff",
    borderRadius:10,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 10,
  },
  noPoster: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  plot: {
    fontSize: 12,
    color: '#666',
    
  },

});

