import { type DependencyList, useCallback, useEffect, useState } from 'react';

import { TEXTOS_CARGA } from '@/constants/constants';

// Hook genérico para pedir datos a Supabase desde una pantalla (el mismo de la web, más recargar).
//
//   const { datos: centros = [], cargando, error, recargar } = useConsulta(() => getCentrosParaCita(), []);
//
// · consulta: una función async de Api/getInfo.ts.
// · deps: cuándo volver a consultar (igual que en useEffect).
export const useConsulta = <T>(consulta: () => Promise<T>, deps: DependencyList) => {
  const [resultado, setResultado] = useState<{ datos?: T; error?: string; listo: boolean }>({ listo: false });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let activo = true; // si la pantalla se cierra antes de que responda, no se actualiza nada
    setResultado((r) => ({ ...r, listo: false }));
    consulta()
      .then((datos) => activo && setResultado({ datos, listo: true }))
      .catch((e: unknown) => {
        console.error('Error al consultar Supabase:', e);
        if (activo) setResultado({ error: TEXTOS_CARGA.error, listo: true });
      });
    return () => {
      activo = false;
    };
    // La consulta cambia en cada render; lo que decide cuándo repetirla son las deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  return { datos: resultado.datos, error: resultado.error, cargando: !resultado.listo, recargar };
};
