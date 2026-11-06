import { Text, View } from 'react-native';

import { AnilloProgreso } from '@/components/ui/AnilloProgreso';
import { AFINIDAD } from '@/constants/constants';
import { useAfinidadAnilloStyles } from '@/css/MisPublicacionesPage';
import type { AfinidadAnilloProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

/** Anillo con el % de afinidad (verde si es alta, ámbar si conviene conversar). */
export function AfinidadAnillo({ porcentaje, tamano }: AfinidadAnilloProps) {
  const COLORES = useColores();
  const styles = useAfinidadAnilloStyles();
  const color = porcentaje >= AFINIDAD.umbralAlto ? COLORES.primario : COLORES.estados.pendiente.texto;
  return (
    <View style={[styles.contenedor, { width: tamano, height: tamano }]}>
      <AnilloProgreso porcentaje={porcentaje} tamano={tamano} grosor={Math.max(4, tamano / 11)} color={color} colorFondo={COLORES.borde} />
      <View style={styles.centro}>
        <Text style={[styles.porcentaje, { fontSize: tamano * 0.27 }]}>{porcentaje}%</Text>
      </View>
    </View>
  );
}
