import { useCallback, useEffect, useRef, useState } from "react";
import { postularRefugio } from "../Api/postInfo";
import { useAuth } from "../Auth/AuthContext";
import { DATOS_POSTULAR_REFUGIO_VACIOS, PASOS_POSTULAR_REFUGIO, TEXTOS_POSTULAR_REFUGIO as T } from "../constants";
import type { CampoPostularRefugio, DatosPostularRefugio } from "../interfaces";
import { validarPostulacionRefugio } from "../lib/refugios";
import { useAccion } from "./useAccion";
import { useFormularioPasos } from "./useFormularioPasos";
import { useImagenesRefugio } from "./useImagenesRefugio";

// "Súmate a AuraPet": los 3 pasos, el logo (con recorte), las fotos del lugar
// y el envío. Se puede postular con o sin cuenta (sin cuenta, el correo es
// obligatorio: ahí llega el acceso al aprobarlo). enviadoId queda al terminar.
// trampa: campo invisible que solo llenan los bots (si viene lleno, no se envía).
export const usePostularRefugio = () => {
  const { usuarioActual } = useAuth();
  const conSesion = !!usuarioActual;
  const validar = useCallback((d: DatosPostularRefugio) => validarPostulacionRefugio(d, conSesion), [conSesion]);
  const f = useFormularioPasos<DatosPostularRefugio, CampoPostularRefugio>({
    inicial: DATOS_POSTULAR_REFUGIO_VACIOS,
    pasos: PASOS_POSTULAR_REFUGIO,
    validar,
  });
  const { datos, actualizar } = f;
  const { ejecutar, ocupado, error } = useAccion();
  const [enviadoId, setEnviadoId] = useState<number | null>(null);
  const [trampa, setTrampa] = useState("");
  const imagenes = useImagenesRefugio((_, archivo, vista) => actualizar("logo", { ruta: null, archivo, vista }));

  // Las vistas previas de las fotos se liberan al salir de la página
  const fotos = useRef(datos.fotos);
  useEffect(() => {
    fotos.current = datos.fotos;
  }, [datos.fotos]);
  useEffect(() => () => fotos.current.forEach((x) => URL.revokeObjectURL(x.vista)), []);

  const enviar = useCallback(async () => {
    if (!f.avanzar() || !f.valido) return;
    if (trampa) return setEnviadoId(0);
    let id = 0;
    const ok = await ejecutar(async () => {
      id = await postularRefugio(usuarioActual?.id ?? null, datos);
    }, T.error);
    if (ok) setEnviadoId(id);
  }, [usuarioActual, f, trampa, ejecutar, datos]);

  return {
    ...f,
    conSesion,
    nombreCuenta: usuarioActual?.nombre ?? null,
    elegirLogo: imagenes.elegir("logo"),
    errorLogo: imagenes.error,
    porRecortar: imagenes.porRecortar,
    recortada: imagenes.recortada,
    cancelarRecorte: imagenes.cancelarRecorte,
    trampa,
    setTrampa,
    enviar,
    enviando: ocupado,
    errorEnviar: error,
    enviado: enviadoId !== null,
    correoAcceso: conSesion ? null : datos.correo.trim(),
  };
};
