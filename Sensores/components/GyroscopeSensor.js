import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Gyroscope } from 'expo-sensors';

export default function GyroscopeSensor() {
    const [datos, setDatos] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const pelotaX = useRef(new Animated.Value(0)).current;
    const pelotaY = useRef(new Animated.Value(0)).current;
    const posicionRef = useRef({ x: 0, y: 0 });
    const ultimoTiempoRef = useRef(Date.now());

    useEffect(() => {
        const suscribir = Gyroscope.addListener((measurements) => {
            setDatos(measurements);

            const ahora = Date.now();
            const delta = Math.min((ahora - ultimoTiempoRef.current) / 1000, 0.1);
            const posicion = posicionRef.current;
            const limiteX = 108;
            const limiteY = 128;

            posicion.x = Math.max(-limiteX, Math.min(limiteX, posicion.x + measurements.y * 180 * delta));
            posicion.y = Math.max(-limiteY, Math.min(limiteY, posicion.y - measurements.x * 180 * delta));

            pelotaX.setValue(posicion.x);
            pelotaY.setValue(posicion.y);
            ultimoTiempoRef.current = ahora;
        });
        Gyroscope.setUpdateInterval(50);

        return () => {
            suscribir.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giroscopio</Text>
            <View style={styles.tablero}>
                <Animated.View
                    style={[
                        styles.pelota,
                        {
                            transform: [
                                { translateX: pelotaX },
                                { translateY: pelotaY },
                            ],
                        },
                    ]}
                />
            </View>
            <Text style={styles.instruction}>Mueve el celular para mover la pelota</Text>
            <View style={styles.card}>
                <Text style={styles.axis}>X </Text>
                <Text style={styles.value}> {datos.x.toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.axis}>Y </Text>
                <Text style={styles.value}> {datos.y.toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.axis}>Z </Text>
                <Text style={styles.value}> {datos.z.toFixed(2)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 25,
        backgroundColor: '#efefef',
    },
    title: {
        fontSize: 35,
        textAlign: 'center',
        marginBottom: 20,
        color: '#3a4a5a',
    },
    tablero: {
        width: 260,
        height: 300,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderRadius: 28,
        borderWidth: 4,
        borderColor: '#b7c7d9',
        backgroundColor: '#dcecff',
        overflow: 'hidden',
        shadowColor: '#45627d',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 12,
        elevation: 8,
    },
    pelota: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#ef5b5b',
        borderWidth: 4,
        borderColor: '#b72f45',
        shadowColor: '#8f2035',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 7,
        elevation: 8,
    },
    instruction: {
        marginBottom: 18,
        color: '#526b83',
        fontSize: 15,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    axis: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});