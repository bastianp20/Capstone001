import { View } from 'react-native';

import { useCirculoIconoStyles } from '@/css/Compartido';
import type { CirculoIconoProps } from '@/interfaces';

import { Icono } from './Icono';

export function CirculoIcono({ icono, tamano, colorIcono, colorFondo, tamanoIcono, grosor = 2 }: CirculoIconoProps) {
  const styles = useCirculoIconoStyles();
  return (
    <View style={[styles.circulo, { width: tamano, height: tamano, borderRadius: tamano / 2, backgroundColor: colorFondo }]}>
      <Icono nombre={icono} tamano={tamanoIcono ?? Math.round(tamano * 0.48)} color={colorIcono} grosor={grosor} />
    </View>
  );
}
