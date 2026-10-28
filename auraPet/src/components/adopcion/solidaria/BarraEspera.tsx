import { DIAS_URGENCIA_SOLIDARIA } from "../../../constants";

/** Barra de "días esperando": verde al comienzo, coral cuando ya lleva mucho. */
export const BarraEspera = ({ dias }: { dias: number }) => {
  const avance = Math.min(100, (dias / DIAS_URGENCIA_SOLIDARIA) * 100);
  return (
    <span className="ap-espera" aria-hidden>
      <span style={{ width: `${Math.max(8, avance)}%` }} className={avance >= 70 ? "ap-espera-urgente" : ""} />
    </span>
  );
};
