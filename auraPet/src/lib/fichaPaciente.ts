import { DIAS_AVISO_VACUNA } from "../constants";
import type { EstadoVacuna, RegistroFicha, VacunaFicha } from "../interfaces";
import { fechaDentroDe, formatFechaLarga } from "./fechas";

// Reglas de la ficha del paciente, separadas de la pantalla para poder
// reutilizarlas (p. ej. en la lista de pacientes) y probarlas sin React.

// Falta el dato clínico básico que el veterinario puede completar: el peso.
// (La fecha de nacimiento la registra el dueño, así que no cuenta aquí.)
export const faltanDatosClinicos = (datos: { pesoKg: number | null }): boolean => datos.pesoKg === null;

// "3 años", "1 año", "Menos de 1 año" o null si no se conoce.
export const formatEdad = (edad: number | null): string | null => {
  if (edad === null) return null;
  if (edad < 1) return "Menos de 1 año";
  return edad === 1 ? "1 año" : `${edad} años`;
};

// Estado de una vacuna según su próxima dosis ("2026-12-20").
// Las fechas "AAAA-MM-DD" se pueden comparar como texto.
export const estadoVacuna = (proximaDosis: string, hoy = fechaDentroDe(0)): EstadoVacuna => {
  if (proximaDosis < hoy) return "vencida";
  if (proximaDosis <= fechaDentroDe(DIAS_AVISO_VACUNA)) return "por_vencer";
  return "al_dia";
};

// Vacunas con próxima dosis: solo la más reciente de cada una (por nombre),
// porque el historial viene del registro más nuevo al más antiguo.
export const resumirVacunas = (historial: RegistroFicha[]): VacunaFicha[] => {
  const vistas = new Set<string>();
  const vacunas: VacunaFicha[] = [];
  for (const r of historial) {
    if (r.tipo !== "vacuna" || !r.proximaDosis) continue;
    const clave = r.descripcion.trim().toLowerCase();
    if (vistas.has(clave)) continue;
    vistas.add(clave);
    vacunas.push({
      registroId: r.id,
      nombre: r.descripcion,
      aplicada: r.fecha,
      proximaDosis: formatFechaLarga(r.proximaDosis),
      estado: estadoVacuna(r.proximaDosis),
    });
  }
  return vacunas;
};
