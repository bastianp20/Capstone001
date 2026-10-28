import { useCallback, useState } from "react";
import { editarMiRefugio } from "../Api/postInfo";
import { useAuth } from "../Auth/AuthContext";
import { TEXTOS_MI_REFUGIO as T } from "../constants";
import type { DatosEditarMiRefugio, DetalleMiRefugio } from "../interfaces";
import { datosEdicionDesdeDetalle, validarEdicionRefugio } from "../lib/refugios";
import { useAccion } from "./useAccion";
import { useImagenesRefugio } from "./useImagenesRefugio";

// Panel "Editar datos del refugio" (quien lo administra).
export const useEditarMiRefugio = (refugio: DetalleMiRefugio, onGuardado: () => void) => {
  const { usuarioActual } = useAuth();
  const [datos, setDatos] = useState<DatosEditarMiRefugio>(() => datosEdicionDesdeDetalle(refugio));
  const [intentado, setIntentado] = useState(false);
  const imagenes = useImagenesRefugio();
  const accion = useAccion();
  const errores = validarEdicionRefugio(datos);

  const cambiar = useCallback(<K extends keyof DatosEditarMiRefugio>(campo: K, valor: DatosEditarMiRefugio[K]) => {
    setDatos((d) => ({ ...d, [campo]: valor }));
  }, []);

  const elegirImagen = (campo: "logo" | "portada") => (archivo: File) => {
    const nueva = imagenes.elegir(datos[campo], archivo);
    if (nueva) cambiar(campo, nueva);
  };

  const guardar = async () => {
    setIntentado(true);
    if (!usuarioActual || Object.keys(errores).length) return;
    const ok = await accion.ejecutar(() => editarMiRefugio(usuarioActual.id, refugio.id, datos), T.errorGuardar);
    if (ok) onGuardado();
  };

  return {
    datos,
    cambiar,
    errores: intentado ? errores : {},
    elegirLogo: elegirImagen("logo"),
    elegirPortada: elegirImagen("portada"),
    errorImagen: imagenes.error,
    guardar,
    ocupado: accion.ocupado,
    error: accion.error,
  };
};
