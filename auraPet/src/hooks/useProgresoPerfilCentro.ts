import { getProgresoPerfilCentro } from "../Api/getInfo";
import { PASOS_PERFIL_CENTRO } from "../constants";
import { useConsulta } from "./useConsulta";

// "Completa el perfil del centro": porcentaje y pasos que faltan.
export const useProgresoPerfilCentro = (centroId: number, recarga = 0) => {
  const { datos: progreso = null } = useConsulta(() => getProgresoPerfilCentro(centroId), [centroId, recarga]);
  const pendientes = progreso ? PASOS_PERFIL_CENTRO.filter((p) => !progreso[p]) : [];
  const porcentaje = Math.round(((PASOS_PERFIL_CENTRO.length - pendientes.length) / PASOS_PERFIL_CENTRO.length) * 100);
  return { progreso, pendientes, porcentaje };
};
