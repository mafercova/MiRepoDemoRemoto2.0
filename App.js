import { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Animated, Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import NavDrawer from './src/navigation/NavDrawer';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const animation = useRef(new Animated.Value(0)).current;
  const [showSplash, setShowSplash] = useState(Platform.OS === 'web');

  useEffect(() => {
    SplashScreen.hide();

    // The native splash already displays the logo on Android and iOS.
    // Keep the extra animated layer only for the web preview.
    if (!showSplash) {
      return undefined;
    }

    const splashAnimation = Animated.sequence([
      Animated.delay(250),
      Animated.timing(animation, {
        toValue: 1,
        duration: 700,
        useNativeDriver: false,
      }),
    ]);
    const hideFallback = setTimeout(() => setShowSplash(false), 1200);

    splashAnimation.start(({ finished }) => {
      if (finished) {
        clearTimeout(hideFallback);
        setShowSplash(false);
      }
    });

    return () => {
      clearTimeout(hideFallback);
      splashAnimation.stop();
    };
  }, [animation]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <NavDrawer />
      </NavigationContainer>
      <StatusBar style="light" />

      {showSplash && (
        <Animated.View
          style={[
            styles.splash,
            {
              opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}
        >
          <Animated.Image
            source={require('./assets/android-icon-foreground.png')}
            resizeMode="contain"
            style={[
              styles.splashImage,
              {
                transform: [
                  {
                    scale: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.15],
                    }),
                  },
                ],
              },
            ]}
          />
        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F8',
  },
  splash: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  splashImage: {
    height: 260,
    width: 260,
  },
});
