import { Text } from 'react-native';

import { useIndicadorPastelStyles } from '@/css/Compartido';
import type { IndicadorPastelProps } from '@/interfaces';

import { TarjetaPastel } from './TarjetaPastel';

/** Número sobre una tarjeta de color: "Por confirmar 3". */
export function IndicadorPastel({ tono, etiqueta, valor, detalle, onPress }: IndicadorPastelProps) {
  const styles = useIndicadorPastelStyles();
  return (
    <TarjetaPastel tono={tono} onPress={onPress} style={styles.tarjeta}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.valor}>{valor}</Text>
      {detalle && <Text style={styles.detalle}>{detalle}</Text>}
    </TarjetaPastel>
  );
}
