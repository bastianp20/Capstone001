import { Text, View } from 'react-native';

import { ETIQUETAS_RASGOS_ADOPCION, NIVEL_MAXIMO_RASGO, RASGOS_ADOPCION, TEXTOS_FICHA_ADOPCION as T } from '@/constants/constants';
import { barrasRasgosStyles as styles } from '@/css/FichaAdopcionPage';
import type { BarrasRasgosProps } from '@/interfaces';

const NIVELES = Array.from({ length: NIVEL_MAXIMO_RASGO }, (_, i) => i + 1);

/** "¿Cómo es?": energía y qué tan sociable es, en barritas de 1 a 5. */
export function BarrasRasgos({ rasgos }: BarrasRasgosProps) {
  return (
    <View style={styles.lista}>
      {RASGOS_ADOPCION.map((rasgo) => {
        const nivel = rasgos[rasgo];
        return (
          <View key={rasgo} style={styles.fila} accessibilityLabel={`${ETIQUETAS_RASGOS_ADOPCION[rasgo]}: ${nivel ?? T.sinDato}`}>
            <Text style={styles.etiqueta}>{ETIQUETAS_RASGOS_ADOPCION[rasgo]}</Text>
            {nivel === null ? (
              <Text style={styles.sinDato}>{T.sinDato}</Text>
            ) : (
              <View style={styles.barras}>
                {NIVELES.map((n) => (
                  <View key={n} style={[styles.barra, n <= nivel && styles.barraLlena]} />
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
