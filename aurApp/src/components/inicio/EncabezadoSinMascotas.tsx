import { Image } from 'expo-image';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AvatarIniciales } from '@/components/ui/AvatarIniciales';
import { EncabezadoVerde } from '@/components/ui/EncabezadoVerde';
import { HUELLAS_ENCABEZADO_INICIO, TEXTOS_INICIO } from '@/constants/constants';
import { encabezadoInicioStyles as styles } from '@/css/InicioPage';
import type { EncabezadoSinMascotasProps } from '@/interfaces';

const IMAGEN_MASCOTAS = require('@/assets/images/login/mascotas-login.png');
const RELACION_IMAGEN = 497 / 663;

/** Encabezado del inicio cuando el dueño todavía no registra mascotas. */
export function EncabezadoSinMascotas({ nombreUsuario, nombreCompleto, onIrAPerfil }: EncabezadoSinMascotasProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const anchoImagen = Math.min(width * 0.58, 250);

  return (
    <EncabezadoVerde huellas={HUELLAS_ENCABEZADO_INICIO} style={[styles.contenedor, { paddingTop: insets.top + 10 }]}>
      <View style={styles.filaSuperior}>
        <Text style={styles.saludo} numberOfLines={1}>
          {TEXTOS_INICIO.saludo}, {nombreUsuario}
        </Text>
        <Pressable onPress={onIrAPerfil} accessibilityRole="button" accessibilityLabel={TEXTOS_INICIO.irAPerfil} hitSlop={8}>
          <AvatarIniciales nombre={nombreCompleto} tamano={44} />
        </Pressable>
      </View>
      <View style={styles.sinMascotas}>
        <Image
          source={IMAGEN_MASCOTAS}
          style={{ width: anchoImagen, height: anchoImagen * RELACION_IMAGEN }}
          contentFit="contain"
          accessibilityLabel="Un perro y un gato"
        />
      </View>
    </EncabezadoVerde>
  );
}
