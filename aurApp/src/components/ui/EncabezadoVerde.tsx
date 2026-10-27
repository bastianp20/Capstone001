import { useWindowDimensions, View } from 'react-native';

import { COLORES } from '@/constants/constants';
import { encabezadoVerdeStyles as styles } from '@/css/Compartido';
import type { EncabezadoVerdeProps } from '@/interfaces';

import { HuellasDecorativas } from './HuellasDecorativas';
import { OndaEncabezado } from './OndaEncabezado';

/**
 * Fondo verde con huellitas y la onda de abajo. Lo usan el inicio y el login;
 * cada pantalla pone su propio contenido adentro.
 */
export function EncabezadoVerde({ children, huellas, style }: EncabezadoVerdeProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.contenedor, style]}>
      {/* Extiende el verde hacia arriba para que el rebote del scroll en iOS no muestre blanco */}
      <View style={styles.extensionSuperior} />
      <HuellasDecorativas huellas={huellas} color={COLORES.huellaSobrePrimario} />
      <OndaEncabezado ancho={width} />
      {children}
    </View>
  );
}
