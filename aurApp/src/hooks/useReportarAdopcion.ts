import { useState } from 'react';

import { reportarAdopcion } from '@/Api/postInfo';
import { TEXTOS_REPORTE as T } from '@/constants/constants';
import type { MotivoReporte } from '@/interfaces';

import { useAccion } from './useAccion';

/** Reportar una publicación: motivo, comentario opcional y el número del reporte al terminar. */
export function useReportarAdopcion(adopcionId: number) {
  const [motivo, setMotivo] = useState<MotivoReporte | null>(null);
  const [comentario, setComentario] = useState('');
  const [numero, setNumero] = useState<number | null>(null);
  const { ejecutar, ocupado, error, setError, limpiarError } = useAccion();

  const enviar = async () => {
    if (!motivo) return setError(T.faltaMotivo);
    await ejecutar(async () => setNumero(await reportarAdopcion(adopcionId, motivo, comentario)), T.error);
  };

  return {
    motivo,
    elegirMotivo: (m: MotivoReporte) => {
      setMotivo(m);
      limpiarError();
    },
    comentario,
    setComentario,
    enviar,
    enviando: ocupado,
    error,
    numero,
  };
}
