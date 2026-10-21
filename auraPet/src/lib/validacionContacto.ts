import { LIMITES_CONTACTO, REGEX_CORREO, TEXTOS_CONTACTO } from "../constants";
import type { DatosContacto } from "../interfaces";

// Revisa el formulario de contacto antes de enviarlo (la base revisa lo mismo,
// migración 30). Devuelve el primer error o null si está todo bien.
export const validarContacto = (datos: DatosContacto): string | null => {
  if (datos.nombre.trim().length < LIMITES_CONTACTO.nombreMin) return TEXTOS_CONTACTO.errorNombre;
  if (!REGEX_CORREO.test(datos.correo.trim())) return TEXTOS_CONTACTO.errorCorreo;
  if (datos.mensaje.trim().length < LIMITES_CONTACTO.mensajeMin) return TEXTOS_CONTACTO.errorMensaje;
  return null;
};
