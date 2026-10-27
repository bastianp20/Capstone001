import { View } from 'react-native';

import { COLORES } from '@/constants/constants';
import { barraProgresoStyles as styles } from '@/css/Compartido';
import type { BarraProgresoProps } from '@/interfaces';

export function BarraProgreso({ progreso, color = COLORES.primario }: BarraProgresoProps) {
  const ancho = `${Math.round(Math.max(0, Math.min(1, progreso)) * 100)}%` as const;
  return (
    <View style={styles.fondo} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(progreso * 100) }}>
      <View style={[styles.relleno, { width: ancho, backgroundColor: color }]} />
    </View>
  );
}
