import { Pressable, Text, View } from 'react-native';

import { selectorPildorasStyles as styles } from '@/css/Compartido';
import type { SelectorPildorasProps } from '@/interfaces';

/**
 * Fila de píldoras para elegir una opción: mascotas en el inicio, filtros en las listas.
 * Hace salto de línea si no caben (sin ScrollView horizontal, que en Android se estiraba).
 */
export function SelectorPildoras<V extends string>({
  opciones,
  seleccionado,
  onSeleccionar,
  variante = 'claro',
  accesorioFinal,
}: SelectorPildorasProps<V>) {
  const sobrePrimario = variante === 'sobrePrimario';

  return (
    <View style={[styles.contenedor, sobrePrimario ? styles.contenedorSobrePrimario : styles.contenedorClaro]}>
      {opciones.map((o) => {
        const activa = o.valor === seleccionado;
        return (
          <Pressable
            key={o.valor}
            onPress={() => onSeleccionar(o.valor)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activa }}
            style={[styles.pildora, !sobrePrimario && styles.pildoraClara, activa && (sobrePrimario ? styles.activaSobrePrimario : styles.activaClaro)]}>
            <Text
              style={[
                styles.texto,
                sobrePrimario ? styles.textoSobrePrimario : styles.textoClaro,
                activa && (sobrePrimario ? styles.textoActivoSobrePrimario : styles.textoActivoClaro),
              ]}>
              {o.texto}
              {o.cantidad !== undefined && <Text style={styles.cantidad}> {o.cantidad}</Text>}
            </Text>
          </Pressable>
        );
      })}
      {accesorioFinal}
    </View>
  );
}
