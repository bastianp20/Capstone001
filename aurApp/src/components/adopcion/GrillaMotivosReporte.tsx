import { Pressable, Text, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { MOTIVOS_REPORTE } from '@/constants/constants';
import { grillaMotivosStyles as styles } from '@/css/PostularAdopcionPage';
import type { GrillaMotivosReporteProps } from '@/interfaces';

/** "¿Qué está pasando?": mosaicos de colores para elegir el motivo del reporte. */
export function GrillaMotivosReporte({ valor, onCambiar }: GrillaMotivosReporteProps) {
  return (
    <View style={styles.grilla} accessibilityRole="radiogroup">
      {MOTIVOS_REPORTE.map((m) => {
        const elegido = m.valor === valor;
        return (
          <Pressable
            key={m.valor}
            onPress={() => onCambiar(m.valor)}
            accessibilityRole="radio"
            accessibilityState={{ selected: elegido }}
            style={[styles.motivo, { backgroundColor: m.fondo }, elegido && styles.elegido]}>
            <View style={styles.icono}>
              <Icono nombre={m.icono} tamano={19} color={m.color} />
            </View>
            <Text style={styles.texto}>{m.texto}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
