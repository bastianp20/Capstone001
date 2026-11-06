import { useState } from 'react';

import { getCasosModeracion } from '@/Api/getInfo';
import { resolverModeracion } from '@/Api/postInfo';
import { TEXTOS_MODERACION as T } from '@/constants/constants';
import { useSuperadmin } from '@/context/SuperadminContext';
import type { CasoModeracion, DecisionModeracion, DecisionPendiente, EstadoCasoModeracion } from '@/interfaces';
import { confirmar } from '@/lib/confirmar';

import { useAccion } from './useAccion';
import { useCargaDatos } from './useCargaDatos';

/**
 * Moderación (versión liviana de la web): publicaciones reportadas por estado y la decisión.
 * Descartar solo pide confirmar; advertir y ocultar piden un mensaje para quien publicó.
 */
export function useModeracion() {
  const [estado, setEstado] = useState<EstadoCasoModeracion>('pendiente');
  const carga = useCargaDatos(() => getCasosModeracion(estado), [estado]);
  const superadmin = useSuperadmin();
  const accion = useAccion();
  const modal = useAccion();
  const [ocupadoId, setOcupadoId] = useState<number | null>(null);
  const [pendiente, setPendiente] = useState<DecisionPendiente | null>(null);

  const alTerminar = () => {
    carga.recargar();
    superadmin.recargar(); // el número de la tarjeta del Resumen
  };

  const decidir = async (caso: CasoModeracion, decision: DecisionModeracion) => {
    if (decision !== 'descartar') {
      modal.limpiarError();
      return setPendiente({ caso, decision });
    }
    const seguro = await confirmar({ titulo: T.confirmarDescartarTitulo, mensaje: T.confirmarDescartarTexto(caso.nombre), textoSi: T.si, textoNo: T.no });
    if (!seguro) return;
    setOcupadoId(caso.adopcionId);
    const ok = await accion.ejecutar(() => resolverModeracion(caso.adopcionId, 'descartar'), T.errorAccion);
    setOcupadoId(null);
    if (ok) alTerminar();
  };

  const confirmarConMensaje = async (mensaje: string) => {
    if (!pendiente) return;
    const ok = await modal.ejecutar(() => resolverModeracion(pendiente.caso.adopcionId, pendiente.decision, mensaje), T.errorAccion);
    if (ok) {
      setPendiente(null);
      alTerminar();
    }
  };

  return {
    estado,
    setEstado,
    casos: carga.datos ?? [],
    cargando: carga.cargando,
    errorCarga: carga.error,
    recargar: carga.recargar,
    recargando: carga.recargando,
    decidir,
    ocupadoId,
    error: accion.error,
    pendiente,
    confirmarConMensaje,
    cerrarModal: () => setPendiente(null),
    modalOcupado: modal.ocupado,
    errorModal: modal.error,
  };
}
