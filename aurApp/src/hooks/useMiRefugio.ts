import { useEffect, useRef, useState } from 'react';

import { getAnimalesMiRefugio, getDetalleMiRefugio } from '@/Api/getInfo';
import { actualizarCapacidadRefugio } from '@/Api/postInfo';
import { ESPERA_GUARDAR_CUPOS_MS, TEXTOS_MI_REFUGIO as T } from '@/constants/constants';
import type { RecepcionRefugio } from '@/interfaces';

import { useAccion } from './useAccion';
import { useAccionesPublicacion } from './useAccionesPublicacion';
import { useCargaDatos } from './useCargaDatos';
import { useRecargarAlVolver } from './useRecargarAlVolver';

const cargarMiRefugio = async (id: number) => {
  const [detalle, animales] = await Promise.all([getDetalleMiRefugio(id), getAnimalesMiRefugio(id)]);
  return { detalle, animales };
};

/**
 * Mi refugio (versión liviana de la web): cupos con − / + que se guardan solos al dejar de tocar,
 * si reciben animales, los números del mes y sus animales (con retirar / volver a publicar).
 */
export function useMiRefugio(refugioId: number) {
  const carga = useCargaDatos(() => cargarMiRefugio(refugioId), [refugioId]);
  useRecargarAlVolver(carga.recargar);
  const detalle = carga.datos?.detalle ?? null;
  const acciones = useAccionesPublicacion(carga.recargar);
  const guardado = useAccion();

  // Lo que se ve mientras se toca − / + (se guarda después de ESPERA_GUARDAR_CUPOS_MS sin tocar)
  const [cupos, setCupos] = useState<number | null>(null);
  const [recibe, setRecibe] = useState<RecepcionRefugio | null>(null);
  const espera = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (espera.current) clearTimeout(espera.current);
  }, []);

  // Después de guardar (bien o mal) se vuelve a mostrar lo que dice la base,
  // salvo que la persona siga tocando − / + (hay otro guardado esperando).
  const guardar = async (cambio: { cuposOcupados?: number; recibe?: RecepcionRefugio }) => {
    await guardado.ejecutar(() => actualizarCapacidadRefugio(refugioId, cambio), T.errorGuardar);
    await carga.recargar();
    if (!espera.current) setCupos(null);
    setRecibe(null);
  };

  const cambiarCupos = (valor: number) => {
    setCupos(valor);
    if (espera.current) clearTimeout(espera.current);
    espera.current = setTimeout(() => {
      espera.current = null;
      guardar({ cuposOcupados: valor });
    }, ESPERA_GUARDAR_CUPOS_MS);
  };

  const cambiarRecepcion = (valor: RecepcionRefugio | null) => {
    if (!valor) return;
    setRecibe(valor);
    guardar({ recibe: valor });
  };

  return {
    cargando: carga.cargando,
    errorCarga: carga.error,
    recargar: carga.recargar,
    recargando: carga.recargando,
    detalle,
    animales: carga.datos?.animales ?? [],
    cupos: cupos ?? detalle?.cuposOcupados ?? 0,
    recibe: recibe ?? detalle?.recibe ?? null,
    cambiarCupos,
    cambiarRecepcion,
    guardando: guardado.ocupado || cupos !== null,
    errorGuardar: guardado.error,
    acciones,
  };
}
