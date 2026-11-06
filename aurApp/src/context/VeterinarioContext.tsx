import { createContext, useContext } from 'react';

import { getDatosVeterinario } from '@/Api/getInfo';
import { useAuth } from '@/Auth/AuthContext';
import type { ContextoDatos, DatosVeterinario, ProveedorProps } from '@/interfaces';
import { useCargaDatos } from '@/hooks/useCargaDatos';

const VeterinarioContext = createContext<ContextoDatos<DatosVeterinario> | undefined>(undefined);

/** Ficha, citas, pacientes y derivaciones del veterinario conectado (solo se cargan si la cuenta es de veterinario). */
export const VeterinarioProvider = ({ children }: ProveedorProps) => {
  const { usuarioActual } = useAuth();
  const perfilId = usuarioActual?.rol === 'veterinario' ? usuarioActual.id : null;
  const valor = useCargaDatos(perfilId ? () => getDatosVeterinario(perfilId) : null, [perfilId]);
  return <VeterinarioContext.Provider value={valor}>{children}</VeterinarioContext.Provider>;
};

export const useVeterinario = (): ContextoDatos<DatosVeterinario> => {
  const ctx = useContext(VeterinarioContext);
  if (!ctx) throw new Error('useVeterinario debe usarse dentro de <VeterinarioProvider>');
  return ctx;
};
