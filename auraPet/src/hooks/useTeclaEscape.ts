import { useEffect } from "react";

// Llama a "alPresionar" cuando se aprieta Escape (para cerrar modales).
// · activo: permite desactivarlo, p. ej. mientras el modal está guardando.
export const useTeclaEscape = (alPresionar: () => void, activo = true) => {
  useEffect(() => {
    if (!activo) return;
    const manejar = (e: KeyboardEvent) => {
      if (e.key === "Escape") alPresionar();
    };
    window.addEventListener("keydown", manejar);
    return () => window.removeEventListener("keydown", manejar);
  }, [alPresionar, activo]);
};
