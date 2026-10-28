import { useCallback, useMemo } from "react";
import { guardarRefugio } from "../Api/postInfo";
import { useAuth } from "../Auth/AuthContext";
import { DATOS_REFUGIO_VACIOS, PASOS_REFUGIO, TEXTOS_MODAL_REFUGIO as T } from "../constants";
import type { CampoRefugio, CuentaEncontrada, DatosRefugio, RefugioAdmin } from "../interfaces";
import { datosDesdeRefugio, validarRefugio } from "../lib/refugios";
import { useAccion } from "./useAccion";
import { useFormularioPasos } from "./useFormularioPasos";
import { useImagenesRefugio } from "./useImagenesRefugio";

// Modal "Nuevo / Editar refugio" (superadmin): 3 pasos, imágenes,
// administradores y el guardado (sube imágenes y llama a guardar_refugio).
export const useFormularioRefugio = (refugio: RefugioAdmin | null, onGuardado: () => void) => {
  const { usuarioActual } = useAuth();
  const inicial = useMemo(() => (refugio ? datosDesdeRefugio(refugio) : DATOS_REFUGIO_VACIOS), [refugio]);
  const f = useFormularioPasos<DatosRefugio, CampoRefugio>({ inicial, pasos: PASOS_REFUGIO, validar: validarRefugio });
  const imagenes = useImagenesRefugio();
  const accion = useAccion();
  const { datos, actualizar } = f;

  const elegirImagen = useCallback(
    (campo: "logo" | "portada") => (archivo: File) => {
      const nueva = imagenes.elegir(datos[campo], archivo);
      if (nueva) actualizar(campo, nueva);
    },
    [imagenes, datos, actualizar],
  );

  const agregarAdmin = useCallback(
    (c: CuentaEncontrada) => {
      if (datos.administradores.some((a) => a.id === c.id)) return;
      actualizar("administradores", [...datos.administradores, { id: c.id, nombre: c.nombre, correo: c.correo, esPrueba: c.esPrueba }]);
    },
    [datos.administradores, actualizar],
  );
  const quitarAdmin = useCallback(
    (id: string) => actualizar("administradores", datos.administradores.filter((a) => a.id !== id)),
    [datos.administradores, actualizar],
  );

  const guardar = useCallback(async () => {
    if (!usuarioActual || !f.avanzar() || !f.valido) return;
    const ok = await accion.ejecutar(() => guardarRefugio(usuarioActual.id, refugio?.id ?? null, datos), T.error);
    if (ok) onGuardado();
  }, [usuarioActual, f, accion, refugio, datos, onGuardado]);

  return {
    ...f,
    esNuevo: !refugio,
    elegirLogo: elegirImagen("logo"),
    elegirPortada: elegirImagen("portada"),
    errorImagen: imagenes.error,
    agregarAdmin,
    quitarAdmin,
    guardar,
    ocupado: accion.ocupado,
    errorGuardar: accion.error,
  };
};
