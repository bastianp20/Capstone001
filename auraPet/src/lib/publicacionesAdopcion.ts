import type { HitoCaminoCasa, PublicacionPropia, Refugio } from "../interfaces";

// Cálculos de "Mis publicaciones" y Refugios (sin estado).

/** Hitos del camino a casa que ya se cumplieron. */
export const hitosCumplidos = (p: PublicacionPropia): Set<HitoCaminoCasa> => {
  const hechos = new Set<HitoCaminoCasa>(["publicada"]);
  if (p.revisadaPor) hechos.add("revisada");
  if (p.postulaciones > 0 || p.estado === "adoptada") hechos.add("postulaciones");
  if (p.estado === "en_proceso" || p.estado === "adoptada") hechos.add("elegida");
  if (p.estado === "adoptada") hechos.add("adoptada");
  return hechos;
};

/** El hito en el que va: el primero sin cumplir (null si ya fue adoptado). */
export const hitoActual = (p: PublicacionPropia, orden: readonly HitoCaminoCasa[]): HitoCaminoCasa | null => {
  const hechos = hitosCumplidos(p);
  return orden.find((h) => !hechos.has(h)) ?? null;
};

/** La publicación con más movimiento: más postulaciones nuevas; si no hay, la activa más reciente. */
export const publicacionDestacada = (lista: PublicacionPropia[]): PublicacionPropia | null => {
  const activas = lista.filter((p) => p.estado === "publicada" || p.estado === "en_proceso");
  if (!activas.length) return null;
  return [...activas].sort((a, b) => b.nuevas - a.nuevas || b.creadaEn.localeCompare(a.creadaEn))[0];
};

/** "hace 2 h", "ayer", "hace 3 días", "hace 2 semanas"… */
export const haceCuanto = (iso: string, ahora = new Date()): string => {
  const minutos = Math.max(0, Math.round((ahora.getTime() - new Date(iso).getTime()) / 60000));
  if (minutos < 60) return minutos <= 1 ? "recién" : `hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.round(horas / 24);
  if (dias === 1) return "ayer";
  if (dias < 14) return `hace ${dias} días`;
  const semanas = Math.round(dias / 7);
  if (semanas < 9) return `hace ${semanas} semanas`;
  const meses = Math.round(dias / 30);
  return meses <= 1 ? "hace 1 mes" : `hace ${meses} meses`;
};

/** Iniciales para avatares: "Javiera Soto" → "JS". */
export const iniciales = (nombre: string): string =>
  nombre.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

/** Ocupación de un refugio en porcentaje (0–100). */
export const ocupacionRefugio = (r: Refugio): number =>
  r.cuposTotales > 0 ? Math.min(100, Math.round((r.cuposOcupados / r.cuposTotales) * 100)) : 0;

/** Valores distintos y ordenados de una lista (para los desplegables de filtros). */
export const valoresUnicos = (lista: string[]): string[] => [...new Set(lista.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));

/** Teléfono guardado (569XXXXXXXX o 9XXXXXXXX) → número para wa.me (solo dígitos, con 56). */
export const telefonoParaWhatsapp = (telefono: number): string => {
  const digitos = String(telefono).replace(/\D/g, "");
  return digitos.startsWith("56") ? digitos : `56${digitos}`;
};
