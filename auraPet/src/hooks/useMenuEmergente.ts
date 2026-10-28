import { useCallback, useEffect, useRef, useState } from "react";

// Menú que se abre con un botón ("⋯") y se cierra al hacer clic afuera o con Escape.
export const useMenuEmergente = <E extends HTMLElement>() => {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<E>(null);

  useEffect(() => {
    if (!abierto) return;
    const alClic = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    };
    const alTecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("mousedown", alClic);
    document.addEventListener("keydown", alTecla);
    return () => {
      document.removeEventListener("mousedown", alClic);
      document.removeEventListener("keydown", alTecla);
    };
  }, [abierto]);

  return {
    abierto,
    contenedor,
    alternar: useCallback(() => setAbierto((a) => !a), []),
    cerrar: useCallback(() => setAbierto(false), []),
  };
};
