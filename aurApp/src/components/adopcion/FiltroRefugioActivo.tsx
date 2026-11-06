import { Pressable, Text, View } from 'react-native';

import { TEXTOS_ADOPTA as T } from '@/constants/constants';
import { useFiltroRefugioActivoStyles } from '@/css/AdoptaPage';
import type { FiltroRefugioActivoProps } from '@/interfaces';

import { Icono } from '@/components/ui/Icono';
import { useColores } from '@/context/TemaContext';

/** Aviso "Animales de <refugio>" con "Ver todos", cuando se llega desde un refugio. */
export function FiltroRefugioActivo({ nombre, onQuitar }: FiltroRefugioActivoProps) {
  const COLORES = useColores();
  const styles = useFiltroRefugioActivoStyles();
  return (
    <View style={styles.fila}>
      <Icono nombre="casa" tamano={18} color={COLORES.primarioOscuro} />
      <Text style={styles.texto} numberOfLines={1}>
        {T.refugioFiltro(nombre)}
      </Text>
      <Pressable onPress={onQuitar} hitSlop={8} accessibilityRole="button">
        <Text style={styles.quitar}>{T.quitarRefugio}</Text>
      </Pressable>
    </View>
  );
}
