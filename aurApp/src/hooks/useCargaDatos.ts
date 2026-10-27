import { type DependencyList, useCallback, useEffect, useRef, useState } from 'react';

import { TEXTOS_CARGA } from '@/constants/constants';
import type { ContextoDatos } from '@/interfaces';

/**
 * Carga datos de la base para un contexto (veterinario, centro, superadmin) y permite recargarlos.
 * Si `cargar` es null (por ejemplo, la cuenta no tiene ese rol), no pide nada y deja los datos vacíos.
 */
export function useCargaDatos<T>(cargar: (() => Promise<T>) | null, deps: DependencyList): ContextoDatos<T> {
  const [datos, setDatos] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [recargando, setRecargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const funcion = useRef(cargar);
  funcion.current = cargar;

  const ejecutar = useCallback(async () => {
    const f = funcion.current;
    if (!f) return setDatos(null);
    try {
      setDatos(await f());
      setError(null);
    } catch (e) {
      console.error('Error al cargar datos:', e);
      setError(TEXTOS_CARGA.error);
    }
  }, []);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    ejecutar().finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const recargar = useCallback(async () => {
    setRecargando(true);
    await ejecutar();
    setRecargando(false);
  }, [ejecutar]);

  return { datos, cargando, error, recargar, recargando };
}
