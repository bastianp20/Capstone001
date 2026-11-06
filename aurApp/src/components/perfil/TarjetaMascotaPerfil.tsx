import { Pressable, Text } from 'react-native';

import { AvatarMascota } from '@/components/ui/AvatarMascota';
import { ESPECIE_LABEL } from '@/constants/constants';
import { useTarjetaMascotaPerfilStyles } from '@/css/PerfilPage';
import type { TarjetaMascotaPerfilProps } from '@/interfaces';
import { useTonosTarjeta } from '@/context/TemaContext';

export function TarjetaMascotaPerfil({ mascota, tono, ancho, onPress }: TarjetaMascotaPerfilProps) {
  const TONOS_TARJETA = useTonosTarjeta();
  const styles = useTarjetaMascotaPerfilStyles();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Editar ${mascota.nombre}`}
      style={({ pressed }) => [styles.tarjeta, { width: ancho, backgroundColor: TONOS_TARJETA[tono].fondo }, pressed && styles.presionada]}>
      <AvatarMascota nombre={mascota.nombre} fotoUrl={mascota.fotoUrl} tamano={Math.round(ancho * 0.5)} tono={tono} />
      <Text style={styles.nombre} numberOfLines={1}>
        {mascota.nombre}
      </Text>
      <Text style={styles.especie} numberOfLines={1}>
        {mascota.raza || ESPECIE_LABEL[mascota.especie]}
      </Text>
    </Pressable>
  );
}
