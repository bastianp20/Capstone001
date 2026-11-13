import { getHistoriasAdopcion, getResumenRefugios } from "../Api/getInfo";
import { useConsulta } from "./useConsulta";

// ésto es para la vista de la pagina sumate para los refugios, muestra un resumen de los refugios y la historia de adopcion más reciete
export const useSumateRefugio = () => {
  const resumen = useConsulta(getResumenRefugios, []);
  const historias = useConsulta(getHistoriasAdopcion, []);
  return { resumen: resumen.datos ?? null, historia: historias.datos?.[0] ?? null };
};
