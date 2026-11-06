import { useCallback, useState } from 'react';

import type { ErroresDe } from '@/interfaces';

/**
 * Formulario en pasos (postular a una adopción, dar en adopción…):
 * guarda los datos, valida el paso actual antes de avanzar y muestra los errores de ese paso.
 *   const f = useFormularioPasos(DATOS_VACIOS, PASOS.length, validarPaso);
 *   f.cambiar('nombre', 'Luna'); f.continuar(); f.volver();
 */
export function useFormularioPasos<D extends object>(
  inicial: D,
  totalPasos: number,
  validarPaso: (datos: D, paso: number) => ErroresDe<Extract<keyof D, string>>,
) {
  const [datos, setDatos] = useState<D>(inicial);
  const [paso, setPaso] = useState(0);
  const [errores, setErrores] = useState<ErroresDe<Extract<keyof D, string>>>({});

  const cambiar = useCallback(<K extends keyof D>(campo: K, valor: D[K]) => {
    setDatos((d) => ({ ...d, [campo]: valor }));
    setErrores((e) => {
      if (!(campo in e)) return e;
      const sinEseError: Record<string, string | undefined> = { ...e };
      delete sinEseError[campo as string];
      return sinEseError as ErroresDe<Extract<keyof D, string>>;
    });
  }, []);

  /** Revisa el paso actual; devuelve true si está bien. */
  const validar = (): boolean => {
    const nuevos = validarPaso(datos, paso);
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const continuar = (): boolean => {
    if (!validar()) return false;
    setPaso((p) => Math.min(totalPasos - 1, p + 1));
    return true;
  };

  const volver = () => {
    setErrores({});
    setPaso((p) => Math.max(0, p - 1));
  };

  return { datos, cambiar, paso, errores, validar, continuar, volver, esPrimero: paso === 0, esUltimo: paso === totalPasos - 1 };
}
