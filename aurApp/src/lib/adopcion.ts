import { BUCKET_ADOPCIONES, EDAD_DESCONOCIDA, EDAD_SENIOR_ADOPCION, RAZA_SIN_INDICAR, TEXTOS_POSTULANTES as P } from '@/constants/constants';
import type {
  AnimalAdopcion,
  DatosPublicarAdopcion,
  EspecieAdopcion,
  EstadoBotonAdoptar,
  EtapaAdopcion,
  FichaAdopcion,
  FiltrosAdopcion,
  HitoCaminoCasa,
  ItemConIcono,
  PublicacionPropia,
  Refugio,
  RespuestasHogar,
} from '@/interfaces';

import { supabase } from './supabase';

// Cálculos de adopción (sin estado: se usan desde los hooks y la Api). Iguales a la web.

/** La base tiene perro, gato, ave, conejo y otro; Adopta agrupa ave y conejo en "otro". */
export const especieAdopcion = (especie: string): EspecieAdopcion => (especie === 'perro' || especie === 'gato' ? especie : 'otro');

const mesesDesde = (fecha: string, hoy = new Date()): number => {
  const [anio, mes, dia] = fecha.slice(0, 10).split('-').map(Number);
  let meses = (hoy.getFullYear() - anio) * 12 + (hoy.getMonth() + 1 - mes);
  if (hoy.getDate() < dia) meses--;
  return Math.max(0, meses);
};

/** "4 meses", "1 año", "7 años" (la fecha de nacimiento es aproximada). */
export const edadAdopcion = (fechaNacimiento: string | null): string => {
  if (!fechaNacimiento) return EDAD_DESCONOCIDA;
  const meses = mesesDesde(fechaNacimiento);
  if (meses < 12) return meses <= 1 ? '1 mes' : `${meses} meses`;
  const anios = Math.floor(meses / 12);
  return anios === 1 ? '1 año' : `${anios} años`;
};

/** Cachorro (menos de 1 año), Senior (según la especie) o Adulto. Sin fecha, se asume adulto. */
export const etapaAdopcion = (especie: EspecieAdopcion, fechaNacimiento: string | null): EtapaAdopcion => {
  if (!fechaNacimiento) return 'adulto';
  const anios = mesesDesde(fechaNacimiento) / 12;
  if (anios < 1) return 'cachorro';
  return anios >= EDAD_SENIOR_ADOPCION[especie] ? 'senior' : 'adulto';
};

/** Ruta del bucket ("<id>/foto.jpg") → URL pública. Si ya es una URL, queda igual. */
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
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
};

/** Qué muestra el botón "Quiero adoptarlo" según la ficha. */
export const estadoBotonAdoptar = (f: FichaAdopcion): EstadoBotonAdoptar => {
  if (f.adoptado) return 'adoptado';
  if (f.esMia) return 'mia';
  if (f.yaPostule) return 'postulado';
  if (f.enProceso) return 'en_proceso';
  return 'disponible';
};

/** ¿Pasa todos los filtros de Adopta? (la búsqueda por texto la hace useFiltro). */
export const cumpleFiltrosAdopcion = (a: AnimalAdopcion, f: FiltrosAdopcion, guardados: ReadonlySet<number>): boolean =>
  (f.especie === 'todos' || a.especie === f.especie) &&
  (!f.soloRevisados || !!a.chequeo) &&
  (!f.soloGuardados || guardados.has(a.id)) &&
  (!f.tamano || a.tamano === f.tamano) &&
  (!f.etapa || a.etapa === f.etapa) &&
  (!f.sexo || a.sexo === f.sexo) &&
  (!f.comuna || a.comuna === f.comuna) &&
  (!f.refugioId || a.refugioId === f.refugioId);

/** Cuántos filtros de la hoja "Filtros" están puestos (para el número del botón). */
export const contarFiltrosHoja = (f: FiltrosAdopcion): number =>
  [f.soloRevisados, f.soloGuardados, f.tamano, f.etapa, f.sexo, f.comuna].filter(Boolean).length;

/** Valores distintos y ordenados (comunas para los filtros). */
export const valoresUnicos = (lista: string[]): string[] => [...new Set(lista.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));

/** Hitos del "camino a casa" que ya se cumplieron. */
export const hitosCumplidos = (p: PublicacionPropia): Set<HitoCaminoCasa> => {
  const hechos = new Set<HitoCaminoCasa>(['publicada']);
  if (p.revisadaPor) hechos.add('revisada');
  if (p.postulaciones > 0 || p.estado === 'adoptada') hechos.add('postulaciones');
  if (p.estado === 'en_proceso' || p.estado === 'adoptada') hechos.add('elegida');
  if (p.estado === 'adoptada') hechos.add('adoptada');
  return hechos;
};

/** Ocupación de un refugio de 0 a 1. */
export const ocupacionRefugio = (r: Refugio): number => (r.cuposTotales > 0 ? Math.min(1, r.cuposOcupados / r.cuposTotales) : 0);

/** "hace 2 h", "ayer", "hace 3 días"… */
export const haceCuanto = (iso: string, ahora = new Date()): string => {
  const minutos = Math.max(0, Math.round((ahora.getTime() - new Date(iso).getTime()) / 60000));
  if (minutos < 60) return minutos <= 1 ? 'recién' : `hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.round(horas / 24);
  if (dias === 1) return 'ayer';
  if (dias < 14) return `hace ${dias} días`;
  const semanas = Math.round(dias / 7);
  if (semanas < 9) return `hace ${semanas} semanas`;
  const meses = Math.round(dias / 30);
  return meses <= 1 ? 'hace 1 mes' : `hace ${meses} meses`;
};

/** "Casa propia, con patio" · "Le permiten mascotas" (si arrienda). */
export const lineasHogar = (r: RespuestasHogar): ItemConIcono[] => {
  const masculino = r.vivienda === 'departamento';
  const vivienda = [r.vivienda ? P.vivienda[r.vivienda] : null, r.tenencia ? P.tenencia(r.tenencia, masculino) : null].filter(Boolean).join(' ');
  const lineas: ItemConIcono[] = [{ icono: 'inicio', texto: `${vivienda}, ${r.tienePatio ? P.conPatio : P.sinPatio}` }];
  if (r.tenencia === 'arrendada' && r.permitenMascotas !== null) lineas.push({ icono: 'check', texto: r.permitenMascotas ? P.permiten : P.noPermiten });
  return lineas;
};

/** Niños, otras mascotas y si todos están de acuerdo. */
export const lineasFamilia = (r: RespuestasHogar): ItemConIcono[] => [
  { icono: 'persona', texto: r.hayNinos ? P.ninos(r.edadesNinos?.trim() || null) : P.sinNinos },
  { icono: 'huella', texto: r.otrasMascotas ? P.mascotas(r.cualesMascotas?.trim() || null) : P.sinMascotas },
  { icono: 'corazon', texto: r.todosDeAcuerdo ? P.deAcuerdo : P.noDeAcuerdo },
];

/** Lo que se está publicando, como se verá en la grilla de Adopta (para la vista previa). */
export const animalDeVistaPrevia = (d: DatosPublicarAdopcion, refugio: string | null): AnimalAdopcion => {
  const especie = especieAdopcion(d.especie ?? 'otro');
  const nacimiento = fechaDesdeEdad(d.anios, d.meses);
  const sexo = d.sexo ?? 'macho';
  return {
    id: 0,
    nombre: d.nombre.trim(),
    especie,
    raza: d.raza.trim() || RAZA_SIN_INDICAR[sexo],
    sexo,
    tamano: d.tamano ?? 'mediano',
    edad: edadAdopcion(nacimiento),
    etapa: etapaAdopcion(especie, nacimiento),
    comuna: d.comuna.trim(),
    personalidad: d.personalidad,
    frase: d.frase.trim() || null,
    chequeo: null,
    enProceso: false,
    fotoUrl: d.fotos[0]?.uri ?? null,
    refugioId: d.refugioId,
    refugio,
  };
};
