import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { useColores, useTonosTarjeta } from '@/context/TemaContext';

/** Corazón con una huellita sobre un círculo durazno (amable, sin alarmas). */
export function IlustracionDespedida() {
  const COLORES = useColores();
  const TONOS_TARJETA = useTonosTarjeta();
  const durazno = TONOS_TARJETA.durazno;
  return (
    <Svg width={120} height={120} viewBox="0 0 120 120" accessibilityElementsHidden>
      <Circle cx="60" cy="60" r="56" fill={durazno.fondo} />
      <Circle cx="60" cy="60" r="44" fill={durazno.iconoFondo} opacity={0.55} />
      <Path
        d="M60 88 C38 72 30 62 30 50 a14 14 0 0 1 30 -6 a14 14 0 0 1 30 6 c0 12 -8 22 -30 38z"
        fill={COLORES.coral}
      />
      {/* huellita blanca sobre el corazón */}
      <Ellipse cx="60" cy="64" rx="7" ry="6" fill={COLORES.blanco} />
      <Circle cx="51" cy="55" r="3" fill={COLORES.blanco} />
      <Circle cx="57" cy="51" r="3" fill={COLORES.blanco} />
      <Circle cx="63" cy="51" r="3" fill={COLORES.blanco} />
      <Circle cx="69" cy="55" r="3" fill={COLORES.blanco} />
    </Svg>
  );
}
