import { useCallback, useEffect, useState } from "react";

// Carrusel que avanza solo y vuelve al inicio al llegar al final.
//   const c = useCarrusel(posiciones, 4500);
//   c.indice -> posición actual · c.siguiente() / c.anterior() / c.irA(n)
//   c.pausar() / c.reanudar() -> para detenerlo mientras el mouse o el foco están encima
// Si la persona pidió menos animaciones en su sistema, no avanza solo.
export const useCarrusel = (posiciones: number, intervaloMs: number) => {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);

  const irA = useCallback((n: number) => setIndice(((n % posiciones) + posiciones) % posiciones), [posiciones]);
  const siguiente = useCallback(() => setIndice((i) => (i + 1) % posiciones), [posiciones]);
  const anterior = useCallback(() => setIndice((i) => (i - 1 + posiciones) % posiciones), [posiciones]);

  useEffect(() => {
    const menosMovimiento = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (pausado || menosMovimiento || posiciones < 2) return;
    const t = setInterval(siguiente, intervaloMs);
    return () => clearInterval(t);
  }, [pausado, posiciones, intervaloMs, siguiente]);

  return {
    indice,
    irA,
    siguiente,
    anterior,
    pausar: () => setPausado(true),
    reanudar: () => setPausado(false),
  };
};
