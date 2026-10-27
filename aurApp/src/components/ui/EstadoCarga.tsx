import { ActivityIndicator, Text, View } from 'react-native';

import { COLORES, TEXTOS_CARGA } from '@/constants/constants';
import { estadoCargaStyles as styles } from '@/css/Compartido';
import type { EstadoCargaProps } from '@/interfaces';

export function EstadoCarga({ texto = TEXTOS_CARGA.cargando }: EstadoCargaProps) {
  return (
    <View style={styles.contenedor} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={COLORES.primario} />
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}
