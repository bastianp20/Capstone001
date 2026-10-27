import { View } from 'react-native';

import { HuellasDecorativas } from '@/components/ui/HuellasDecorativas';
import { COLORES, HUELLAS_FONDO_INICIO } from '@/constants/constants';
import { huellasFondoStyles as styles } from '@/css/InicioPage';

/** Huellitas y manchas suaves detrás de las tarjetas del inicio. */
export function HuellasFondo() {
  return (
    <View style={styles.capa} pointerEvents="none">
      <View style={styles.manchaIzquierda} />
      <View style={styles.manchaDerecha} />
      <HuellasDecorativas huellas={HUELLAS_FONDO_INICIO} color={COLORES.huellas} />
    </View>
  );
}
