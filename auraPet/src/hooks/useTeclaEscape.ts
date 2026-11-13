import { useEffect } from "react";

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
