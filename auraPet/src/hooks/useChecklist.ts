import { useCallback, useState } from "react";

// Lista de casillas para marcar (p. ej. el checklist antes de aprobar un refugio).
export const useChecklist = (cantidad: number) => {
  const [marcadas, setMarcadas] = useState<boolean[]>(() => Array(cantidad).fill(false));
  const alternar = useCallback((i: number) => setMarcadas((m) => m.map((v, j) => (j === i ? !v : v))), []);
  return { marcadas, alternar, completa: marcadas.every(Boolean) };
};
