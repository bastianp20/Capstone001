import { getHistoriasAdopcion, getResumenRefugios } from "../Api/getInfo";
import { useConsulta } from "./useConsulta";

// Landing "Súmate a AuraPet": los números reales y una historia real para el testimonio
// (cada mundo ve los suyos: las cuentas de prueba, los de prueba).
export const useSumateRefugio = () => {
  const resumen = useConsulta(getResumenRefugios, []);
  const historias = useConsulta(getHistoriasAdopcion, []);
  return { resumen: resumen.datos ?? null, historia: historias.datos?.[0] ?? null };
};
