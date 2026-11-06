import { createContext, useContext } from 'react';

import { getDatosSuperadmin } from '@/Api/getInfo';
import { useAuth } from '@/Auth/AuthContext';
import type { ContextoDatos, DatosSuperadmin, ProveedorProps } from '@/interfaces';
import { useCargaDatos } from '@/hooks/useCargaDatos';

const SuperadminContext = createContext<ContextoDatos<DatosSuperadmin> | undefined>(undefined);

/** Resumen, aprobaciones, mensajes, eliminaciones y cambios de plan (solo para el superadmin). */
export const SuperadminProvider = ({ children }: ProveedorProps) => {
  const { usuarioActual } = useAuth();
  const esSuperadmin = usuarioActual?.rol === 'superadmin';
  const valor = useCargaDatos(esSuperadmin ? getDatosSuperadmin : null, [esSuperadmin]);
  return <SuperadminContext.Provider value={valor}>{children}</SuperadminContext.Provider>;
};

export const useSuperadmin = (): ContextoDatos<DatosSuperadmin> => {
  const ctx = useContext(SuperadminContext);
  if (!ctx) throw new Error('useSuperadmin debe usarse dentro de <SuperadminProvider>');
  return ctx;
};
