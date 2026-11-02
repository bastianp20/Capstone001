import { Text, View } from 'react-native';

import { indicadorPasosStyles as styles } from '@/css/Compartido';
import type { IndicadorPasosProps } from '@/interfaces';

/** Barras finas por paso y sus nombres: "Mascota · Dónde · Día y hora". */
export function IndicadorPasos({ pasos, actual }: IndicadorPasosProps) {
  return (
    <View style={styles.contenedor} accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: pasos.length, now: actual + 1 }}>
      <View style={styles.barras}>
        {pasos.map((p, i) => (
          <View key={p} style={[styles.barra, i <= actual && styles.barraHecha]} />
        ))}
      </View>
      <Text style={styles.nombres}>
        {pasos.map((p, i) => (
          <Text key={p} style={i === actual ? styles.nombreActual : undefined}>
            {i > 0 ? ' · ' : ''}
            {p}
          </Text>
        ))}
      </Text>
    </View>
  );
}
