import { useCallback, useState } from "react";
import type { ImagenRefugio } from "../interfaces";
import { errorImagenRefugio } from "../lib/refugios";
import { useVistasLocales } from "./useVistasLocales";

// Elegir logo o portada de un refugio: revisa el archivo, arma la vista previa
// y entrega la imagen lista para el formulario (o el error para mostrar).
export const useImagenesRefugio = () => {
  const crearVista = useVistasLocales();
  const [error, setError] = useState<string | null>(null);
  const elegir = useCallback(
    (actual: ImagenRefugio, archivo: File): ImagenRefugio | null => {
      const problema = errorImagenRefugio(archivo);
      setError(problema);
      return problema ? null : { ruta: actual.ruta, archivo, vista: crearVista(archivo) };
    },
    [crearVista],
  );
  return { elegir, error };
};
