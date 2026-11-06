import { Pressable, Text } from 'react-native';

import { TEXTOS_ADOPTA as T } from '@/constants/constants';
import { useBotonFiltrosStyles } from '@/css/AdoptaPage';
import type { BotonFiltrosProps } from '@/interfaces';

import { Icono } from '@/components/ui/Icono';
import { useColores } from '@/context/TemaContext';

/** Botón cuadrado que abre la hoja de filtros, con el número de filtros puestos. */
export function BotonFiltros({ cantidad, onPress }: BotonFiltrosProps) {
  const COLORES = useColores();
  const styles = useBotonFiltrosStyles();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={T.masFiltros} style={[styles.boton, cantidad > 0 && styles.activo]}>
      <Icono nombre="filtro" tamano={20} color={cantidad > 0 ? COLORES.primario : COLORES.texto} />
      {cantidad > 0 && <Text style={styles.numero}>{cantidad}</Text>}
    </Pressable>
  );
}
