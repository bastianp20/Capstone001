import { Text, View } from 'react-native';

import { useMiniGraficoStyles } from '@/css/Compartido';
import type { MiniGraficoBarrasProps } from '@/interfaces';
import { useColores, useTonosTarjeta } from '@/context/TemaContext';

const ALTO_MINIMO = 6; // un día sin citas igual muestra una barrita

/** Barras simples (por ejemplo, citas por día de la semana) con un día destacado. */
export function MiniGraficoBarras({ valores, etiquetas, indiceDestacado, alto = 64 }: MiniGraficoBarrasProps) {
  const COLORES = useColores();
  const TONOS_TARJETA = useTonosTarjeta();
  const styles = useMiniGraficoStyles();
  const maximo = Math.max(1, ...valores);
  return (
    <View style={styles.contenedor}>
      {valores.map((v, i) => {
        const destacado = i === indiceDestacado;
        return (
          <View key={i} style={styles.columna} accessibilityLabel={`${etiquetas[i]}: ${v}`}>
            <View style={[styles.zona, { height: alto }]}>
              <View
                style={[
                  styles.barra,
                  {
                    height: Math.max(ALTO_MINIMO, (v / maximo) * alto),
                    backgroundColor: destacado ? COLORES.primario : TONOS_TARJETA.menta.iconoFondo,
                  },
                ]}
              />
            </View>
            <Text style={[styles.etiqueta, destacado && styles.etiquetaDestacada]}>{etiquetas[i]}</Text>
          </View>
        );
      })}
    </View>
  );
}
