import { useCallback, useMemo, useState } from "react";
import { getActividadPublicaciones, getMisPublicaciones } from "../Api/getInfo";
import { cambiarEstadoPublicacion } from "../Api/postInfo";
import { CONFIRMACIONES, FILTROS_PUBLICACIONES, MAX_ACTIVIDAD_PUBLICACIONES } from "../constants";
import type { FiltroPublicaciones, PublicacionPropia } from "../interfaces";
import { publicacionDestacada } from "../lib/publicacionesAdopcion";
import { useAccion } from "./useAccion";
import { useConfirmar } from "./useConfirmar";
import { useConsulta } from "./useConsulta";

// "Mis publicaciones": la lista, la actividad, la destacada, la pestaña elegida
// y las acciones de retirar o volver a publicar. version (de afuera) recarga todo.
export const useMisPublicaciones = (version: number) => {
  const [recarga, setRecarga] = useState(0);
  const recargar = useCallback(() => setRecarga((n) => n + 1), []);
  const lista = useConsulta(getMisPublicaciones, [version, recarga]);
  const actividad = useConsulta(() => getActividadPublicaciones(MAX_ACTIVIDAD_PUBLICACIONES), [version, recarga]);
  const [pestana, setPestana] = useState<FiltroPublicaciones>("activos");
  const confirmar = useConfirmar();
  const accion = useAccion();

  const publicaciones = useMemo(() => lista.datos ?? [], [lista.datos]);
  const visibles = useMemo(() => publicaciones.filter((p) => FILTROS_PUBLICACIONES[pestana](p.estado)), [publicaciones, pestana]);
  const cantidad = (f: FiltroPublicaciones) => publicaciones.filter((p) => FILTROS_PUBLICACIONES[f](p.estado)).length;

  const retirar = useCallback(
    async (p: PublicacionPropia) => {
      if (!(await confirmar(CONFIRMACIONES.retirarPublicacion(p.nombre)))) return;
      if (await accion.ejecutar(() => cambiarEstadoPublicacion(p.id, "retirada"), "")) recargar();
    },
    [confirmar, accion, recargar],
  );
  const reactivar = useCallback(
    async (p: PublicacionPropia) => {
      if (await accion.ejecutar(() => cambiarEstadoPublicacion(p.id, "publicada"), "")) recargar();
    },
    [accion, recargar],
  );

  return {
    publicaciones,
    visibles,
    actividad: actividad.datos ?? [],
    destacada: useMemo(() => publicacionDestacada(publicaciones), [publicaciones]),
    totales: {
      publicados: publicaciones.filter((p) => p.estado !== "retirada").length,
      nuevas: publicaciones.reduce((n, p) => n + p.nuevas, 0),
      adoptados: cantidad("adoptados"),
    },
    pestana,
    setPestana,
    cantidad,
    cargando: lista.cargando,
    error: lista.error,
    errorAccion: accion.error,
    retirar,
    reactivar,
    recargar,
  };
};
