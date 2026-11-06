import { NOMBRE_DIA, TEXTOS_DETALLE_CENTRO } from "../../../constants";
import type { HorarioCentroListaProps } from "../../../interfaces";
import styles from "../../../css/superadmin/DetalleModal.module.css";

const DIAS = [1, 2, 3, 4, 5, 6, 7];

// Los 7 días de la semana: horario o "Cerrado" si ese día no atiende
export const HorarioCentroLista = ({ horarios }: HorarioCentroListaProps) => {
  if (horarios.length === 0) return <p className={styles.vacio}>{TEXTOS_DETALLE_CENTRO.sinHorario}</p>;
  const porDia = new Map(horarios.map((h) => [h.dia, h.texto]));
  return (
    <ul className={styles.horario}>
      {DIAS.map((dia) => (
        <li key={dia} className={porDia.has(dia) ? undefined : styles.diaCerrado}>
          <span>{NOMBRE_DIA[dia]}</span>
          <span>{porDia.get(dia) ?? TEXTOS_DETALLE_CENTRO.cerrado}</span>
        </li>
      ))}
    </ul>
  );
};
