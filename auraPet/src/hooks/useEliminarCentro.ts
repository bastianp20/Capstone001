import { useCallback, useState } from "react";
import { desactivarCentro, reactivarCentro } from "../Api/postInfo";
import { CONFIRMACIONES, TEXTOS_ELIMINAR_CENTRO as T } from "../constants";
import type { AvisoEstado, CentroListado } from "../interfaces";
import { useAccion } from "./useAccion";
import { useConfirmar } from "./useConfirmar";

// Superadmin → Centros: "Eliminar" (pide motivo; el centro queda desactivado
// y su historial se conserva) y "Reactivar". onCambio recarga la lista.
export const useEliminarCentro = (onCambio: () => void) => {
  const [aEliminar, setAEliminar] = useState<CentroListado | null>(null);
  const [aviso, setAviso] = useState<AvisoEstado | null>(null);
  const { ejecutar, ocupado } = useAccion();
  const confirmar = useConfirmar();

  const confirmarEliminacion = useCallback(
    async (motivo: string) => {
      if (!aEliminar) return;
      let canceladas = 0;
      const ok = await ejecutar(async () => {
        canceladas = await desactivarCentro(aEliminar.id, motivo);
      }, T.error);
      setAviso(ok ? { tipo: "ok", texto: T.listo(aEliminar.nombre, canceladas) } : { tipo: "error", texto: T.error });
      setAEliminar(null);
      if (ok) onCambio();
    },
    [aEliminar, ejecutar, onCambio],
  );

  const reactivar = useCallback(
    async (c: CentroListado) => {
      if (!(await confirmar(CONFIRMACIONES.reactivarCentro(c.nombre)))) return;
      const ok = await ejecutar(() => reactivarCentro(c.id), T.error);
      setAviso(ok ? { tipo: "ok", texto: T.reactivado(c.nombre) } : { tipo: "error", texto: T.error });
      if (ok) onCambio();
    },
    [confirmar, ejecutar, onCambio],
  );

  return {
    aEliminar,
    pedirEliminar: setAEliminar,
    cancelarEliminacion: () => setAEliminar(null),
    confirmarEliminacion,
    reactivar,
    ocupado,
    aviso,
    cerrarAviso: () => setAviso(null),
  };
};
