import { useCallback, useState } from "react";

// Para botones que guardan algo en la base: maneja "ocupado" y el mensaje de error.
//   const { ejecutar, ocupado, error } = useAccion();
//   const ok = await ejecutar(() => agregarRegistroMedico(datos), "No se pudo guardar.");
// · ejecutar devuelve true si salió bien (para cerrar el formulario, recargar, etc.).
export const useAccion = () => {
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutar = useCallback(async (accion: () => Promise<unknown>, mensajeError: string): Promise<boolean> => {
    setOcupado(true);
    setError(null);
    try {
      await accion();
      return true;
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : mensajeError);
      return false;
    } finally {
      setOcupado(false);
    }
  }, []);

  return { ejecutar, ocupado, error, limpiarError: () => setError(null) };
};
