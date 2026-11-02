import { Image } from 'expo-image';
import { View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { ICONO_ESPECIE_ADOPCION, TONOS_TARJETA } from '@/constants/constants';
import type { FotoAnimalProps } from '@/interfaces';

/** Foto cuadrada de un animal en adopción; sin foto, el ícono de su especie sobre durazno. */
export function FotoAnimal({ fotoUrl, especie, estilo }: FotoAnimalProps) {
  if (fotoUrl) return <Image source={{ uri: fotoUrl }} style={estilo} contentFit="cover" />;
  return (
    <View style={[estilo, { alignItems: 'center', justifyContent: 'center', backgroundColor: TONOS_TARJETA.durazno.fondo }]}>
      <Icono nombre={ICONO_ESPECIE_ADOPCION[especie]} tamano={28} color={TONOS_TARJETA.durazno.icono} />
    </View>
  );
}
