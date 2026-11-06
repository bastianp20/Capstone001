import { RUTAS_FUERA_DE_PANEL, RUTAS_PANEL_ROL } from '@/constants/constants';
import type { RolCuenta } from '@/interfaces';

// Reglas de navegación por rol (sin estado).

const empiezaCon = (ruta: string, prefijo: string) => ruta === prefijo || ruta.startsWith(`${prefijo}/`);

/** ¿La ruta es parte del panel de este rol? (el dueño: todo lo que no es panel de otro rol ni pantalla compartida) */
export const estaEnPanelDelRol = (rol: RolCuenta, ruta: string): boolean => {
  if (RUTAS_FUERA_DE_PANEL.some((p) => empiezaCon(ruta, p))) return false;
  if (rol !== 'dueno') return RUTAS_PANEL_ROL[rol].some((p) => empiezaCon(ruta, p));
  const panelesDeOtros = Object.values(RUTAS_PANEL_ROL).flat();
  return !panelesDeOtros.some((p) => empiezaCon(ruta, p));
};
