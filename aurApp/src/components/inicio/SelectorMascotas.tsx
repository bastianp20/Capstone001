import { Pressable } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { SelectorPildoras } from '@/components/ui/SelectorPildoras';
import { COLORES, TEXTOS_INICIO } from '@/constants/constants';
import { selectorMascotasStyles as styles } from '@/css/InicioPage';
import type { SelectorMascotasProps } from '@/interfaces';

/** Píldoras con las mascotas del dueño y el botón "+" para agregar otra. */
export function SelectorMascotas({ mascotas, idSeleccionada, onSeleccionar, onAgregar }: SelectorMascotasProps) {
  return (
    <SelectorPildoras
      opciones={mascotas.map((m) => ({ valor: String(m.id), texto: m.nombre }))}
      seleccionado={String(idSeleccionada)}
      onSeleccionar={(id) => onSeleccionar(Number(id))}
      variante="sobrePrimario"
      accesorioFinal={
        <Pressable
          onPress={onAgregar}
          accessibilityLabel={TEXTOS_INICIO.agregarMascota}
          style={({ pressed }) => [styles.botonAgregar, pressed && styles.presionado]}>
          <Icono nombre="mas" tamano={16} color={COLORES.blanco} grosor={2.4} />
        </Pressable>
      }
    />
  );
}
