import { ActivityIndicator, Pressable, Text } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { COLORES } from '@/constants/constants';
import { botonSecundarioStyles as styles } from '@/css/Compartido';
import type { BotonSecundarioProps } from '@/interfaces';

export function BotonSecundario({ texto, icono, onPress, tono = 'neutro', cargando }: BotonSecundarioProps) {
  const verde = tono === 'verde';
  const color = verde ? COLORES.primario : COLORES.texto;
  return (
    <Pressable
      onPress={onPress}
      disabled={cargando}
      accessibilityRole="button"
      accessibilityState={{ busy: cargando }}
      style={({ pressed }) => [styles.boton, verde && styles.verde, pressed && styles.presionado]}>
      {cargando ? <ActivityIndicator color={color} /> : icono && <Icono nombre={icono} tamano={20} color={color} />}
      <Text style={[styles.texto, { color }]}>{texto}</Text>
    </Pressable>
  );
}
