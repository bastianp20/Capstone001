import { getMisRefugios } from '@/Api/getInfo';

import { useConsulta } from './useConsulta';
import { useRecargarAlVolver } from './useRecargarAlVolver';

/** Refugios que administra la cuenta (para mostrar "Mi refugio" en el perfil). Vacío si no administra ninguno. */
export function useMisRefugios() {
  const { datos, recargar } = useConsulta(() => getMisRefugios(), []);
  useRecargarAlVolver(recargar);
  return datos ?? [];
}
