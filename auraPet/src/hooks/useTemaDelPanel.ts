import { useEffect } from "react";
import { aplicarTemaClaro, aplicarTemaGuardado } from "../lib/tema";

// Mientras se ve un panel (con sesión) se usa el tema elegido en Configuración;
// al salir (cerrar sesión, volver a la página pública) se vuelve a claro.
export const useTemaDelPanel = () => {
  useEffect(() => {
    aplicarTemaGuardado();
    return aplicarTemaClaro;
  }, []);
};
