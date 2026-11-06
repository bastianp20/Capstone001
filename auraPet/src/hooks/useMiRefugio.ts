import { useCallback, useMemo, useRef, useState } from "react";
import { getAnimalesMiRefugio, getDetalleMiRefugio } from "../Api/getInfo";
import { actualizarCapacidadRefugio } from "../Api/postInfo";
import { MS_GUARDAR_CUPOS, TEXTOS_MI_REFUGIO as T } from "../constants";
import type { PestanaMiRefugio, RecepcionRefugio } from "../interfaces";
import { useAccion } from "./useAccion";
import { useConsulta } from "./useConsulta";
import { useToast } from "./useToast";

// "Mi refugio": datos y números, sus animales por pestaña, y los cambios
// rápidos de cupos y recepción (se ven al instante y se guardan solos).
export const useMiRefugio = (refugioId: number) => {
  const [recarga, setRecarga] = useState(0);
  const recargar = useCallback(() => setRecarga((n) => n + 1), []);
  const detalle = useConsulta(() => getDetalleMiRefugio(refugioId), [refugioId, recarga]);
  const animales = useConsulta(() => getAnimalesMiRefugio(refugioId), [refugioId, recarga]);
  const toast = useToast();
  const accion = useAccion();

  // Lo que la persona eligió y todavía puede no estar guardado
  const [cupos, setCupos] = useState<number | null>(null);
  const [recibe, setRecibe] = useState<RecepcionRefugio | null>(null);
  const temporizador = useRef<number | undefined>(undefined);

  const guardarCupos = useCallback(
    async (n: number) => {
      const ok = await accion.ejecutar(() => actualizarCapacidadRefugio(refugioId, { cuposOcupados: n }), T.errorGuardar);
      if (ok) {
        toast.mostrar(T.cuposGuardados);
        recargar();
      } else setCupos(null);
    },
    [accion, refugioId, toast, recargar],
  );

  // Cada toque en + / − se ve al tiro; se guarda cuando deja de tocar
  const cambiarCupos = useCallback(
    (n: number) => {
      setCupos(n);
      window.clearTimeout(temporizador.current);
      temporizador.current = window.setTimeout(() => guardarCupos(n), MS_GUARDAR_CUPOS);
    },
    [guardarCupos],
  );

  const cambiarRecepcion = useCallback(
    async (valor: RecepcionRefugio) => {
      setRecibe(valor);
      const ok = await accion.ejecutar(() => actualizarCapacidadRefugio(refugioId, { recibe: valor }), T.errorGuardar);
      if (ok) {
        toast.mostrar(T.recepcionGuardada);
        recargar();
      } else setRecibe(null);
    },
    [accion, refugioId, toast, recargar],
  );

  const [pestana, setPestana] = useState<PestanaMiRefugio>("publicada");
  const lista = useMemo(() => animales.datos ?? [], [animales.datos]);
  const cantidad = (p: PestanaMiRefugio) => lista.filter((a) => a.estado === p).length;

  const r = detalle.datos ?? null;
  return {
    refugio: r && { ...r, cuposOcupados: cupos ?? r.cuposOcupados, recibe: recibe ?? r.recibe },
    cargando: detalle.cargando,
    error: detalle.error,
    animales: useMemo(() => lista.filter((a) => a.estado === pestana), [lista, pestana]),
    cargandoAnimales: animales.cargando,
    pestana,
    setPestana,
    cantidad,
    cambiarCupos,
    cambiarRecepcion,
    ocupado: accion.ocupado,
    errorAccion: accion.error,
    toast: toast.mensaje,
    avisar: toast.mostrar,
    recargar,
  };
};
