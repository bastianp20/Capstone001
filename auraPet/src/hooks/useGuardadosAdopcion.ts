import { useCallback, useState } from "react";
import { CLAVE_GUARDADOS_ADOPCION } from "../constants";

// Animales guardados con el corazón. Es una comodidad de este navegador
// (localStorage): si no se puede leer o escribir, simplemente no se recuerda.
const leer = (): number[] => {
  try {
    const crudo = localStorage.getItem(CLAVE_GUARDADOS_ADOPCION);
    const lista: unknown = crudo ? JSON.parse(crudo) : [];
    return Array.isArray(lista) ? lista.filter((x): x is number => typeof x === "number") : [];
  } catch {
    return [];
  }
};

export const useGuardadosAdopcion = () => {
  const [guardados, setGuardados] = useState<number[]>(leer);

  const alternar = useCallback((id: number) => {
    setGuardados((actual) => {
      const nuevo = actual.includes(id) ? actual.filter((x) => x !== id) : [...actual, id];
      try {
        localStorage.setItem(CLAVE_GUARDADOS_ADOPCION, JSON.stringify(nuevo));
      } catch {
        // sin almacenamiento: queda guardado solo mientras la página esté abierta
      }
      return nuevo;
    });
  }, []);

  return { estaGuardado: (id: number) => guardados.includes(id), alternar };
};
