import { Image } from 'expo-image';
import { View } from 'react-native';

import { Icono } from '@/components/ui/Icono';

import { useFotoMascotaStyles } from '@/css/InicioPage';
import type { FotoMascotaProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

/** Foto grande y redonda de la mascota en el encabezado; sin foto, una huellita. */
export function FotoMascota({ mascota, diametro }: FotoMascotaProps) {
  const COLORES = useColores();
  const styles = useFotoMascotaStyles();
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
