import { Text, View } from 'react-native';

import { lineaDeTiempoStyles as styles } from '@/css/HistorialPage';
import type { LineaDeTiempoProps } from '@/interfaces';

import { ItemLineaDeTiempo } from './ItemLineaDeTiempo';

/** Historial agrupado por mes, del más reciente al más antiguo. */
export function LineaDeTiempo({ grupos, mostrarMascota }: LineaDeTiempoProps) {
  return (
    <View style={styles.contenedor}>
      {grupos.map((grupo, g) => (
        <View key={grupo.titulo} style={styles.grupo}>
          <Text style={styles.mes} accessibilityRole="header">
            {grupo.titulo}
          </Text>
          {grupo.items.map((item, i) => (
            <ItemLineaDeTiempo
              key={item.clave}
              item={item}
              mostrarMascota={mostrarMascota}
              ultimo={g === grupos.length - 1 && i === grupo.items.length - 1}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
