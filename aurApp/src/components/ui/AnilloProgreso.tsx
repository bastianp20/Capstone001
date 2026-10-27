import Svg, { Circle } from 'react-native-svg';

import type { AnilloProgresoProps } from '@/interfaces';

export function AnilloProgreso({ porcentaje, tamano, grosor, color, colorFondo }: AnilloProgresoProps) {
  const radio = (tamano - grosor) / 2;
  const circunferencia = 2 * Math.PI * radio;
  const valor = Math.max(0, Math.min(100, porcentaje));
  const centro = tamano / 2;

  return (
    <Svg width={tamano} height={tamano}>
      <Circle cx={centro} cy={centro} r={radio} stroke={colorFondo} strokeWidth={grosor} fill="none" />
      <Circle
        cx={centro}
        cy={centro}
        r={radio}
        stroke={color}
        strokeWidth={grosor}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${circunferencia} ${circunferencia}`}
        strokeDashoffset={circunferencia * (1 - valor / 100)}
        // Empieza arriba (las 12) en vez de a la derecha (las 3)
        transform={`rotate(-90 ${centro} ${centro})`}
      />
    </Svg>
  );
}
