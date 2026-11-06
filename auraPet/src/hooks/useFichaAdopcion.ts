import { useMemo, useState } from "react";
import { getAnimalesAdopcion, getDetalleAdopcion } from "../Api/getInfo";
import { MAX_OTROS_ADOPCION } from "../constants";
import type { FichaAdopcion } from "../interfaces";
import { useConsulta } from "./useConsulta";

// Ficha /adopta/:id: el animal, y otros que también buscan hogar.
// marcarPostulado() actualiza la ficha al instante después de postular.
export const useFichaAdopcion = (id: number) => {
  const detalle = useConsulta(() => (Number.isFinite(id) ? getDetalleAdopcion(id) : Promise.resolve(null)), [id]);
  const lista = useConsulta(getAnimalesAdopcion, []);
  const [postulado, setPostulado] = useState<number | null>(null);

  const ficha = useMemo<FichaAdopcion | null>(() => {
    const f = detalle.datos ?? null;
    return f && postulado === f.id ? { ...f, yaPostule: true } : f;
  }, [detalle.datos, postulado]);

  const otros = useMemo(
    () => (lista.datos ?? []).filter((a) => a.id !== id && a.estado === "disponible").slice(0, MAX_OTROS_ADOPCION),
    [lista.datos, id],
  );

  return {
    ficha,
    otros,
    cargando: detalle.cargando,
    error: detalle.error,
    marcarPostulado: () => setPostulado(id),
  };
};
