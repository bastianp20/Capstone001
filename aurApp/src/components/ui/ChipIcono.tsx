import { Pressable, Text } from 'react-native';

import { COLORES } from '@/constants/constants';
import { chipIconoStyles as styles } from '@/css/Compartido';
import type { ChipIconoProps } from '@/interfaces';

import { Icono } from './Icono';

/** Chip que se marca y desmarca, con su ícono (y un check cuando está marcado). */
export function ChipIcono({ texto, icono, activo, onPress }: ChipIconoProps) {
  const color = activo ? COLORES.blanco : COLORES.texto;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: activo }}
      style={({ pressed }) => [styles.chip, activo && styles.activo, pressed && styles.presionado]}>
      <Icono nombre={icono} tamano={15} color={activo ? COLORES.blanco : COLORES.primario} grosor={2} />
      <Text style={[styles.texto, { color }]}>{texto}</Text>
      {activo && <Icono nombre="check" tamano={14} color={COLORES.blanco} grosor={2.6} />}
    </Pressable>
  );
}
