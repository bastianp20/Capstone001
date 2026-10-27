import { Pressable, Text } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { COLORES, TEXTOS_PERFIL } from '@/constants/constants';
import { tarjetaAgregarMascotaStyles as styles } from '@/css/PerfilPage';
import type { TarjetaAgregarMascotaProps } from '@/interfaces';

export function TarjetaAgregarMascota({ ancho, onPress }: TarjetaAgregarMascotaProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.tarjeta, { width: ancho }, pressed && styles.presionada]}>
      <Icono nombre="mas" tamano={26} color={COLORES.texto} />
      <Text style={styles.texto}>{TEXTOS_PERFIL.agregarMascota}</Text>
    </Pressable>
  );
}
