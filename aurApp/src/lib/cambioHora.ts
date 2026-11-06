// Textos y validaciones de "Modificar cita" y "Bloquear horario" (sin estado).
import type { CitaVeterinario } from '@/interfaces';

import { aFechaHoraIso, formatFechaHoraCita, parsearFechaChilena } from './fechas';
import { normalizarHora } from './horarioAtencion';

/** Centros (sin repetir) de un grupo de citas, para "Avisar a …". */
export const centrosDeCitas = (citas: CitaVeterinario[]): string[] =>
  [...new Set(citas.filter((c) => c.centroId !== null && c.centro).map((c) => c.centro as string))];

/** Fecha y hora escritas a mano → ISO, o null si no sirven. */
export const fechaManualAIso = (dia: string, hora: string): string | null => {
  const fecha = parsearFechaChilena(dia, true);
  const h = normalizarHora(hora);
  return fecha && h ? aFechaHoraIso(fecha, h) : null;
};

export const describirCita = (c: CitaVeterinario) => `${c.mascota} · ${formatFechaHoraCita(c.fechaHora)}`;
