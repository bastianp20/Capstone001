import { getProgresoPerfilVeterinario } from "../Api/getInfo";
import { useConsulta } from "./useConsulta";
import { pasosPendientes, porcentajePerfil } from "../lib/horarioAtencion";

// "Completa tu perfil" del veterinario: porcentaje y pasos que faltan.
// · recarga: sube cuando algo pudo cambiar (cerrar Configuración, guardar el horario).
export const useProgresoPerfil = (recarga = 0) => {
  const { datos: progreso = null, cargando } = useConsulta(getProgresoPerfilVeterinario, [recarga]);
  return {
    progreso,
    cargando,
    porcentaje: progreso ? porcentajePerfil(progreso) : 0,
    pendientes: progreso ? pasosPendientes(progreso) : [],
  };
};
