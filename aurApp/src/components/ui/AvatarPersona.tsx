import { Image } from 'expo-image';

import { avatarPersonaStyles as styles } from '@/css/Compartido';
import type { AvatarPersonaProps } from '@/interfaces';

import { AvatarIniciales } from './AvatarIniciales';

/** Foto redonda de una persona; sin foto, sus iniciales. */
export function AvatarPersona({ nombre, fotoUrl, tamano, conBorde }: AvatarPersonaProps) {
  if (!fotoUrl) return <AvatarIniciales nombre={nombre} tamano={tamano} />;
  return (
    <Image
      source={{ uri: fotoUrl }}
      style={[styles.foto, conBorde && styles.borde, { width: tamano, height: tamano, borderRadius: tamano / 2 }]}
      contentFit="cover"
      accessibilityLabel={nombre}
    />
  );
}
