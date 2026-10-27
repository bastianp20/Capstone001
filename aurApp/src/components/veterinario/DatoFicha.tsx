import { Text, View } from 'react-native';

import { datoFichaStyles as styles } from '@/css/VeterinarioPage';
import type { DatoFichaProps } from '@/interfaces';

/** Un dato chico de la ficha: "Peso · 28 kg". */
export function DatoFicha({ etiqueta, valor }: DatoFichaProps) {
  return (
    <View style={styles.dato}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}
