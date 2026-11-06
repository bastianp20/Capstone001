import { BUCKET_ADOPCIONES, EDAD_DESCONOCIDA, EDAD_SENIOR_ADOPCION } from "../constants";
import type { AnimalAdopcion, EspecieAdopcion, EstadoBotonAdoptar, EtapaAdopcion, FichaAdopcion, FiltrosExtraAdopcion } from "../interfaces";
import { supabase } from "./supabase";

// Cálculos de la página /adopta (sin estado: se usan desde los hooks).

/** "Esta semana te presentamos a…": el primero disponible, revisado y con frase propia. */
export const elegirDestacado = (animales: AnimalAdopcion[]): AnimalAdopcion | null =>
  animales.find((a) => a.estado === "disponible" && a.chequeo && a.frase) ??
  animales.find((a) => a.estado === "disponible") ??
  null;

/** ¿Pasa los filtros del panel lateral y el interruptor "Solo revisados"? */
export const cumpleFiltrosExtra = (a: AnimalAdopcion, f: FiltrosExtraAdopcion): boolean =>
  (!f.soloRevisados || !!a.chequeo) &&
  (!f.tamano || a.tamano === f.tamano) &&
  (!f.etapa || a.etapa === f.etapa) &&
  (!f.sexo || a.sexo === f.sexo) &&
  (!f.comuna || a.comuna === f.comuna);

/** Cuántos filtros del panel lateral están puestos (para "Más filtros (2)"). */
export const contarFiltrosPanel = (f: FiltrosExtraAdopcion, busqueda: string): number =>
  [f.tamano, f.etapa, f.sexo, f.comuna, busqueda.trim() || null].filter(Boolean).length;

/** Comunas sin repetir, ordenadas, para el desplegable. */
export const comunasDe = (animales: AnimalAdopcion[]): string[] =>
  [...new Set(animales.map((a) => a.comuna))].sort((a, b) => a.localeCompare(b, "es"));

// ---------- De la base a la pantalla ----------

/** La base tiene perro, gato, ave, conejo y otro; la página agrupa ave y conejo en "otro". */
export const especieAdopcion = (especie: string): EspecieAdopcion =>
  especie === "perro" || especie === "gato" ? especie : "otro";

const mesesDesde = (fecha: string, hoy = new Date()): number => {
  const [anio, mes, dia] = fecha.slice(0, 10).split("-").map(Number);
  let meses = (hoy.getFullYear() - anio) * 12 + (hoy.getMonth() + 1 - mes);
  if (hoy.getDate() < dia) meses--;
  return Math.max(0, meses);
};

/** "4 meses", "1 año", "7 años" (la fecha de nacimiento es aproximada). */
export const edadAdopcion = (fechaNacimiento: string | null): string => {
  if (!fechaNacimiento) return EDAD_DESCONOCIDA;
  const meses = mesesDesde(fechaNacimiento);
  if (meses < 12) return meses <= 1 ? "1 mes" : `${meses} meses`;
  const anios = Math.floor(meses / 12);
  return anios === 1 ? "1 año" : `${anios} años`;
};

/** Cachorro (menos de 1 año), Senior (según la especie) o Adulto. Sin fecha, se asume adulto. */
export const etapaAdopcion = (especie: EspecieAdopcion, fechaNacimiento: string | null): EtapaAdopcion => {
  if (!fechaNacimiento) return "adulto";
  const anios = mesesDesde(fechaNacimiento) / 12;
  if (anios < 1) return "cachorro";
  return anios >= EDAD_SENIOR_ADOPCION[especie] ? "senior" : "adulto";
};

/** Las fotos se guardan como ruta del bucket ("<id>/foto.jpg"); en pantalla se usa la URL pública. */
export const urlFotoAdopcion = (ruta: string | null): string | null => {
  if (!ruta) return null;
  if (/^https?:\/\//.test(ruta)) return ruta;
  return supabase.storage.from(BUCKET_ADOPCIONES).getPublicUrl(ruta).data.publicUrl;
};

/** Años y meses aproximados → fecha de nacimiento "AAAA-MM-DD" (null si no se indicó nada). */
export const fechaDesdeEdad = (anios: string, meses: string, hoy = new Date()): string | null => {
  const a = Number(anios) || 0;
  const m = Number(meses) || 0;
  if (a <= 0 && m <= 0) return null;
  const fecha = new Date(hoy.getFullYear() - a, hoy.getMonth() - m, hoy.getDate());
  const dos = (n: number) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
};

/** Qué muestra el botón "Quiero adoptarlo" según la ficha. */
export const estadoBotonAdoptar = (f: FichaAdopcion): EstadoBotonAdoptar => {
  if (f.adoptado) return "adoptado";
  if (f.esMia) return "mia";
  if (f.yaPostule) return "postulado";
  if (f.estado === "en_proceso") return "en_proceso";
  return "disponible";
};
