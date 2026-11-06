import { getProgresoPerfilVeterinario } from '@/Api/getInfo';
import { PASOS_PERFIL_VETERINARIO } from '@/constants/constants';
import { pasosPendientes, porcentajePerfil } from '@/lib/progreso';

import { useConsulta } from './useConsulta';
import { useRecargarAlVolver } from './useRecargarAlVolver';

/** "Completa tu perfil" del veterinario. Se recarga al volver (después de completar un paso). */
export function useProgresoPerfilVeterinario() {
  const { datos, recargar } = useConsulta(getProgresoPerfilVeterinario, []);
  useRecargarAlVolver(recargar);
  const pasos = datos ?? {};
  return {
    listo: !!datos,
    pendientes: datos ? pasosPendientes(PASOS_PERFIL_VETERINARIO, pasos) : [],
    porcentaje: porcentajePerfil(PASOS_PERFIL_VETERINARIO, pasos),
  };
}
