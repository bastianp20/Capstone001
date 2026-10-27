import { Text, View } from 'react-native';

import { avatarInicialesStyles as styles } from '@/css/Compartido';
import type { AvatarInicialesProps } from '@/interfaces';
import { iniciales } from '@/lib/texto';

/** Círculo blanco con borde verde y las iniciales: "BP". */
export function AvatarIniciales({ nombre, tamano }: AvatarInicialesProps) {
  return (
    <View style={[styles.circulo, { width: tamano, height: tamano, borderRadius: tamano / 2 }]} accessibilityLabel={nombre}>
      <Text style={[styles.texto, { fontSize: Math.round(tamano * 0.34) }]}>{iniciales(nombre)}</Text>
    </View>
  );
}
