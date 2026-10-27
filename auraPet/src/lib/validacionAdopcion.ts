import {
  MAX_FOTOS_ADOPCION,
  MAX_MB_FOTO_ADOPCION,
  MIN_HISTORIA_ADOPCION,
  MIN_MOTIVO_POSTULACION,
  TEXTOS_POSTULACION,
  TEXTOS_PUBLICAR,
  TIPOS_FOTO_ADOPCION,
} from "../constants";
import type {
  CampoPostulacionAdopcion,
  CampoPublicarAdopcion,
  DatosPostulacionAdopcion,
  DatosPublicarAdopcion,
  ErroresFormulario,
} from "../interfaces";

// Validaciones de los formularios de adopción. Devuelven { campo: mensaje } solo
// con los campos que tienen problemas (useFormularioPasos decide cuáles mostrar).

const E = TEXTOS_POSTULACION.errores;

export const validarPostulacion = (d: DatosPostulacionAdopcion): ErroresFormulario<CampoPostulacionAdopcion> => {
  const e: ErroresFormulario<CampoPostulacionAdopcion> = {};
  if (!d.vivienda) e.vivienda = E.elegir;
  if (d.tienePatio === null) e.tienePatio = E.elegir;
  if (!d.tenencia) e.tenencia = E.elegir;
  if (d.tenencia === "arrendada" && d.permitenMascotas === null) e.permitenMascotas = E.elegir;
  if (d.hayNinos === null) e.hayNinos = E.elegir;
  if (d.hayNinos && !d.edadesNinos.trim()) e.edadesNinos = E.edades;
  if (d.otrasMascotas === null) e.otrasMascotas = E.elegir;
  if (d.otrasMascotas && !d.cualesMascotas.trim()) e.cualesMascotas = E.cuales;
  if (d.todosDeAcuerdo === null) e.todosDeAcuerdo = E.elegir;
  if (d.motivo.trim().length < MIN_MOTIVO_POSTULACION) e.motivo = E.motivo;
  if (!d.aceptaCompromiso) e.aceptaCompromiso = E.compromiso;
  return e;
};

const P = TEXTOS_PUBLICAR.errores;

export const validarPublicacion = (d: DatosPublicarAdopcion): ErroresFormulario<CampoPublicarAdopcion> => {
  const e: ErroresFormulario<CampoPublicarAdopcion> = {};
  if (!d.fotos.length) e.fotos = P.fotos;
  if (!d.nombre.trim()) e.nombre = P.nombre;
  if (!d.especie) e.especie = P.elegir;
  if (!d.sexo) e.sexo = P.elegir;
  if (!(Number(d.anios) > 0) && !(Number(d.meses) > 0)) e.anios = P.edad;
  if (!d.tamano) e.tamano = P.elegir;
  if (!d.comuna.trim()) e.comuna = P.comuna;
  if (!d.personalidad.length) e.personalidad = P.personalidad;
  const peso = Number(d.pesoKg.replace(",", "."));
  if (d.pesoKg.trim() && !(peso > 0 && peso < 150)) e.pesoKg = P.peso;
  if (d.historia.trim().length < MIN_HISTORIA_ADOPCION) e.historia = P.historia;
  return e;
};

/** ¿Se puede subir este archivo? Devuelve el mensaje de error o null. */
export const errorFotoAdopcion = (archivo: File, yaHay: number): string | null => {
  if (yaHay >= MAX_FOTOS_ADOPCION) return P.fotoMaximo;
  if (!TIPOS_FOTO_ADOPCION.includes(archivo.type)) return P.fotoTipo;
  if (archivo.size > MAX_MB_FOTO_ADOPCION * 1024 * 1024) return P.fotoPeso;
  return null;
};
