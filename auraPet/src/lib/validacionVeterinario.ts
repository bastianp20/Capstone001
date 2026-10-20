import { TEXTOS_REGISTRO_VETERINARIO } from "../constants";
import type { DatosLaboralesVeterinario } from "../interfaces";

// ¿Falta algo en "dónde trabajas"? Devuelve el mensaje o null si está bien.
// La usan el registro público y el modal del superadmin.
export const validarDatosLaborales = (d: DatosLaboralesVeterinario): string | null => {
  if (d.modoCentro === "centro_aurapet" && !d.centroId) return TEXTOS_REGISTRO_VETERINARIO.centroRequerido;
  if (d.modoCentro === "centro_externo" && !d.centroNombre.trim()) return TEXTOS_REGISTRO_VETERINARIO.nombreCentroRequerido;
  return null;
};

// Lo que se guarda en los metadatos del signUp (los lee la base, migración 23)
export const metadatosVeterinario = (d: DatosLaboralesVeterinario) => ({
  especialidad_id: d.especialidadId ?? undefined,
  especialidad_otra: d.especialidadOtra.trim() || undefined,
  centro_id: d.modoCentro === "centro_aurapet" ? d.centroId ?? undefined : undefined,
  centro_nombre: d.modoCentro === "centro_externo" ? d.centroNombre.trim() : undefined,
  centro_comuna: d.modoCentro === "centro_externo" ? d.centroComuna.trim() || undefined : undefined,
});
