import { useWindowDimensions, View } from 'react-native';

import { useEncabezadoVerdeStyles } from '@/css/Compartido';
import type { EncabezadoVerdeProps } from '@/interfaces';

import { HuellasDecorativas } from './HuellasDecorativas';
import { OndaEncabezado } from './OndaEncabezado';
import { useColores } from '@/context/TemaContext';

/**
 * Fondo verde con huellitas y la onda de abajo. Lo usan el inicio y el login;
 * cada pantalla pone su propio contenido adentro.
 */
export function EncabezadoVerde({ children, huellas, style }: EncabezadoVerdeProps) {
  const COLORES = useColores();
  const styles = useEncabezadoVerdeStyles();
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
