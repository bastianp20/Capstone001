import { Text, View } from 'react-native';

import { useTarjetaListaIconosStyles } from '@/css/Compartido';
import type { TarjetaListaIconosProps } from '@/interfaces';

import { Icono } from './Icono';
import { useColores } from '@/context/TemaContext';

/** Tarjeta blanca con un título y una lista corta, cada ítem con su ícono. */
export function TarjetaListaIconos({ titulo, items }: TarjetaListaIconosProps) {
  const COLORES = useColores();
  const styles = useTarjetaListaIconosStyles();
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.titulo}>{titulo}</Text>
      {items.map((it) => (
        <View key={it.texto} style={styles.item}>
          <Icono nombre={it.icono} tamano={20} color={COLORES.textoSecundario} />
          <Text style={styles.texto}>{it.texto}</Text>
        </View>
      ))}
    </View>
  );
}
