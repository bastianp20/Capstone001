import { Text, View } from 'react-native';

import { HITOS_CAMINO_CASA } from '@/constants/constants';
import { useCaminoACasaStyles } from '@/css/MisPublicacionesPage';
import type { CaminoACasaProps } from '@/interfaces';
import { hitosCumplidos } from '@/lib/adopcion';

/** El "camino a casa" en 5 puntitos: publicado, revisado, postulan, familia elegida, adoptado. */
export function CaminoACasa({ publicacion }: CaminoACasaProps) {
  const styles = useCaminoACasaStyles();
  const hechos = hitosCumplidos(publicacion);
  return (
    <View style={styles.fila}>
      {HITOS_CAMINO_CASA.map((h, i) => {
        const hecho = hechos.has(h.hito);
        const siguienteHecho = i < HITOS_CAMINO_CASA.length - 1 && hechos.has(HITOS_CAMINO_CASA[i + 1].hito);
        return (
          <View key={h.hito} style={styles.hito} accessibilityLabel={`${h.texto}${hecho ? ' ✓' : ''}`}>
            {i < HITOS_CAMINO_CASA.length - 1 && <View style={[styles.linea, siguienteHecho && styles.lineaHecha]} />}
            <View style={[styles.punto, hecho && styles.puntoHecho]} />
            <Text style={[styles.texto, hecho && styles.textoHecho]} numberOfLines={1}>
              {h.texto}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
