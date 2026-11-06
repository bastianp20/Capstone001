import { useCallback, useRef, useState } from "react";
import { MS_TOAST } from "../constants";

// Mensaje corto que aparece abajo y se va solo ("Cupos actualizados").
export const useToast = () => {
  const [mensaje, setMensaje] = useState<string | null>(null);
  const temporizador = useRef<number | undefined>(undefined);
  const mostrar = useCallback((texto: string) => {
    setMensaje(texto);
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setMensaje(null), MS_TOAST);
  }, []);
  return { mensaje, mostrar };
};
