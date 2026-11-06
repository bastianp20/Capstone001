import { useCallback, useState } from 'react';

// Para botones que guardan algo en la base: maneja "ocupado" y el mensaje de error (igual que la web).
//   const { ejecutar, ocupado, error } = useAccion();
//   const ok = await ejecutar(() => cancelarCita(id), 'No se pudo cancelar.');
// · ejecutar devuelve true si salió bien (para cerrar, recargar, etc.).
export const useAccion = () => {
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState('');

  const ejecutar = useCallback(async (accion: () => Promise<unknown>, mensajeError: string): Promise<boolean> => {
    setOcupado(true);
    setError('');
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

  const limpiarError = useCallback(() => setError(''), []);

  return { ejecutar, ocupado, error, setError, limpiarError };
};
