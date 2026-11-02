import { ICONOS_ESPECIALIDAD, MAX_CHIPS_DESTINO, NOMBRE_MEDICINA_GENERAL, TEXTOS_PEDIR_HORA } from '@/constants/constants';
import type { CentroParaCita, EspecialidadOpcion, NombreIcono, OpcionDestinoCita, ProfesionalParaCita } from '@/interfaces';

// Filtro por especialidades al pedir hora (igual que la web). Sin estado.

/** El catálogo sin "Medicina general" (la tienen todos, no sirve para filtrar). */
export const especialidadesFiltrables = (lista: EspecialidadOpcion[]): EspecialidadOpcion[] =>
  lista.filter((e) => e.nombre.toLowerCase() !== NOMBRE_MEDICINA_GENERAL);

/** ¿Tiene el profesional TODAS las especialidades pedidas? */
export const cumpleEspecialidades = (p: ProfesionalParaCita, requeridas: number[]): boolean =>
  requeridas.every((id) => p.especialidadIds.includes(id));

/** Ícono para una especialidad según su nombre. */
export const iconoEspecialidad = (nombre: string): NombreIcono =>
  ICONOS_ESPECIALIDAD.find((r) => r.patron.test(nombre))?.icono ?? 'estetoscopio';

/** "Cirugía, Dermatología" → ['Cirugía', 'Dermatología'] */
const separar = (texto: string | null): string[] => (texto ? texto.split(',').map((t) => t.trim()).filter(Boolean) : []);

/** Las especialidades a mostrar en una tarjeta: las pedidas, o las más comunes de sus profesionales. */
const chipsDe = (profesionales: ProfesionalParaCita[], pedidas: string[]): string[] => {
  if (pedidas.length) return pedidas.slice(0, MAX_CHIPS_DESTINO);
  const todas = profesionales.flatMap((p) => separar(p.especialidades));
  return [...new Set(todas)].slice(0, MAX_CHIPS_DESTINO);
};

/** Tarjetas de "Centros": los centros (que tengan a alguien que cumpla, si hay filtro). */
export const opcionesCentros = (centros: CentroParaCita[], queCumplen: ProfesionalParaCita[], pedidas: string[]): OpcionDestinoCita[] =>
  centros
    .map((c) => ({ centro: c, profesionales: queCumplen.filter((p) => p.centroId === c.id) }))
    .filter(({ profesionales }) => !pedidas.length || profesionales.length > 0)
    .map(({ centro: c, profesionales }) => ({
      clave: `c-${c.id}`,
      destino: c.id,
      veterinarioId: null,
      titulo: c.nombre,
      detalle: c.comuna,
      logo: { nombre: c.nombre, fotoUrl: null },
      personas: profesionales.map((p) => ({ nombre: p.nombre, fotoUrl: p.fotoUrl })),
      chips: chipsDe(profesionales, pedidas),
    }));

/** Tarjetas de "Independientes": un veterinario por tarjeta (ya queda elegido). */
export const opcionesIndependientes = (queCumplen: ProfesionalParaCita[], pedidas: string[]): OpcionDestinoCita[] =>
  queCumplen
    .filter((p) => p.centroId === null)
    .map((p) => ({
      clave: `v-${p.veterinarioId}`,
      destino: 'independiente' as const,
      veterinarioId: p.veterinarioId,
      titulo: p.nombre,
      detalle: TEXTOS_PEDIR_HORA.independienteSinCentro,
      logo: { nombre: p.nombre, fotoUrl: p.fotoUrl },
      personas: [],
      chips: chipsDe([p], pedidas),
    }));
