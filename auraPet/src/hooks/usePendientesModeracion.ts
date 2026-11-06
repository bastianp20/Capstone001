import { getResumenModeracion } from "../Api/getInfo";
import { useConsulta } from "./useConsulta";

// Cuántos casos de moderación esperan revisión (contador del menú del superadmin).
export const usePendientesModeracion = (version: number) => {
  const { datos } = useConsulta(getResumenModeracion, [version]);
  return datos?.porRevisar ?? 0;
};
