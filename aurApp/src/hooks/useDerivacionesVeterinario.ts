import { useMemo, useState } from 'react';

import { responderDerivacion } from '@/Api/postInfo';
import { FILTROS_DERIVACIONES, TEXTOS_DERIVACIONES as T } from '@/constants/constants';
import { useVeterinario } from '@/context/VeterinarioContext';
import type { DerivacionRecibida, FiltroDerivaciones } from '@/interfaces';
import { confirmar } from '@/lib/confirmar';
import { camposBusquedaDerivacion, FILTROS_DERIVACION } from '@/lib/veterinario';

import { useAccion } from './useAccion';
import { useFiltro } from './useFiltro';

/** Derivaciones del veterinario: marcar realizadas (con resultado), rechazar o cancelar las enviadas. */
export function useDerivacionesVeterinario() {
  const { datos, cargando, error, recargar, recargando } = useVeterinario();
  const derivaciones = useMemo(() => datos?.derivaciones ?? [], [datos]);
  const f = useFiltro<DerivacionRecibida, FiltroDerivaciones>({
    items: derivaciones,
    camposBusqueda: camposBusquedaDerivacion,
    filtros: FILTROS_DERIVACION,
    filtroInicial: 'pendientes',
  });
  const accion = useAccion();
  const modal = useAccion();
  const [ocupadoId, setOcupadoId] = useState<number | null>(null);
  const [cerrando, setCerrando] = useState<DerivacionRecibida | null>(null);

  const responder = async (d: DerivacionRecibida, realizada: boolean, resultado?: string) => {
    setOcupadoId(d.id);
    const ok = await (realizada ? modal : accion).ejecutar(() => responderDerivacion(d.id, realizada, resultado), T.error);
    if (ok) {
      setCerrando(null);
      await recargar();
    }
    setOcupadoId(null);
  };

  const rechazar = async (d: DerivacionRecibida) => {
    const seguro = await confirmar({
      titulo: d.recibida ? T.confirmarRechazoTitulo : T.confirmarCancelarTitulo,
      mensaje: T.confirmarTexto(d.mascota),
      textoSi: T.si,
      textoNo: T.no,
    });
    if (seguro) responder(d, false);
  };

  return {
    ...f,
    opciones: FILTROS_DERIVACIONES.map((o) => ({ ...o, cantidad: f.cantidad(o.valor) })),
    pedirRealizada: (d: DerivacionRecibida) => {
      modal.limpiarError();
      setCerrando(d);
    },
    confirmarRealizada: (resultado: string) => cerrando && responder(cerrando, true, resultado),
    cerrarModal: () => setCerrando(null),
    cerrando,
    errorModal: modal.error,
    rechazar,
    ocupadoId,
    errorAccion: accion.error,
    cargando,
    error,
    recargar,
    recargando,
  };
}
