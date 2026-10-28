import { useCallback, useEffect, useRef } from "react";

// Vistas previas de archivos elegidos (URL.createObjectURL). Se liberan todas
// al salir de la pantalla, no antes (así la vista previa nunca queda rota).
export const useVistasLocales = () => {
  const urls = useRef<string[]>([]);
  useEffect(() => {
    const lista = urls.current;
    return () => lista.forEach((u) => URL.revokeObjectURL(u));
  }, []);
  return useCallback((archivo: File) => {
    const url = URL.createObjectURL(archivo);
    urls.current.push(url);
    return url;
  }, []);
};
