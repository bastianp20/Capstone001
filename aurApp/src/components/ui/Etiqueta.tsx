import { Text, View } from 'react-native';

import { etiquetaStyles as styles } from '@/css/Compartido';
import type { EtiquetaProps } from '@/interfaces';

import { Icono } from './Icono';

/** Chip pequeño: estados ("Confirmada"), fechas, categorías. */
export function Etiqueta({ texto, colorFondo, colorTexto, icono, conPunto }: EtiquetaProps) {
  return (
    <View style={[styles.etiqueta, { backgroundColor: colorFondo }]}>
      {conPunto && <View style={[styles.punto, { backgroundColor: colorTexto }]} />}
      {icono && <Icono nombre={icono} tamano={13} color={colorTexto} grosor={2.2} />}
      <Text style={[styles.texto, { color: colorTexto }]}>{texto}</Text>
    </View>
  );
}
