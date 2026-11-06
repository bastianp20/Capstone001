import { ActivityIndicator, Text, View } from 'react-native';

import { TEXTOS_CARGA } from '@/constants/constants';
import { useEstadoCargaStyles } from '@/css/Compartido';
import type { EstadoCargaProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

export function EstadoCarga({ texto = TEXTOS_CARGA.cargando }: EstadoCargaProps) {
  const COLORES = useColores();
  const styles = useEstadoCargaStyles();
  return (
    <View style={styles.contenedor} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={COLORES.primario} />
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}
