import { Text, View } from 'react-native';

import { COLORES } from '@/constants/constants';
import { tarjetaAvisoStyles as styles } from '@/css/Compartido';
import type { TarjetaAvisoProps } from '@/interfaces';

import { Icono } from './Icono';

/** Aviso amarillo suave, con título e ícono opcionales. */
export function TarjetaAviso({ texto, titulo, icono }: TarjetaAvisoProps) {
  return (
    <View style={[styles.tarjeta, !titulo && !icono && styles.centrada]}>
      {icono && <Icono nombre={icono} tamano={22} color={COLORES.avisoTexto} />}
      <View style={styles.cuerpo}>
        {titulo && <Text style={styles.titulo}>{titulo}</Text>}
        <Text style={[styles.texto, !titulo && !icono && styles.textoCentrado]}>{texto}</Text>
      </View>
    </View>
  );
}
