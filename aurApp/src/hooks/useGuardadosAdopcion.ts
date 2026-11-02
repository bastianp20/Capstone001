import { useSyncExternalStore } from 'react';

import { alternarGuardado, leerGuardados, suscribirGuardados } from '@/lib/guardadosAdopcion';

/** Animales guardados con el corazón (en este teléfono). La lista y la ficha comparten el mismo estado. */
export function useGuardadosAdopcion() {
  const guardados = useSyncExternalStore(suscribirGuardados, leerGuardados, leerGuardados);
  return { guardados, estaGuardado: (id: number) => guardados.has(id), alternar: alternarGuardado };
}
