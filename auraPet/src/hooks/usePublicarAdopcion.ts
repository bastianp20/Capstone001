import { useCallback, useEffect, useRef, useState } from "react";
import { publicarAdopcion } from "../Api/postInfo";
import { useAuth } from "../Auth/AuthContext";
import { DATOS_PUBLICAR_VACIOS, PASOS_PUBLICAR_ADOPCION, TEXTOS_PUBLICAR } from "../constants";
import type { CampoPublicarAdopcion, DatosPublicarAdopcion } from "../interfaces";
import { validarPublicacion } from "../lib/validacionAdopcion";
import { useAccion } from "./useAccion";
import { useFormularioPasos } from "./useFormularioPasos";

// "Dar en adopción": los pasos, la validación y la publicación (fotos + datos).
export const usePublicarAdopcion = () => {
  const { usuarioActual } = useAuth();
  const formulario = useFormularioPasos<DatosPublicarAdopcion, CampoPublicarAdopcion>({
    inicial: DATOS_PUBLICAR_VACIOS,
    pasos: PASOS_PUBLICAR_ADOPCION,
    validar: validarPublicacion,
  });
  const { ejecutar, ocupado, error } = useAccion();
  const [publicadaId, setPublicadaId] = useState<number | null>(null);

  // Las vistas previas de las fotos se liberan al salir de la página
  const fotos = useRef(formulario.datos.fotos);
  useEffect(() => {
    fotos.current = formulario.datos.fotos;
  }, [formulario.datos.fotos]);
  useEffect(() => () => fotos.current.forEach((f) => URL.revokeObjectURL(f.vista)), []);

  const publicar = useCallback(async () => {
    if (!usuarioActual || !formulario.valido) return;
    let id = 0;
    const ok = await ejecutar(async () => {
      id = await publicarAdopcion(usuarioActual.id, formulario.datos);
    }, TEXTOS_PUBLICAR.error);
    if (ok) setPublicadaId(id);
  }, [usuarioActual, formulario, ejecutar]);

  const otraPublicacion = useCallback(() => {
    formulario.datos.fotos.forEach((f) => URL.revokeObjectURL(f.vista));
    setPublicadaId(null);
    formulario.reiniciar();
  }, [formulario]);

  return { ...formulario, publicar, publicando: ocupado, errorPublicar: error, publicadaId, otraPublicacion };
};
