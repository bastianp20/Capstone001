import { useCallback, useState } from "react";
import type { CampoImagenRefugio, ImagenPorRecortar } from "../interfaces";
import { errorImagenRefugio } from "../lib/refugios";
import { useVistasLocales } from "./useVistasLocales";

// Logo o portada de un refugio: revisa el archivo, lo pasa por el recortador
// y entrega el resultado (archivo + vista previa) a quien lo pidió.
export const useImagenesRefugio = (alListo: (campo: CampoImagenRefugio, archivo: File, vista: string) => void) => {
  const crearVista = useVistasLocales();
  const [error, setError] = useState<string | null>(null);
  const [porRecortar, setPorRecortar] = useState<ImagenPorRecortar | null>(null);

  const elegir = useCallback(
    (campo: CampoImagenRefugio) => (archivo: File) => {
      const problema = errorImagenRefugio(archivo);
      setError(problema);
      if (!problema) setPorRecortar({ campo, url: crearVista(archivo) });
    },
    [crearVista],
  );

  const recortada = useCallback(
    (archivo: File) => {
      if (!porRecortar) return;
      alListo(porRecortar.campo, archivo, crearVista(archivo));
      setPorRecortar(null);
    },
    [porRecortar, alListo, crearVista],
  );

  return { elegir, error, porRecortar, recortada, cancelarRecorte: () => setPorRecortar(null) };
};
