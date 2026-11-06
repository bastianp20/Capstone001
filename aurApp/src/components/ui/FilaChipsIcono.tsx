import { ScrollView } from 'react-native';

import { useFilaChipsIconoStyles } from '@/css/Compartido';
import type { FilaChipsIconoProps } from '@/interfaces';

import { ChipIcono } from './ChipIcono';

/** Fila deslizable de chips con ícono donde siempre hay uno elegido (por ejemplo, la especie). */
export function FilaChipsIcono<V extends string>({ opciones, valor, onCambiar }: FilaChipsIconoProps<V>) {
  const styles = useFilaChipsIconoStyles();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contenido}>
      {opciones.map((o) => (
        <ChipIcono key={o.valor} texto={o.texto} icono={o.icono ?? 'huella'} activo={o.valor === valor} onPress={() => onCambiar(o.valor)} />
      ))}
    </ScrollView>
  );
}
