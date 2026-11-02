import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';

import type { RolCuenta } from '@/interfaces';
import { estaEnPanelDelRol } from '@/lib/navegacion';

/**
 * ¿Ya se pueden abrir las pantallas compartidas (Adopción, Mi refugio)?
 * Al iniciar sesión, el enrutador lleva a la cuenta a "la primera pantalla permitida", eligiendo
 * por orden alfabético de carpetas. Si Adopción estuviera permitida en ese momento, la elegiría
 * antes que el panel del veterinario. Por eso se habilitan recién cuando la cuenta ya está en su
 * panel, y se vuelven a cerrar al salir de la sesión.
 */
export function useRutasCompartidasListas(rol: RolCuenta | undefined): boolean {
  const ruta = usePathname();
  const [listas, setListas] = useState(false);

  useEffect(() => {
    if (!rol) setListas(false);
    else if (!listas && estaEnPanelDelRol(rol, ruta)) setListas(true);
  }, [rol, ruta, listas]);

  return listas;
}
