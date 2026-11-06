import { Pressable, Text } from 'react-native';

import { useEnlaceTextoStyles } from '@/css/Compartido';
import type { EnlaceTextoProps } from '@/interfaces';

const ALINEACION = { izquierda: 'flex-start', centro: 'center', derecha: 'flex-end' } as const;

export function EnlaceTexto({ texto, onPress, alineacion = 'izquierda' }: EnlaceTextoProps) {
  const styles = useEnlaceTextoStyles();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="link"
      style={({ pressed }) => [{ alignSelf: ALINEACION[alineacion] }, pressed && styles.presionado]}>
      <Text style={styles.texto}>{texto}</Text>
    </Pressable>
  );
}
