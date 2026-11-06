import { Text, View } from 'react-native';

import { useTarjetaAccionStyles } from '@/css/Compartido';
import type { TarjetaAccionProps } from '@/interfaces';

import { CirculoIcono } from './CirculoIcono';
import { Icono } from './Icono';
import { TarjetaPastel } from './TarjetaPastel';
import { useColores, useTonosTarjeta } from '@/context/TemaContext';

/** Fila de color que lleva a otra pantalla: "Aprobaciones pendientes · 3 >". */
export function TarjetaAccion({ icono, tono, titulo, detalle, cantidad, onPress }: TarjetaAccionProps) {
  const COLORES = useColores();
  const TONOS_TARJETA = useTonosTarjeta();
  const styles = useTarjetaAccionStyles();
  const colores = TONOS_TARJETA[tono];
  return (
    <TarjetaPastel tono={tono} onPress={onPress} style={styles.tarjeta}>
      <CirculoIcono icono={icono} tamano={38} tamanoIcono={18} colorIcono={colores.icono} colorFondo={colores.iconoFondo} />
      <View style={styles.textos}>
        <Text style={styles.titulo} numberOfLines={1}>
          {titulo}
          {cantidad !== undefined && <Text style={[styles.cantidad, { color: colores.icono }]}> · {cantidad}</Text>}
        </Text>
        {detalle && (
          <Text style={styles.detalle} numberOfLines={1}>
            {detalle}
          </Text>
        )}
      </View>
      <Icono nombre="chevronDerecha" tamano={20} color={COLORES.textoSecundario} />
    </TarjetaPastel>
  );
}
