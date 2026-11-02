import { useCallback, useEffect, useRef, useState } from "react";
import type { PosicionMenu } from "../interfaces";

const ALTO_MENU_ESTIMADO = 230; // si no cabe abajo, se abre hacia arriba
const SEPARACION = 6;

// Menú que se abre con un botón ("⋯") y se cierra al hacer clic afuera, con
// Escape o al hacer scroll. Se dibuja "fixed" junto al botón, así no lo corta
// una tabla con scroll ni una tarjeta con overflow.
export const useMenuEmergente = <E extends HTMLElement>() => {
  const [posicion, setPosicion] = useState<PosicionMenu | null>(null);
  const contenedor = useRef<E>(null);
  const abierto = posicion !== null;

  useEffect(() => {
    if (!abierto) return;
    const cerrar = () => setPosicion(null);
    const alClic = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) cerrar();
    };
    const alTecla = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    document.addEventListener("mousedown", alClic);
    document.addEventListener("keydown", alTecla);
    window.addEventListener("scroll", cerrar, true);
    window.addEventListener("resize", cerrar);
    return () => {
      document.removeEventListener("mousedown", alClic);
      document.removeEventListener("keydown", alTecla);
      window.removeEventListener("scroll", cerrar, true);
      window.removeEventListener("resize", cerrar);
    };
  }, [abierto]);

  const alternar = useCallback((boton: HTMLElement) => {
    setPosicion((actual) => {
      if (actual) return null;
      const r = boton.getBoundingClientRect();
      const right = window.innerWidth - r.right;
      return r.bottom + ALTO_MENU_ESTIMADO > window.innerHeight
        ? { bottom: window.innerHeight - r.top + SEPARACION, right }
        : { top: r.bottom + SEPARACION, right };
    });
  }, []);

  return { abierto, posicion, contenedor, alternar, cerrar: useCallback(() => setPosicion(null), []) };
};
