import { useCallback, useState } from "react";
import { postularAdopcion } from "../Api/postInfo";
import { DATOS_POSTULACION_VACIOS, PASOS_POSTULACION_ADOPCION, TEXTOS_POSTULACION } from "../constants";
import type { CampoPostulacionAdopcion, DatosPostulacionAdopcion } from "../interfaces";
import { validarPostulacion } from "../lib/validacionAdopcion";
import { useAccion } from "./useAccion";
import { useFormularioPasos } from "./useFormularioPasos";

// "Quiero adoptarlo": los 4 pasos, la validación y el envío a la base.
export const usePostulacionAdopcion = (adopcionId: number, onEnviada: () => void) => {
  const formulario = useFormularioPasos<DatosPostulacionAdopcion, CampoPostulacionAdopcion>({
    inicial: DATOS_POSTULACION_VACIOS,
    pasos: PASOS_POSTULACION_ADOPCION,
    validar: validarPostulacion,
  });
  const { ejecutar, ocupado, error } = useAccion();
  const [enviada, setEnviada] = useState(false);

  // En el último paso, "Enviar": valida todo y manda la postulación.
  const enviar = useCallback(async () => {
    if (!formulario.avanzar()) return;
    const ok = await ejecutar(() => postularAdopcion(adopcionId, formulario.datos), TEXTOS_POSTULACION.error);
    if (ok) {
      setEnviada(true);
      onEnviada();
    }
  }, [formulario, ejecutar, adopcionId, onEnviada]);

  return { ...formulario, enviar, enviando: ocupado, errorEnvio: error, enviada };
};
