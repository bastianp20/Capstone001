import { Text, View } from 'react-native';

import { COLORES, TEXTOS_SIN_CONEXION as T } from '@/constants/constants';
import { estadoBorradorStyles as styles } from '@/css/Compartido';
import type { EstadoBorradorProps } from '@/interfaces';
import { partesFechaCita } from '@/lib/fechas';

import { Icono } from './Icono';

const RECIENTE_MS = 60_000;

/** "Borrador guardado hace un momento" (o "a las 22:15"), sobre el botón de enviar. */
export function EstadoBorrador({ guardadoEn }: EstadoBorradorProps) {
  if (!guardadoEn) return null;
  const reciente = Date.now() - new Date(guardadoEn).getTime() < RECIENTE_MS;
  return (
    <View style={styles.fila}>
      <Icono nombre="check" tamano={14} color={COLORES.textoSecundario} grosor={2.4} />
      <Text style={styles.texto}>{reciente ? T.guardado : T.guardadoA(partesFechaCita(guardadoEn).hora)}</Text>
    </View>
  );
}
