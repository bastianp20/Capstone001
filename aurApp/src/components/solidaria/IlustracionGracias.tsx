import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { COLORES, TONOS_TARJETA } from '@/constants/constants';

/** Perrito feliz con un corazón y confeti (confirmación de una atención solidaria). */
export function IlustracionGracias() {
  const linea = COLORES.primarioOscuro;
  return (
    <Svg width={150} height={130} viewBox="0 0 150 130" accessibilityElementsHidden>
      {/* confeti */}
      <Rect x="20" y="22" width="8" height="4" rx="2" fill={COLORES.coral} transform="rotate(-25 24 24)" />
      <Rect x="118" y="18" width="8" height="4" rx="2" fill={COLORES.primario} transform="rotate(30 122 20)" />
      <Rect x="30" y="60" width="7" height="4" rx="2" fill={TONOS_TARJETA.menta.iconoFondo} />
      <Rect x="122" y="56" width="7" height="4" rx="2" fill={COLORES.coral} transform="rotate(-15 125 58)" />
      <Circle cx="72" cy="12" r="3" fill={COLORES.primario} />
      <Circle cx="98" cy="30" r="2.5" fill={COLORES.coral} />
      {/* orejas */}
      <Path d="M50 42 C36 46 34 70 44 76 C50 70 54 56 56 46 Z" fill={TONOS_TARJETA.durazno.iconoFondo} stroke={linea} strokeWidth={2.5} />
      <Path d="M100 42 C114 46 116 70 106 76 C100 70 96 56 94 46 Z" fill={TONOS_TARJETA.durazno.iconoFondo} stroke={linea} strokeWidth={2.5} />
      {/* cabeza y cuerpo */}
      <Ellipse cx="75" cy="58" rx="27" ry="24" fill="#FFF7EE" stroke={linea} strokeWidth={2.5} />
      <Path d="M56 80 C52 98 56 112 62 116 L88 116 C94 112 98 98 94 80" fill="#FFF7EE" stroke={linea} strokeWidth={2.5} />
      <Ellipse cx="86" cy="52" rx="7" ry="6" fill={TONOS_TARJETA.durazno.iconoFondo} />
      {/* cara feliz */}
      <Path d="M63 55 q4 -4 8 0" stroke={linea} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <Path d="M80 55 q4 -4 8 0" stroke={linea} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <Ellipse cx="75" cy="63" rx="4" ry="3" fill={linea} />
      <Path d="M69 68 q6 6 12 0" stroke={linea} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {/* corazón */}
      <Path d="M36 98 C28 92 24 88 24 83 a5 5 0 0 1 12 -2 a5 5 0 0 1 12 2 c0 5 -4 9 -12 15z" fill={COLORES.coral} />
      <Path d="M40 120 L110 120" stroke={TONOS_TARJETA.menta.iconoFondo} strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}
