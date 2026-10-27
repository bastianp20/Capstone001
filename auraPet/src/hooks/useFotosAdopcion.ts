import { useCallback, useState } from "react";
import type { FotoNuevaAdopcion } from "../interfaces";
import { errorFotoAdopcion } from "../lib/validacionAdopcion";

// Fotos elegidas para una publicación: valida tipo, peso y cantidad, crea las
// vistas previas y libera la de cada foto que se quita. (Las que quedan las
// libera usePublicarAdopcion al salir de la página.)
export const useFotosAdopcion = (fotos: FotoNuevaAdopcion[], onCambiar: (fotos: FotoNuevaAdopcion[]) => void) => {
  const [error, setError] = useState<string | null>(null);
  const agregar = useCallback(
    (archivos: FileList | File[]) => {
      const nuevas: FotoNuevaAdopcion[] = [];
      let primerError: string | null = null;
      for (const archivo of Array.from(archivos)) {
        const problema = errorFotoAdopcion(archivo, fotos.length + nuevas.length);
        if (problema) {
          primerError ??= problema;
          continue;
        }
        nuevas.push({ id: crypto.randomUUID(), archivo, vista: URL.createObjectURL(archivo) });
      }
      setError(primerError);
      if (nuevas.length) onCambiar([...fotos, ...nuevas]);
    },
    [fotos, onCambiar],
  );

  const quitar = useCallback(
    (id: string) => {
      const foto = fotos.find((f) => f.id === id);
      if (foto) URL.revokeObjectURL(foto.vista);
      setError(null);
      onCambiar(fotos.filter((f) => f.id !== id));
    },
    [fotos, onCambiar],
  );

  return { agregar, quitar, error };
};
