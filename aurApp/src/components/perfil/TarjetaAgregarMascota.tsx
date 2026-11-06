import { Pressable, Text } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { TEXTOS_PERFIL } from '@/constants/constants';
import { useTarjetaAgregarMascotaStyles } from '@/css/PerfilPage';
import type { TarjetaAgregarMascotaProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

export function TarjetaAgregarMascota({ ancho, onPress }: TarjetaAgregarMascotaProps) {
  const COLORES = useColores();
  const styles = useTarjetaAgregarMascotaStyles();
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
