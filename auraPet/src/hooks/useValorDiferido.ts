import { useEffect, useState } from "react";

// Devuelve "valor" recién cuando deja de cambiar por "ms" milisegundos.
// Sirve para no consultar la base en cada tecla del buscador.
export const useValorDiferido = <T,>(valor: T, ms: number): T => {
  const [diferido, setDiferido] = useState(valor);
  useEffect(() => {
    const t = setTimeout(() => setDiferido(valor), ms);
    return () => clearTimeout(t);
  }, [valor, ms]);
  return diferido;
};
