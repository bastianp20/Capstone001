import { Text, View } from 'react-native';

import { useCifrasAdopcionStyles } from '@/css/AdoptaPage';
import type { CifrasAdopcionProps } from '@/interfaces';

/** Tres números sobre el verde del encabezado ("12 esperan hogar · 8 revisados · 30 con familia"). */
export function CifrasAdopcion({ cifras }: CifrasAdopcionProps) {
  const styles = useCifrasAdopcionStyles();
  if (!cifras.length) return null;
  return (
    <View style={styles.fila}>
      {cifras.map((c) => (
        <View key={c.texto} style={styles.cifra}>
          <Text style={styles.valor}>{c.valor}</Text>
          <Text style={styles.texto} numberOfLines={1}>
            {c.texto}
          </Text>
        </View>
      ))}
    </View>
  );
}
