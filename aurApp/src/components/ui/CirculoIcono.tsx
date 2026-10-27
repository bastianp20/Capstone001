import { View } from 'react-native';

import { circuloIconoStyles as styles } from '@/css/Compartido';
import type { CirculoIconoProps } from '@/interfaces';

import { Icono } from './Icono';

export function CirculoIcono({ icono, tamano, colorIcono, colorFondo, tamanoIcono, grosor = 2 }: CirculoIconoProps) {
  return (
    <View style={[styles.circulo, { width: tamano, height: tamano, borderRadius: tamano / 2, backgroundColor: colorFondo }]}>
      <Icono nombre={icono} tamano={tamanoIcono ?? Math.round(tamano * 0.48)} color={colorIcono} grosor={grosor} />
    </View>
  );
}
