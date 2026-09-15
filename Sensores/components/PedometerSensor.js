import { useEffect, useState } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function PedometerSensor() {
    const [pasos, setPasos] = useState(0);

    useEffect(() => {
        let suscribir = null;
        let activo = true;

        const iniciar = async () => {
            try {
                const disponible = await Pedometer.isAvailableAsync();

                if (!disponible) {
                    return;
                }

                const permiso = await Pedometer.requestPermissionsAsync();

                if (!permiso.granted) {
                    return;
                }

                if (Platform.OS === 'ios') {
                    const fin = new Date();
                    const inicio = new Date();
                    inicio.setHours(0, 0, 0, 0);
                    const resultado = await Pedometer.getStepCountAsync(inicio, fin);

                    if (activo && resultado) {
                        setPasos(resultado.steps);
                    }
                }

                suscribir = Pedometer.watchStepCount((result) => {
                    if (activo) {
                        setPasos(result.steps);
                    }
                });
            } catch (error) {
                return;
            }
        };
        iniciar();

        return () => {
            activo = false;
            if (suscribir) {
                suscribir.remove();
            }
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Podometro</Text>
            <View style={styles.card}>
                <Text style={styles.axis}>Pasos </Text>
                <Text style={styles.value}> {pasos}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.axis}>Pasos Detectados </Text>
                <Text style={styles.value}>{pasos}</Text>
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
        marginBottom: 35,
        color: '#3a4a5a',
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