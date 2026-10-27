import { Image } from 'expo-image';
import { Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EncabezadoVerde } from '@/components/ui/EncabezadoVerde';
import { Icono } from '@/components/ui/Icono';
import { COLORES, HUELLAS_ENCABEZADO_LOGIN, TEXTOS_LOGIN } from '@/constants/constants';
import { encabezadoLoginStyles as styles } from '@/css/LoginPage';
import type { EncabezadoLoginProps } from '@/interfaces';

const IMAGEN_MASCOTAS = require('@/assets/images/login/mascotas-login.png');
const RELACION_IMAGEN = 497 / 663; // alto / ancho del PNG

/** Zona verde con el logo y el perro y el gato tipo sticker sobresaliendo de la onda. */
export function EncabezadoLogin({ alto }: EncabezadoLoginProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const anchoImagen = Math.min(width * 0.6, 260);

  return (
    <EncabezadoVerde
      huellas={HUELLAS_ENCABEZADO_LOGIN}
      style={[styles.contenedor, { height: alto + insets.top, paddingTop: insets.top + 14 }]}>
      <View style={styles.logo} accessibilityRole="header">
        <Icono nombre="huella" tamano={30} color={COLORES.blanco} grosor={2.4} />
        <Text style={styles.textoLogo}>{TEXTOS_LOGIN.marca}</Text>
      </View>

      <Image
        source={IMAGEN_MASCOTAS}
        style={[styles.mascotas, { width: anchoImagen, height: anchoImagen * RELACION_IMAGEN }]}
        contentFit="contain"
        accessibilityLabel="Un perro y un gato"
      />
    </EncabezadoVerde>
  );
}
