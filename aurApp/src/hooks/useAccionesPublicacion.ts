import { useState } from 'react';

import { cambiarEstadoPublicacion } from '@/Api/postInfo';
import { TEXTOS_MIS_PUBLICACIONES as T } from '@/constants/constants';
import type { PublicacionPropia } from '@/interfaces';
import { confirmar } from '@/lib/confirmar';

import { useAccion } from './useAccion';

/** Retirar de Adopta (con confirmación) o volver a publicar. Lo usan Mis publicaciones y Mi refugio. */
export function useAccionesPublicacion(alTerminar: () => unknown) {
  const [ocupadoId, setOcupadoId] = useState<number | null>(null);
  const { ejecutar, error } = useAccion();

  const cambiarEstado = async (p: PublicacionPropia, estado: 'publicada' | 'retirada') => {
    setOcupadoId(p.id);
    const ok = await ejecutar(() => cambiarEstadoPublicacion(p.id, estado), T.errorAccion);
    setOcupadoId(null);
    if (ok) alTerminar();
  };

  return {
    ocupadoId,
    error,
    retirar: async (p: PublicacionPropia) => {
      const seguro = await confirmar({ titulo: T.retirar, mensaje: T.confirmarRetiro(p.nombre), textoSi: T.retirar, textoNo: T.cancelar });
      if (seguro) cambiarEstado(p, 'retirada');
    },
    republicar: (p: PublicacionPropia) => cambiarEstado(p, 'publicada'),
  };
}
