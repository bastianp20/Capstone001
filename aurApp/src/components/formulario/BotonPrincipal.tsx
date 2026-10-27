import { ActivityIndicator, Pressable, Text } from 'react-native';

import { COLORES } from '@/constants/constants';
import { botonPrincipalStyles as styles } from '@/css/Compartido';
import type { BotonPrincipalProps } from '@/interfaces';

export function BotonPrincipal({ texto, textoCargando, cargando, deshabilitado, onPress }: BotonPrincipalProps) {
  const inactivo = cargando || deshabilitado;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo, busy: cargando }}
      style={({ pressed }) => [styles.boton, pressed && styles.presionado, inactivo && styles.inactivo]}>
      {cargando && <ActivityIndicator color={COLORES.blanco} />}
      <Text style={styles.texto}>{cargando && textoCargando ? textoCargando : texto}</Text>
    </Pressable>
  );
}
