import { Pressable, Text } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { COLORES } from '@/constants/constants';
import { botonSecundarioStyles as styles } from '@/css/Compartido';
import type { BotonSecundarioProps } from '@/interfaces';

export function BotonSecundario({ texto, icono, onPress }: BotonSecundarioProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.boton, pressed && styles.presionado]}>
      {icono && <Icono nombre={icono} tamano={20} color={COLORES.texto} />}
      <Text style={styles.texto}>{texto}</Text>
    </Pressable>
  );
}
