import { Pressable } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { SelectorPildoras } from '@/components/ui/SelectorPildoras';
import { TEXTOS_INICIO } from '@/constants/constants';
import { useSelectorMascotasStyles } from '@/css/InicioPage';
import type { SelectorMascotasProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

/** Píldoras con las mascotas del dueño y el botón "+" para agregar otra. */
export function SelectorMascotas({ mascotas, idSeleccionada, onSeleccionar, onAgregar }: SelectorMascotasProps) {
  const COLORES = useColores();
  const styles = useSelectorMascotasStyles();
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
