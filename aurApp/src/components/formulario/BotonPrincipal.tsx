import { ActivityIndicator, Pressable, Text } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { COLORES } from '@/constants/constants';
import { botonPrincipalStyles as styles } from '@/css/Compartido';
import type { BotonPrincipalProps } from '@/interfaces';

export function BotonPrincipal({ texto, textoCargando, cargando, deshabilitado, onPress, tono = 'primario', conFlecha }: BotonPrincipalProps) {
  const inactivo = cargando || deshabilitado;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo, busy: cargando }}
      style={({ pressed }) => [styles.boton, styles[tono], pressed && styles.presionado, pressed && styles[`${tono}Presionado`], inactivo && styles.inactivo]}>
      {cargando && <ActivityIndicator color={COLORES.blanco} />}
      <Text style={styles.texto}>{cargando && textoCargando ? textoCargando : texto}</Text>
      {conFlecha && !cargando && <Icono nombre="flechaDerecha" tamano={20} color={COLORES.blanco} grosor={2.4} />}
    </Pressable>
  );
}
