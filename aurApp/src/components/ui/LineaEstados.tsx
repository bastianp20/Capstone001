import { Text, View } from 'react-native';

import { COLORES } from '@/constants/constants';
import { lineaEstadosStyles as styles } from '@/css/Compartido';
import type { LineaEstadosProps } from '@/interfaces';

import { Icono } from './Icono';

/** Pasos en columna unidos por una línea: ✓ hechos, el actual con anillo y los que faltan en gris. */
export function LineaEstados({ pasos }: LineaEstadosProps) {
  return (
    <View>
      {pasos.map((p, i) => (
        <View key={p.texto} style={styles.paso}>
          <View style={styles.columna}>
            <View style={[styles.punto, styles[p.estado]]}>
              {p.estado === 'hecho' && <Icono nombre="check" tamano={14} color={COLORES.blanco} grosor={3} />}
              {p.estado === 'actual' && <View style={styles.centro} />}
            </View>
            {i < pasos.length - 1 && <View style={[styles.linea, p.estado === 'hecho' && styles.lineaHecha]} />}
          </View>
          <Text style={[styles.texto, p.estado === 'pendiente' && styles.textoPendiente, p.estado === 'actual' && styles.textoActual]}>{p.texto}</Text>
        </View>
      ))}
    </View>
  );
}
