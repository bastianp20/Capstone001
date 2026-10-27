import { Image } from 'expo-image';
import { View } from 'react-native';

import { TONOS_TARJETA } from '@/constants/constants';
import { avatarMascotaStyles as styles } from '@/css/Compartido';
import type { AvatarMascotaProps } from '@/interfaces';

import { Icono } from './Icono';

/** Foto redonda de la mascota; sin foto, una huellita sobre color pastel. */
export function AvatarMascota({ nombre, fotoUrl, tamano, tono = 'menta' }: AvatarMascotaProps) {
  const forma = { width: tamano, height: tamano, borderRadius: tamano / 2 };

  if (fotoUrl) {
    return <Image source={{ uri: fotoUrl }} style={[styles.foto, forma]} contentFit="cover" accessibilityLabel={`Foto de ${nombre}`} />;
  }
  const colores = TONOS_TARJETA[tono];
  return (
    <View style={[styles.sinFoto, forma, { backgroundColor: colores.iconoFondo }]} accessibilityLabel={nombre}>
      <Icono nombre="huella" tamano={Math.round(tamano * 0.5)} color={colores.icono} grosor={1.8} />
    </View>
  );
}
