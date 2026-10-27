import { Text, View } from 'react-native';

import { detalleRecetaStyles as styles } from '@/css/HistorialPage';
import type { DetalleRecetaProps } from '@/interfaces';

/** Medicamentos de una receta: nombre, dosis, frecuencia y duración. */
export function DetalleReceta({ receta }: DetalleRecetaProps) {
  return (
    <View style={styles.contenedor}>
      {receta.medicamentos.map((m, i) => (
        <View key={`${m.nombre}-${i}`} style={styles.medicamento}>
          <Text style={styles.nombre}>{m.nombre}</Text>
          <Text style={styles.detalle}>{[m.dosis, m.frecuencia, m.duracion].join(' · ')}</Text>
        </View>
      ))}
    </View>
  );
}
