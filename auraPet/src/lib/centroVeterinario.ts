import { TEXTOS_CENTRO_VETERINARIO } from "../constants";
import type { InfoVeterinario } from "../interfaces";

const T = TEXTOS_CENTRO_VETERINARIO;

// Texto de la barra superior del veterinario: sus centros, o qué pidió
// mientras su cuenta está en revisión, o "independiente".
export const textoCentroVeterinario = (info: InfoVeterinario): string => {
  if (info.centros.length > 0) return info.centros.join(" · ");
  const donde = info.centroSolicitado
    ? T.seAsignaAlAprobar(info.centroSolicitado)
    : info.centroMencionado
      ? T.noEstaEnAuraPet(info.centroMencionado)
      : null;
  if (info.estado === "pendiente") return [T.enRevision, donde].filter(Boolean).join(" · ");
  return donde ?? T.independiente;
};

// "Clínica San Roque, Ñuñoa" (comuna opcional)
export const nombreConComuna = (nombre: string | null, comuna: string | null): string | null =>
  nombre ? `${nombre}${comuna ? `, ${comuna}` : ""}` : null;
