import type { AnilloProgresoProps } from "../../../interfaces";

/** Anillo de progreso en SVG: afinidad de una postulación, cupos de un refugio… */
export const AnilloProgreso = ({ porcentaje, tamano = 56, grosor = 5, etiqueta, color = "var(--ap-acento)" }: AnilloProgresoProps) => {
  const radio = (tamano - grosor) / 2;
  const perimetro = 2 * Math.PI * radio;
  const valor = Math.max(0, Math.min(100, porcentaje));
  return (
    <div className="ap-anillo" style={{ width: tamano, height: tamano }} role="img" aria-label={etiqueta ?? `${valor} %`}>
      <svg width={tamano} height={tamano} viewBox={`0 0 ${tamano} ${tamano}`} aria-hidden>
        <circle cx={tamano / 2} cy={tamano / 2} r={radio} fill="none" stroke="var(--ap-riel)" strokeWidth={grosor} />
        <circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          fill="none"
          stroke={color}
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeDasharray={perimetro}
          strokeDashoffset={perimetro * (1 - valor / 100)}
          transform={`rotate(-90 ${tamano / 2} ${tamano / 2})`}
        />
      </svg>
      <span className="ap-anillo-texto">{etiqueta ?? `${valor}%`}</span>
    </div>
  );
};
