import { useCallback, useRef, useState } from "react";
import { MS_TOAST } from "../constants";

// el toast es un mensajito que aparece y se va solo, es más que nada para avisar que algo se hizo. 
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
