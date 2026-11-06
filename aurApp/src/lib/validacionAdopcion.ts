import {
  MAX_PERSONALIDAD_ADOPCION,
  MIN_HISTORIA_ADOPCION,
  MIN_MOTIVO_POSTULACION,
  TEXTOS_POSTULACION,
  TEXTOS_PUBLICAR,
} from '@/constants/constants';
import type {
  CampoPostulacion,
  CampoPublicar,
  DatosPostulacionAdopcion,
  DatosPublicarAdopcion,
  ErroresDe,
  PasoPostulacion,
  PasoPublicar,
} from '@/interfaces';

// Validaciones de los formularios de adopción, paso a paso. Devuelven { campo: mensaje }
// solo con los campos con problemas (vacío = el paso está bien).

const E = TEXTOS_POSTULACION.errores;

export const validarPasoPostulacion = (d: DatosPostulacionAdopcion, paso: PasoPostulacion): ErroresDe<CampoPostulacion> => {
  const e: ErroresDe<CampoPostulacion> = {};
  if (paso === 0) {
    if (!d.vivienda) e.vivienda = E.elegir;
    if (d.tienePatio === null) e.tienePatio = E.elegir;
    if (!d.tenencia) e.tenencia = E.elegir;
    if (d.tenencia === 'arrendada' && d.permitenMascotas === null) e.permitenMascotas = E.elegir;
  }
  if (paso === 1) {
    if (d.hayNinos === null) e.hayNinos = E.elegir;
    if (d.hayNinos && !d.edadesNinos.trim()) e.edadesNinos = E.edades;
    if (d.otrasMascotas === null) e.otrasMascotas = E.elegir;
    if (d.otrasMascotas && !d.cualesMascotas.trim()) e.cualesMascotas = E.cuales;
    if (d.todosDeAcuerdo === null) e.todosDeAcuerdo = E.elegir;
  }
  if (paso === 2 && d.motivo.trim().length < MIN_MOTIVO_POSTULACION) e.motivo = E.motivo;
  if (paso === 3 && !d.aceptaCompromiso) e.aceptaCompromiso = E.compromiso;
  return e;
};

const P = TEXTOS_PUBLICAR.errores;

export const validarPasoPublicar = (d: DatosPublicarAdopcion, paso: PasoPublicar): ErroresDe<CampoPublicar> => {
  const e: ErroresDe<CampoPublicar> = {};
  if (paso === 0) {
    if (!d.fotos.length) e.fotos = P.fotos;
    if (!d.nombre.trim()) e.nombre = P.nombre;
    if (!d.especie) e.especie = P.elegir;
    if (!d.sexo) e.sexo = P.elegir;
    if (!(Number(d.anios) > 0) && !(Number(d.meses) > 0)) e.anios = P.edad;
    if (!d.tamano) e.tamano = P.elegir;
    if (!d.comuna.trim()) e.comuna = P.comuna;
  }
  if (paso === 1) {
    if (!d.personalidad.length) e.personalidad = P.personalidad;
    if (d.personalidad.length > MAX_PERSONALIDAD_ADOPCION) e.personalidad = P.maxPersonalidad;
  }
  if (paso === 2) {
    const peso = Number(d.pesoKg.replace(',', '.'));
    if (d.pesoKg.trim() && !(peso > 0 && peso < 150)) e.pesoKg = P.peso;
    if (d.historia.trim().length < MIN_HISTORIA_ADOPCION) e.historia = P.historia;
  }
  return e;
};

export const hayErrores = (errores: object): boolean => Object.keys(errores).length > 0;
