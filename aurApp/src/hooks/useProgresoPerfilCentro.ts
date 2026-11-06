import { getProgresoPerfilCentro } from '@/Api/getInfo';
import { PASOS_PERFIL_CENTRO } from '@/constants/constants';
import { pasosPendientes, porcentajePerfil } from '@/lib/progreso';

import { useConsulta } from './useConsulta';
import { useRecargarAlVolver } from './useRecargarAlVolver';

/** "Completa el perfil del centro". Se recarga al volver (después de completar un paso). */
export function useProgresoPerfilCentro(centroId: number) {
  const { datos, recargar } = useConsulta(() => getProgresoPerfilCentro(centroId), [centroId]);
  useRecargarAlVolver(recargar);
  const pasos = datos ?? {};
  return {
    listo: !!datos,
    pendientes: datos ? pasosPendientes(PASOS_PERFIL_CENTRO, pasos) : [],
    porcentaje: porcentajePerfil(PASOS_PERFIL_CENTRO, pasos),
    recargar,
  };
}
