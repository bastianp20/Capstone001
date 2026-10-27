import { Text, View } from 'react-native';

import { bloqueFechaCitaStyles as styles } from '@/css/CitasPage';
import type { BloqueFechaCitaProps } from '@/interfaces';
import { partesFechaCita } from '@/lib/fechas';

/** Fecha estilo calendario: "MIÉ / 28 / OCT" y la hora debajo. */
export function BloqueFechaCita({ fechaHora }: BloqueFechaCitaProps) {
  const { dia, numero, mes, hora } = partesFechaCita(fechaHora);
  return (
    <View style={styles.contenedor}>
      <View style={styles.calendario}>
        <Text style={styles.dia}>{dia}</Text>
        <Text style={styles.numero}>{numero}</Text>
        <Text style={styles.mes}>{mes}</Text>
      </View>
      <Text style={styles.hora}>{hora}</Text>
    </View>
  );
}
