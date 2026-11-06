import { Pressable, Text, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';

import { useTarjetaTipoAtencionStyles } from '@/css/SolidariaPage';
import type { TarjetaTipoAtencionProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

/** Tarjeta grande para elegir "Solidaria (gratis)" o "Con costo". */
export function TarjetaTipoAtencion({ icono, titulo, detalle, seleccionada, onPress }: TarjetaTipoAtencionProps) {
  const COLORES = useColores();
  const styles = useTarjetaTipoAtencionStyles();
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ selected: seleccionada }} style={[styles.tarjeta, seleccionada && styles.seleccionada]}>
      <View style={styles.fila}>
        <Icono nombre={icono} tamano={20} color={seleccionada ? COLORES.primario : COLORES.texto} />
        <Text style={styles.titulo}>{titulo}</Text>
      </View>
      {detalle && <Text style={styles.detalle}>{detalle}</Text>}
    </Pressable>
  );
}
