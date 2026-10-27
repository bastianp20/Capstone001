import { Pressable, View } from 'react-native';

import { TONOS_TARJETA } from '@/constants/constants';
import { tarjetaPastelStyles as styles } from '@/css/Compartido';
import type { TarjetaPastelProps } from '@/interfaces';

/** Tarjeta de color pastel (menta, durazno, lavanda, crema). Es presionable solo si recibe onPress. */
export function TarjetaPastel({ tono, children, onPress, style }: TarjetaPastelProps) {
  const fondo = { backgroundColor: TONOS_TARJETA[tono].fondo };

  if (!onPress) return <View style={[styles.tarjeta, fondo, style]}>{children}</View>;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tarjeta, fondo, style, pressed && styles.presionada]}>
      {children}
    </Pressable>
  );
}
