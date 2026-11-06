import { useState } from 'react';

import { getAvisosCitas } from '@/Api/getInfo';
import { marcarAvisoLeido } from '@/Api/postInfo';

import { useConsulta } from './useConsulta';
import { useRecargarAlVolver } from './useRecargarAlVolver';

/** Avisos sin leer de cambios de hora (dueño o administración de un centro). Al marcarlos como leídos desaparecen. */
export function useAvisosCitas(centroId?: number) {
  const { datos, recargar } = useConsulta(() => getAvisosCitas(centroId), [centroId]);
  useRecargarAlVolver(recargar);
  const [ocupado, setOcupado] = useState(false);
  const avisos = datos ?? [];

  const marcar = async (ids: number[]) => {
    setOcupado(true);
    try {
      await Promise.all(ids.map((id) => marcarAvisoLeido(id)));
    } catch (e) {
      console.error(e);
    } finally {
      setOcupado(false);
      recargar();
    }
  };

  return {
    avisos,
    ocupado,
    marcarLeido: (id: number) => marcar([id]),
    marcarTodos: () => marcar(avisos.map((a) => a.id)),
  };
}
