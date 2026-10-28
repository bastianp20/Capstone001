import { useCallback, useMemo, useState } from "react";
import { getDetalleAdopcion, getPostulacionesAdopcion } from "../Api/getInfo";
import { concretarAdopcion, responderPostulacion } from "../Api/postInfo";
import { CONFIRMACIONES, TEXTOS_ADOPTADA, TEXTOS_ELEGIR_FAMILIA } from "../constants";
import type { AfinidadPostulacion, DatosConcretarAdopcion, PublicacionPropia } from "../interfaces";
import { calcularAfinidad } from "../lib/afinidadAdopcion";
import { useAccion } from "./useAccion";
import { useConfirmar } from "./useConfirmar";
import { useConsulta } from "./useConsulta";

const SIN_AFINIDAD: AfinidadPostulacion = { porcentaje: 0, razones: [] };

// "Elegir familia": las postulaciones de un animal, la afinidad de cada una,
// y las acciones (elegir, rechazar y cerrar la adopción).
export const useElegirFamilia = (publicacion: PublicacionPropia, onCambio: () => void) => {
  const [recarga, setRecarga] = useState(0);
  const ficha = useConsulta(() => getDetalleAdopcion(publicacion.id), [publicacion.id]);
  const lista = useConsulta(() => getPostulacionesAdopcion(publicacion.id), [publicacion.id, recarga]);
  const [elegidaId, setElegidaId] = useState<number | null>(null);
  const [cerrando, setCerrando] = useState(false);
  const [adoptado, setAdoptado] = useState(false);
  const confirmar = useConfirmar();
  const accion = useAccion();

  const postulaciones = useMemo(() => lista.datos ?? [], [lista.datos]);
  // Por defecto se muestra la familia ya elegida; si no hay, la más reciente
  const seleccionada =
    postulaciones.find((p) => p.id === elegidaId) ?? postulaciones.find((p) => p.estado === "aceptada") ?? postulaciones[0] ?? null;

  const afinidades = useMemo(() => {
    const animal = ficha.datos;
    return new Map(postulaciones.map((p) => [p.id, animal ? calcularAfinidad(animal, p) : SIN_AFINIDAD]));
  }, [ficha.datos, postulaciones]);

  const cambio = useCallback(() => {
    setRecarga((n) => n + 1);
    onCambio();
  }, [onCambio]);

  const elegir = useCallback(async () => {
    if (!seleccionada) return;
    if (await accion.ejecutar(() => responderPostulacion(seleccionada.id, true), TEXTOS_ELEGIR_FAMILIA.errorAccion)) cambio();
  }, [seleccionada, accion, cambio]);

  const rechazar = useCallback(async () => {
    if (!seleccionada) return;
    if (!(await confirmar(CONFIRMACIONES.rechazarPostulacion(seleccionada.nombre, publicacion.nombre)))) return;
    if (await accion.ejecutar(() => responderPostulacion(seleccionada.id, false), TEXTOS_ELEGIR_FAMILIA.errorAccion)) cambio();
  }, [seleccionada, confirmar, publicacion.nombre, accion, cambio]);

  const concretar = useCallback(
    async (datos: DatosConcretarAdopcion) => {
      if (!seleccionada) return;
      const ok = await accion.ejecutar(() => concretarAdopcion(publicacion.id, seleccionada.id, datos), TEXTOS_ADOPTADA.error);
      if (ok) {
        setCerrando(false);
        setAdoptado(true);
        cambio();
      }
    },
    [seleccionada, accion, publicacion.id, cambio],
  );

  return {
    ficha: ficha.datos ?? null,
    postulaciones,
    seleccionada,
    seleccionar: setElegidaId,
    afinidad: (id: number) => afinidades.get(id) ?? SIN_AFINIDAD,
    nuevas: postulaciones.filter((p) => p.estado === "pendiente").length,
    cargando: lista.cargando || ficha.cargando,
    error: lista.error,
    ocupado: accion.ocupado,
    errorAccion: accion.error,
    elegir,
    rechazar,
    cerrando,
    abrirCierre: () => setCerrando(true),
    cancelarCierre: () => setCerrando(false),
    concretar,
    adoptado,
  };
};
