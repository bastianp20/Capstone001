import { Pressable, Text, View } from 'react-native';

import { NIVEL_MAXIMO_RASGO, TEXTOS_PUBLICAR as T } from '@/constants/constants';
import { selectorNivelStyles as styles } from '@/css/PublicarAdopcionPage';
import type { SelectorNivelProps } from '@/interfaces';

const NIVELES = Array.from({ length: NIVEL_MAXIMO_RASGO }, (_, i) => i + 1);

/** Elegir de 1 a 5 (o "No sé") para un rasgo, como la energía. */
export function SelectorNivel({ titulo, valor, onCambiar }: SelectorNivelProps) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{titulo}</Text>
      <View style={styles.fila} accessibilityRole="radiogroup" accessibilityLabel={titulo}>
        {NIVELES.map((n) => {
          const activo = n === valor;
          return (
            <Pressable key={n} onPress={() => onCambiar(n)} accessibilityRole="radio" accessibilityState={{ selected: activo }} style={[styles.nivel, activo && styles.nivelActivo]}>
              <Text style={[styles.nivelTexto, activo && styles.nivelTextoActivo]}>{n}</Text>
            </Pressable>
          );
        })}
        <Pressable onPress={() => onCambiar(null)} accessibilityRole="radio" accessibilityState={{ selected: valor === null }} style={[styles.noSe, valor === null && styles.noSeActivo]}>
          <Text style={[styles.noSeTexto, valor === null && styles.noSeTextoActivo]}>{T.noSe}</Text>
        </Pressable>
      </View>
    </View>
  );
}
