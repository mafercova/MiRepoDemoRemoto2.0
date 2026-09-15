import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Magnetometer } from 'expo-sensors';

const DIRECCIONES = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];

const obtenerRumbo = ({ x, y }) => {
    const angulo = Math.atan2(y, x) * (180 / Math.PI);
    return (angulo + 360) % 360;
};

const obtenerDireccion = (rumbo) => {
    const indice = Math.round(rumbo / 45) % DIRECCIONES.length;
    return DIRECCIONES[indice];
};

export default function Compass() {
    const [rumbo, setRumbo] = useState(0);
    const giro = useRef(new Animated.Value(0)).current;
    const rumboAnterior = useRef(0);

    useEffect(() => {
        const suscribir = Magnetometer.addListener((measurements) => {
            const nuevoRumbo = obtenerRumbo(measurements);
            let diferencia = nuevoRumbo - rumboAnterior.current;

            if (diferencia > 180) {
                diferencia -= 360;
            }

            if (diferencia < -180) {
                diferencia += 360;
            }

            const rumboContinuo = rumboAnterior.current + diferencia;
            rumboAnterior.current = rumboContinuo;
            setRumbo(((rumboContinuo % 360) + 360) % 360);

            Animated.timing(giro, {
                toValue: -rumboContinuo,
                duration: 180,
                useNativeDriver: true,
            }).start();
        });

        Magnetometer.setUpdateInterval(100);

        return () => {
            suscribir.remove();
            giro.stopAnimation();
        };
    }, [giro]);

    const rotacion = giro.interpolate({
        inputRange: [-360, 0, 360],
        outputRange: ['-360deg', '0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Brujula</Text>
            <Text style={styles.subtitle}>Gira el celular para encontrar el norte</Text>

            <View style={styles.compassFrame}>
                <View style={styles.marker} />
                <Animated.View style={[styles.rosa, { transform: [{ rotate: rotacion }] }]}>
                    <Text style={[styles.cardinal, styles.norte]}>N</Text>
                    <Text style={[styles.cardinal, styles.este]}>E</Text>
                    <Text style={[styles.cardinal, styles.sur]}>S</Text>
                    <Text style={[styles.cardinal, styles.oeste]}>O</Text>
                    <View style={styles.center} />
                </Animated.View>
            </View>

            <Text style={styles.heading}>{rumbo.toFixed(0)}°</Text>
            <Text style={styles.direction}>{obtenerDireccion(rumbo)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#eaf2f8',
    },
    title: {
        color: '#16324f',
        fontSize: 36,
        fontWeight: '800',
        marginBottom: 6,
    },
    subtitle: {
        color: '#5d7185',
        fontSize: 15,
        marginBottom: 28,
        textAlign: 'center',
    },
    compassFrame: {
        width: 290,
        height: 290,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 145,
        backgroundColor: '#f8fbfd',
        borderColor: '#9db5c9',
        borderWidth: 10,
        elevation: 12,
        shadowColor: '#274c67',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 14,
    },
    rosa: {
        width: 250,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 125,
        borderColor: '#d4e1eb',
        borderWidth: 2,
    },
    marker: {
        position: 'absolute',
        top: 4,
        zIndex: 2,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 22,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#d44747',
    },
    cardinal: {
        position: 'absolute',
        color: '#25465d',
        fontSize: 25,
        fontWeight: '800',
    },
    norte: {
        top: 13,
        color: '#d44747',
    },
    este: {
        right: 18,
    },
    sur: {
        bottom: 13,
    },
    oeste: {
        left: 18,
    },
    center: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#d44747',
        borderWidth: 4,
        borderColor: '#f8fbfd',
    },
    heading: {
        marginTop: 22,
        color: '#16324f',
        fontSize: 32,
        fontWeight: '800',
    },
    direction: {
        marginTop: 2,
        color: '#d44747',
        fontSize: 21,
        fontWeight: '700',
    },
});
