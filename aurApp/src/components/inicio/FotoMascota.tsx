import { Image } from 'expo-image';
import { View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { COLORES } from '@/constants/constants';
import { fotoMascotaStyles as styles } from '@/css/InicioPage';
import type { FotoMascotaProps } from '@/interfaces';

/** Foto grande y redonda de la mascota en el encabezado; sin foto, una huellita. */
export function FotoMascota({ mascota, diametro }: FotoMascotaProps) {
  const forma = { width: diametro, height: diametro, borderRadius: diametro / 2 };

  return (
    <View style={[styles.marco, forma]}>
      {mascota.fotoUrl ? (
        <Image
          source={{ uri: mascota.fotoUrl }}
          style={styles.imagen}
          contentFit="cover"
          transition={250}
          accessibilityLabel={`Foto de ${mascota.nombre}`}
        />
      ) : (
        <Icono nombre="huella" tamano={diametro * 0.42} color={COLORES.primario} grosor={1.6} />
      )}
    </View>
  );
}
