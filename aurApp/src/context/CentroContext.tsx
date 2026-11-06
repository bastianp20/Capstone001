import { createContext, useContext, useEffect, useState } from 'react';

import { getDatosCentro, getMisCentrosAdmin } from '@/Api/getInfo';
import { useAuth } from '@/Auth/AuthContext';
import type { CentroAdministrado, ContextoCentro, ProveedorProps } from '@/interfaces';
import { useCargaDatos } from '@/hooks/useCargaDatos';

const CentroContext = createContext<ContextoCentro | undefined>(undefined);

const ROLES_QUE_ADMINISTRAN = ['administrativo', 'veterinario'];

/**
 * Centros que administra la cuenta (administrativos y veterinarios que además son admin)
 * y los datos del centro elegido.
 */
export const CentroProvider = ({ children }: ProveedorProps) => {
  const { usuarioActual } = useAuth();
  const perfilId = usuarioActual && ROLES_QUE_ADMINISTRAN.includes(usuarioActual.rol) ? usuarioActual.id : null;

  const misCentros = useCargaDatos<CentroAdministrado[]>(perfilId ? () => getMisCentrosAdmin(perfilId) : null, [perfilId]);
  const centros = misCentros.datos ?? [];
  const [elegido, setElegido] = useState<number | null>(null);
  // Un veterinario que además administra entra al panel del centro solo cuando lo pide (desde Perfil).
  const [modoCentro, setModoCentro] = useState(false);
  useEffect(() => setModoCentro(false), [perfilId]);
  const centroId = centros.find((c) => c.id === elegido)?.id ?? centros[0]?.id ?? null;

  const datosCentro = useCargaDatos(centroId ? () => getDatosCentro(centroId) : null, [centroId]);

  const valor: ContextoCentro = {
    ...datosCentro,
    cargando: misCentros.cargando || (centroId !== null && datosCentro.cargando),
    error: misCentros.error ?? datosCentro.error,
    centros,
    centroId,
    elegirCentro: setElegido,
    modoCentro,
    cambiarModoCentro: setModoCentro,
  };
  return <CentroContext.Provider value={valor}>{children}</CentroContext.Provider>;
};

export const useCentro = (): ContextoCentro => {
  const ctx = useContext(CentroContext);
  if (!ctx) throw new Error('useCentro debe usarse dentro de <CentroProvider>');
  return ctx;
};
