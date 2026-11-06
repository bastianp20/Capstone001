import { NOMBRE_MEDICINA_GENERAL } from "../constants";
import type { EspecialidadOpcion, ProfesionalParaCita, VeterinarioParaCita } from "../interfaces";

// Filtro por especialidades al pedir hora. Sin estado.

/** El catálogo sin "Medicina general" (la tienen todos, no sirve para filtrar). */
export const especialidadesFiltrables = (lista: EspecialidadOpcion[]): EspecialidadOpcion[] =>
  lista.filter((e) => e.nombre.toLowerCase() !== NOMBRE_MEDICINA_GENERAL);

/** ¿Tiene el profesional TODAS las especialidades pedidas? */
export const cumpleEspecialidades = (p: ProfesionalParaCita, requeridas: number[]): boolean =>
  requeridas.every((id) => p.especialidadIds.includes(id));

/** Profesionales de un centro (o los independientes si centroId es null) → opciones del desplegable. */
export const veterinariosDe = (lista: ProfesionalParaCita[], centroId: number | null): VeterinarioParaCita[] =>
  lista
    .filter((p) => p.centroId === centroId)
    .map((p) => ({ id: p.veterinarioId, nombre: p.nombre, especialidad: p.especialidades }));
