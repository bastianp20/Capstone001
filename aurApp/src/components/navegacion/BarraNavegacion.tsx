import { Pressable, Text, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { COLORES, SEPARACION_BARRA_NAVEGACION } from '@/constants/constants';

import { barraNavegacionStyles as styles } from '@/css/Navegacion';
import type { BarraNavegacionProps } from '@/interfaces';

/** Barra inferior flotante (la usan todos los roles, cada uno con sus pestañas). */
export function BarraNavegacion({ state, emitter, navigateToTab, insets, pestanas }: BarraNavegacionProps) {
  return (
    <View
      style={[styles.contenedor, { bottom: Math.max(insets.bottom, 8) + SEPARACION_BARRA_NAVEGACION - 8 }]}
      pointerEvents="box-none">
      <View style={styles.barra}>
        {state.routes.map((ruta, indice) => {
          const pestana = pestanas.find((p) => p.nombreRuta === ruta.name);
          if (!pestana) return null;

          const activa = state.index === indice;

          const alPresionar = () => {
            const evento = emitter.emit({ type: 'tabPress', target: ruta.key, canPreventDefault: true });
            if (!activa && !evento.defaultPrevented) navigateToTab(ruta.key);
          };

          return (
            <Pressable
              key={ruta.key}
              onPress={alPresionar}
              accessibilityRole="tab"
              accessibilityState={{ selected: activa }}
              accessibilityLabel={pestana.titulo}
              style={({ pressed }) => [styles.boton, pressed && !activa && styles.botonPresionado]}>
              <View style={[styles.contenedorIcono, activa && styles.contenedorIconoActivo]}>
                <Icono
                  nombre={pestana.icono}
                  tamano={22}
                  color={activa ? COLORES.primario : COLORES.textoSecundario}
                  grosor={activa ? 2.3 : 1.9}
                />
              </View>
              <Text style={[styles.etiqueta, activa && styles.etiquetaActiva]}>{pestana.titulo}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
