import { useEffect } from "react";
import { aplicarTemaClaro, aplicarTemaGuardado } from "../lib/tema";

// ésto es para que mientras se esté viendo un panel con alguna configuracion de tema, se aplique el
// tema guardado y al salir (a la pantalla principal) vuelva al claro x defecto. 
export const useTemaDelPanel = () => {
  useEffect(() => {
    aplicarTemaGuardado();
    return aplicarTemaClaro;
  }, []);
};
