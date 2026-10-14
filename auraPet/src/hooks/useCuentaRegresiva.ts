import { useEffect, useState } from "react";

// Cuenta regresiva en segundos.
//   const { restante, iniciar, detener } = useCuentaRegresiva(alTerminar);
//   iniciar(60)  -> restante baja 60, 59, 58... hasta 0 y llama a alTerminar()
// Se usa para la ventana de edición de cuentas reales en el superadmin.
// Si se pasa alTerminar, conviene envolverlo en useCallback (es dependencia del efecto).
export const useCuentaRegresiva = (alTerminar?: () => void) => {
  const [restante, setRestante] = useState(0);

  useEffect(() => {
    if (restante <= 0) return;
    // Cada segundo resta 1. En el último segundo avisa que terminó.
    const t = setTimeout(() => {
      if (restante === 1) alTerminar?.();
      setRestante((r) => r - 1);
    }, 1000);
    return () => clearTimeout(t); // si el componente se cierra, se cancela
  }, [restante, alTerminar]);

  return {
    restante,
    iniciar: (segundos: number) => setRestante(segundos),
    detener: () => setRestante(0),
  };
};
