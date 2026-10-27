import { useWindowDimensions, View } from 'react-native';

import { COLUMNAS_MASCOTAS_PERFIL, MARGEN_PANTALLA, SEPARACION_GRILLA_MASCOTAS, TONOS_MASCOTAS } from '@/constants/constants';
import { grillaMascotasStyles as styles } from '@/css/PerfilPage';
import type { GrillaMascotasProps } from '@/interfaces';

import { TarjetaAgregarMascota } from './TarjetaAgregarMascota';
import { TarjetaMascotaPerfil } from './TarjetaMascotaPerfil';

/** Mascotas del dueño en grilla de 3 columnas, con la tarjeta "Agregar mascota" al final. */
export function GrillaMascotas({ mascotas, onAbrir, onAgregar }: GrillaMascotasProps) {
  const { width } = useWindowDimensions();
  const ancho = (width - MARGEN_PANTALLA * 2 - SEPARACION_GRILLA_MASCOTAS * (COLUMNAS_MASCOTAS_PERFIL - 1)) / COLUMNAS_MASCOTAS_PERFIL;

  return (
    <View style={styles.grilla}>
      {mascotas.map((m, i) => (
        <TarjetaMascotaPerfil key={m.id} mascota={m} tono={TONOS_MASCOTAS[i % TONOS_MASCOTAS.length]} ancho={ancho} onPress={() => onAbrir(m)} />
      ))}
      <TarjetaAgregarMascota ancho={ancho} onPress={onAgregar} />
    </View>
  );
}
