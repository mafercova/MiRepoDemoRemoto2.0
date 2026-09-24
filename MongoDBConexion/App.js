import React, { useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const API_URL = 'http://localhost:4000';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const modalAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!authenticated) {
      return undefined;
    }

    fetch(`${API_URL}/movies`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de películas.');
        }
        return response.json();
      })
      .then((data) => setMovies(data))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [authenticated, token]);

  useEffect(() => {
    if (!selectedMovie) {
      return undefined;
    }

    modalAnimation.setValue(0);
    setModalVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    return undefined;
  }, [modalAnimation, selectedMovie]);

  const closeMovieModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setModalVisible(false);
        setSelectedMovie(null);
      }
    });
  };

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError('Escribe el usuario y la contraseña.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!response.ok) {
        throw new Error('Usuario o contraseña incorrectos.');
      }

      const data = await response.json();
      setToken(data.token || '');
      setAuthenticated(true);
    } catch (requestError) {
      setLoading(false);
      setError(requestError.message || 'No se pudo iniciar sesión.');
    }
  };

if (!authenticated) {
  return (
    <View style={styles.loginScreen}>
      <StatusBar barStyle="dark-content" backgroundColor="#edf5f3" />
      <View style={styles.loginHeader}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>M</Text>
        </View>
        <Text style={styles.brandName}>MFLIX</Text>
        <Text style={styles.loginKicker}>TU CATÁLOGO DE CINE</Text>
      </View>
      <View style={styles.loginCard}>
        <Text style={styles.loginEyebrow}>ACCESO SEGURO</Text>
        <Text style={styles.heading}>Bienvenido de nuevo</Text>
        <Text style={styles.subtitle}>Inicia sesión para explorar las películas de sample_mflix.</Text>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Usuario de MongoDB</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setUsername}
            placeholder="Escribe tu usuario"
            placeholderTextColor="#8a9aa0"
            style={styles.input}
            value={username}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Contraseña</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setPassword}
            placeholder="Escribe tu contraseña"
            placeholderTextColor="#8a9aa0"
            secureTextEntry
            style={styles.input}
            value={password}
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          disabled={loading}
          onPress={handleLogin}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </Pressable>
        <Text style={styles.loginHint}>Usa las credenciales de tu usuario de base de datos.</Text>
      </View>
    </View>
  );
}

if (loading) {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#07f" />
    </View>
  );
}

if (error) {
  return (
    <View style={styles.loader}>
      <Text style={styles.error}>{error}</Text>
    </View>
  );
}

const featuredMovie = movies[0];

const renderItem = ({ item }) => (
  <Pressable
    onPress={() => setSelectedMovie(item)}
    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
  >
    {item.poster ? (
      <Image source={{ uri: item.poster }} style={styles.poster} />
    ) : (
      <View style={styles.noPoster}>
        <Text>No Imagen</Text>
      </View>
    )}
    <View style={styles.info}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.plot}>{item.fullplot || 'Sin descripcion'}</Text>
    </View>
  </Pressable>
);

return (
  <View style={styles.appScreen}>
    <StatusBar barStyle="dark-content" backgroundColor="#f3f7f6" />
    <FlatList
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={movies.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No hay películas disponibles</Text>
          <Text style={styles.emptyText}>La colección no devolvió resultados.</Text>
        </View>
      ) : null}
      ListHeaderComponent={(
        <>
          <View style={styles.catalogHeader}>
            <View style={styles.catalogCopy}>
              <Text style={styles.catalogEyebrow}>SAMPLE MFLIX</Text>
              <Text style={styles.catalogTitle}>Descubre una película</Text>
              <Text style={styles.catalogSubtitle}>Historias para ver, explorar y recordar.</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countNumber}>{movies.length}</Text>
              <Text style={styles.countLabel}>títulos</Text>
            </View>
          </View>
          {featuredMovie ? (
            <Pressable
              onPress={() => setSelectedMovie(featuredMovie)}
              style={({ pressed }) => [styles.featuredCard, pressed && styles.cardPressed]}
            >
              {featuredMovie.poster ? (
                <Image source={{ uri: featuredMovie.poster }} style={styles.featuredPoster} />
              ) : (
                <View style={[styles.featuredPoster, styles.noPoster]}>
                  <Text>Sin imagen</Text>
                </View>
              )}
              <View style={styles.featuredShade} />
              <View style={styles.featuredContent}>
                <Text style={styles.featuredEyebrow}>SELECCIÓN DESTACADA</Text>
                <Text numberOfLines={2} style={styles.featuredTitle}>{featuredMovie.title}</Text>
                <Text numberOfLines={2} style={styles.featuredPlot}>
                  {featuredMovie.fullplot || 'Descubre todos los detalles de esta película.'}
                </Text>
                <View style={styles.featuredMeta}>
                  <Text style={styles.featuredAction}>Ver detalles</Text>
                  <Text style={styles.featuredArrow}>›</Text>
                </View>
              </View>
            </Pressable>
          ) : null}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Todas las películas</Text>
            <Text style={styles.sectionHint}>Toca para ver más</Text>
          </View>
        </>
      )}
      data={movies.slice(1)}
      renderItem={renderItem}
    />

    <Modal
      animationType="none"
      onRequestClose={closeMovieModal}
      transparent
      visible={modalVisible}
    >
      <Animated.View
        style={[
          styles.modalBackdrop,
          { opacity: modalAnimation },
        ]}
      >
        <Animated.View
          style={[
            styles.modalCard,
            {
              opacity: modalAnimation,
              transform: [
                {
                  translateY: modalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [36, 0],
                  }),
                },
                {
                  scale: modalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.96, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <ScrollView contentContainerStyle={styles.modalContent}>
            {selectedMovie?.poster ? (
              <Image source={{ uri: selectedMovie.poster }} style={styles.modalPoster} />
            ) : null}
            <Text style={styles.modalEyebrow}>DETALLE DE LA PELÍCULA</Text>
            <Text style={styles.modalTitle}>{selectedMovie?.title}</Text>
            <View style={styles.modalMetaRow}>
              {selectedMovie?.year ? (
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>{selectedMovie.year}</Text>
                </View>
              ) : null}
              {selectedMovie?.runtime ? (
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>{selectedMovie.runtime} min</Text>
                </View>
              ) : null}
              {selectedMovie?.rated ? (
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>{selectedMovie.rated}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.modalLabel}>Descripción</Text>
            <Text style={styles.modalText}>{selectedMovie?.fullplot || 'Sin descripcion'}</Text>
            {selectedMovie?.genres?.length ? (
              <Text style={styles.modalText}>Géneros: {selectedMovie.genres.join(', ')}</Text>
            ) : null}
            {selectedMovie?.directors?.length ? (
              <Text style={styles.modalText}>Director: {selectedMovie.directors.join(', ')}</Text>
            ) : null}
            {selectedMovie?.cast?.length ? (
              <Text style={styles.modalText}>Reparto: {selectedMovie.cast.slice(0, 5).join(', ')}</Text>
            ) : null}
            {selectedMovie?.countries?.length ? (
              <Text style={styles.modalText}>Países: {selectedMovie.countries.join(', ')}</Text>
            ) : null}
            <Pressable onPress={closeMovieModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  </View>
);
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  appScreen: {
    flex: 1,
    backgroundColor: '#f3f7f6',
  },
  loginScreen: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#edf5f3',
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandMark: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 54,
    height: 54,
    marginBottom: 10,
    borderRadius: 18,
    backgroundColor: '#153243',
    transform: [{ rotate: '-6deg' }],
  },
  brandMarkText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  brandName: {
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: 3,
    color: '#153243',
  },
  loginKicker: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: '#087f8c',
  },
  loginCard: {
    padding: 26,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#153243',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  loginEyebrow: {
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: '#087f8c',
  },
  heading: {
    fontSize: 27,
    fontWeight: '700',
    lineHeight: 33,
    color: '#153243',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 22,
    lineHeight: 19,
    color: '#60717b',
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    marginBottom: 7,
    fontSize: 12,
    fontWeight: '700',
    color: '#34454d',
  },
  input: {
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#d2dfe0',
    borderRadius: 11,
    backgroundColor: '#f8fbfa',
  },
  button: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 11,
    backgroundColor: '#087f8c',
    shadowColor: '#087f8c',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  error: {
    marginBottom: 12,
    color: '#b42318',
  },
  loginHint: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
    color: '#8a9aa0',
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#153243',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },
  featuredCard: {
    minHeight: 270,
    marginBottom: 24,
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: '#153243',
    shadowColor: '#153243',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 6,
  },
  featuredPoster: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  featuredShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 31, 42, 0.68)',
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  featuredEyebrow: {
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: '#a6e2dd',
  },
  featuredTitle: {
    maxWidth: '90%',
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 31,
    color: '#fff',
  },
  featuredPlot: {
    maxWidth: '92%',
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: '#d5e5e5',
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  featuredAction: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
  },
  featuredArrow: {
    marginLeft: 8,
    fontSize: 23,
    lineHeight: 18,
    color: '#a6e2dd',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#153243',
  },
  sectionHint: {
    fontSize: 11,
    color: '#809196',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  catalogHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 26,
    paddingBottom: 22,
  },
  catalogCopy: {
    flex: 1,
    marginRight: 12,
  },
  catalogEyebrow: {
    marginBottom: 7,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#087f8c',
  },
  catalogTitle: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 33,
    color: '#153243',
  },
  catalogSubtitle: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
    color: '#60717b',
  },
  countBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: '#153243',
  },
  countNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  countLabel: {
    marginTop: 1,
    fontSize: 10,
    color: '#b8d8d7',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#153243',
  },
  emptyText: {
    marginTop: 6,
    color: '#60717b',
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
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modalCard: {
    maxHeight: '90%',
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: '#fff',
    shadowColor: '#06151c',
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  modalContent: {
    padding: 22,
    paddingBottom: 24,
  },
  modalPoster: {
    alignSelf: 'center',
    width: 140,
    height: 210,
    marginBottom: 18,
    borderRadius: 16,
    backgroundColor: '#dbe8e8',
  },
  modalEyebrow: {
    marginBottom: 6,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#087f8c',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 33,
    color: '#153243',
  },
  modalMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  metaChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#e5f3f2',
  },
  metaChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#087f8c',
  },
  modalLabel: {
    marginTop: 18,
    marginBottom: 7,
    fontSize: 15,
    fontWeight: '700',
    color: '#153243',
  },
  modalText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#34454d',
  },
  closeButton: {
    alignItems: 'center',
    minHeight: 46,
    justifyContent: 'center',
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: '#153243',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

});

