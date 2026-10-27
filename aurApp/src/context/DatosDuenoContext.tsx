import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { getDatosDueno } from '@/Api/getInfo';
import { useAuth } from '@/Auth/AuthContext';
import { TEXTOS_CARGA } from '@/constants/constants';
import type { DatosDueno, DatosDuenoContextValue, DatosDuenoProviderProps } from '@/interfaces';

const DATOS_VACIOS: DatosDueno = { mascotas: [], citas: [], registros: [], recetas: [], derivaciones: [] };

const DatosDuenoContext = createContext<DatosDuenoContextValue | undefined>(undefined);

/**
 * Mascotas, citas, historial, recetas y derivaciones del dueño conectado.
 * Se cargan una vez y las comparten todas las pestañas; después de guardar algo
 * (pedir hora, agregar mascota, cancelar) la pantalla llama a recargar().
 */
export const DatosDuenoProvider = ({ children }: DatosDuenoProviderProps) => {
  const { usuarioActual } = useAuth();
  // Solo se cargan si la cuenta es de dueño
  const duenoId = usuarioActual?.rol === 'dueno' ? usuarioActual.id : null;

  const [datos, setDatos] = useState<DatosDueno>(DATOS_VACIOS);
  const [cargando, setCargando] = useState(true);
  const [recargando, setRecargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async (id: string) => {
    try {
      setDatos(await getDatosDueno(id));
      setError(null);
    } catch (e) {
      console.error('Error al cargar los datos del dueño:', e);
      setError(TEXTOS_CARGA.error);
    }
  }, []);

  useEffect(() => {
    if (!duenoId) {
      setDatos(DATOS_VACIOS);
      return;
    }
    let activo = true;
    setCargando(true);
    cargar(duenoId).finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, [duenoId, cargar]);

  const recargar = useCallback(async () => {
    if (!duenoId) return;
    setRecargando(true);
    await cargar(duenoId);
    setRecargando(false);
  }, [duenoId, cargar]);

  return (
    <DatosDuenoContext.Provider value={{ ...datos, cargando, error, recargar, recargando }}>
      {children}
    </DatosDuenoContext.Provider>
  );
};

export const useDatosDueno = (): DatosDuenoContextValue => {
  const ctx = useContext(DatosDuenoContext);
  if (!ctx) throw new Error('useDatosDueno debe usarse dentro de <DatosDuenoProvider>');
  return ctx;
};
