import { View } from 'react-native';

import { HuellasDecorativas } from '@/components/ui/HuellasDecorativas';
import { HUELLAS_FONDO_INICIO } from '@/constants/constants';
import { useHuellasFondoStyles } from '@/css/InicioPage';
import { useColores } from '@/context/TemaContext';

/** Huellitas y manchas suaves detrás de las tarjetas del inicio. */
export function HuellasFondo() {
  const COLORES = useColores();
  const styles = useHuellasFondoStyles();
  return (
    <View style={styles.capa} pointerEvents="none">
      <View style={styles.manchaIzquierda} />
      <View style={styles.manchaDerecha} />
      <HuellasDecorativas huellas={HUELLAS_FONDO_INICIO} color={COLORES.huellas} />
    </View>
  );
}
