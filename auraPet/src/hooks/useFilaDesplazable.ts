import { useCallback, useRef } from "react";

// Fila con desplazamiento horizontal y flechas: mueve casi un "ancho" de la fila por clic.
//   const fila = useFilaDesplazable<HTMLDivElement>();
//   <div ref={fila.ref}>…</div>  <button onClick={fila.siguiente}>
export const useFilaDesplazable = <T extends HTMLElement>(proporcion = 0.85) => {
  const ref = useRef<T>(null);
  const mover = useCallback(
    (direccion: 1 | -1) => {
      const el = ref.current;
      if (el) el.scrollBy({ left: direccion * el.clientWidth * proporcion, behavior: "smooth" });
    },
    [proporcion],
  );
  return { ref, anterior: () => mover(-1), siguiente: () => mover(1) };
};
