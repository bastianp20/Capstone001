import { useMemo, useState } from 'react';
import { Linking } from 'react-native';

import { cambiarEstadoMensaje } from '@/Api/postInfo';
import { FILTROS_MENSAJES, TEXTOS_MENSAJES as T } from '@/constants/constants';
import { useSuperadmin } from '@/context/SuperadminContext';
import type { EstadoContacto, FiltroMensajes, MensajeContacto } from '@/interfaces';
import { camposBusquedaMensaje, FILTROS_MENSAJE } from '@/lib/superadmin';

import { useAccion } from './useAccion';
import { useFiltro } from './useFiltro';

/** Mensajes del formulario de contacto: responder por correo y cambiar su estado. */
export function useMensajes() {
  const s = useSuperadmin();
  const mensajes = useMemo(() => s.datos?.mensajes ?? [], [s.datos]);
  const f = useFiltro<MensajeContacto, FiltroMensajes>({
    items: mensajes,
    camposBusqueda: camposBusquedaMensaje,
    filtros: FILTROS_MENSAJE,
    filtroInicial: 'pendiente',
  });
  const { ejecutar, error } = useAccion();
  const [ocupadoId, setOcupadoId] = useState<number | null>(null);

  const cambiarEstado = async (m: MensajeContacto, estado: EstadoContacto) => {
    setOcupadoId(m.id);
    const ok = await ejecutar(() => cambiarEstadoMensaje(m.id, estado), T.error);
    if (ok) await s.recargar();
    setOcupadoId(null);
  };

  // Abre la app de correo del teléfono con la respuesta lista para escribir.
  const responder = (m: MensajeContacto) =>
    Linking.openURL(`mailto:${m.correo}?subject=${encodeURIComponent(T.asuntoRespuesta(m.asunto))}`);

  return {
    ...f,
    opciones: FILTROS_MENSAJES.map((o) => ({ ...o, cantidad: f.cantidad(o.valor) })),
    hayEnFiltro: f.cantidad(f.filtro) > 0,
    cambiarEstado,
    responder,
    ocupadoId,
    error,
    superadmin: s,
  };
}
