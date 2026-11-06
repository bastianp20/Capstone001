import Svg, { Path } from 'react-native-svg';

import type { OndaEncabezadoProps } from '@/interfaces';

import { useOndaEncabezadoStyles } from '@/css/Compartido';
import { useColores } from '@/context/TemaContext';

const ALTO_ONDA = 72;

/** Curva inferior del encabezado verde: se pinta con el color de fondo encima del verde. */
export function OndaEncabezado({ ancho }: OndaEncabezadoProps) {
  const COLORES = useColores();
  const styles = useOndaEncabezadoStyles();
  const a = ancho;
  const h = ALTO_ONDA;
  const d = `M0 ${h} L0 ${h * 0.42} C ${a * 0.28} ${h * 1.12}, ${a * 0.58} ${h * -0.12}, ${a} ${h * 0.34} L${a} ${h} Z`;

  return (
    <Svg width={a} height={h} style={styles.onda} pointerEvents="none">
      <Path d={d} fill={COLORES.fondo} />
    </Svg>
  );
}
