import { DIAS_CORTOS, DIAS_LARGOS, MESES_CORTOS, MESES_LARGOS } from '@/constants/constants';

// Fechas de la base:
// · fecha_hora de las citas viene en UTC ("2026-10-28T13:30:00+00:00"): se muestra en la hora del teléfono.
// · fechas de calendario ("2026-10-12": nacimiento, registros, próxima dosis) no tienen hora:
//   se leen como día local para que no se corran un día por la zona horaria.

const dosDigitos = (n: number) => n.toString().padStart(2, '0');

/** "2026-10-12" → Date a las 00:00 locales. */
export const desdeFechaDia = (fecha: string): Date => {
  const [anio, mes, dia] = fecha.slice(0, 10).split('-').map(Number);
  return new Date(anio, mes - 1, dia);
};

/** Date → "2026-10-12" (día local). */
export const aFechaDia = (fecha: Date): string =>
  `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;

export const hoy = (): string => aFechaDia(new Date());

/** Suma días a una fecha "2026-10-12". */
export const sumarDias = (fecha: string, dias: number): string => {
  const d = desdeFechaDia(fecha);
  d.setDate(d.getDate() + dias);
  return aFechaDia(d);
};

/** Días completos de `desde` a `hasta` (negativo si hasta es anterior). */
export const diasEntre = (desde: string, hasta: string): number =>
  Math.round((desdeFechaDia(hasta).getTime() - desdeFechaDia(desde).getTime()) / 86_400_000);

/** 1 = lunes ... 7 = domingo, igual que dia_semana en la base. */
export const diaSemanaIso = (fecha: string): number => {
  const d = desdeFechaDia(fecha).getDay();
  return d === 0 ? 7 : d;
};

/** "2026-10-28T13:30:00Z" → { dia: "MIÉ", numero: "28", mes: "OCT", hora: "10:30" } (hora del teléfono). */
export function partesFechaCita(fechaIso: string) {
  const fecha = new Date(fechaIso);
  return {
    dia: DIAS_CORTOS[fecha.getDay()],
    numero: fecha.getDate().toString(),
    mes: MESES_CORTOS[fecha.getMonth()],
    hora: `${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}`,
  };
}

/** "2026-10-28T13:30:00Z" → "MIÉ 28 OCT · 10:30". */
export const formatFechaHoraCita = (fechaIso: string): string => {
  const { dia, numero, mes, hora } = partesFechaCita(fechaIso);
  return `${dia} ${numero} ${mes} · ${hora}`;
};

/** Día local de una cita: "2026-10-28". */
export const diaDeCita = (fechaIso: string): string => aFechaDia(new Date(fechaIso));

/** "2026-10-12" → "12 oct". */
export const formatFechaCorta = (fecha: string): string => {
  const d = desdeFechaDia(fecha);
  return `${d.getDate()} ${MESES_CORTOS[d.getMonth()].toLowerCase()}`;
};

/** "2026-10-12" → "12 oct 2026". */
export const formatFechaLarga = (fecha: string): string =>
  `${formatFechaCorta(fecha)} ${desdeFechaDia(fecha).getFullYear()}`;

/** "2026-10-12" → "Octubre 2026" (títulos de la línea de tiempo). */
export const formatMesAnio = (fecha: string): string => {
  const d = desdeFechaDia(fecha);
  const mes = MESES_LARGOS[d.getMonth()];
  return `${mes.charAt(0).toUpperCase()}${mes.slice(1)} ${d.getFullYear()}`;
};

/** "Hoy", "Hace 5 días", "Hace 3 meses", "Hace 1 año". */
export const tiempoDesde = (fecha: string): string => {
  const dias = diasEntre(fecha, hoy());
  if (dias <= 0) return 'Hoy';
  if (dias === 1) return 'Ayer';
  if (dias < 30) return `Hace ${dias} días`;
  const meses = Math.floor(dias / 30.44);
  if (meses < 12) return meses === 1 ? 'Hace 1 mes' : `Hace ${meses} meses`;
  const anios = Math.floor(meses / 12);
  return anios === 1 ? 'Hace 1 año' : `Hace ${anios} años`;
};

/** "En 12 días", "Mañana", "Hoy"; si ya pasó, "Hace…". */
export const tiempoHasta = (fecha: string): string => {
  const dias = diasEntre(hoy(), fecha);
  if (dias < 0) return tiempoDesde(fecha);
  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Mañana';
  return `En ${dias} días`;
};

/** Edad desde la fecha de nacimiento: "4 años", "8 meses", "2 semanas". */
export const edadDesde = (fechaNacimiento: string | null): string | null => {
  if (!fechaNacimiento) return null;
  const dias = diasEntre(fechaNacimiento, hoy());
  if (dias < 0) return null;
  if (dias < 60) {
    const semanas = Math.max(1, Math.floor(dias / 7));
    return semanas === 1 ? '1 semana' : `${semanas} semanas`;
  }
  const meses = Math.floor(dias / 30.44);
  if (meses < 12) return `${meses} meses`;
  const anios = Math.floor(meses / 12);
  return anios === 1 ? '1 año' : `${anios} años`;
};

/** "15-03-2021" → "2021-03-15", o null si no es una fecha válida y pasada. */
export const parsearFechaChilena = (texto: string): string | null => {
  const m = texto.trim().match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (!m) return null;
  const [, dia, mes, anio] = m.map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  const valida = fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
  if (!valida || aFechaDia(fecha) > hoy()) return null;
  return aFechaDia(fecha);
};

/** "2021-03-15" → "15-03-2021" (para mostrar en el formulario). */
export const formatFechaChilena = (fecha: string | null): string => {
  if (!fecha) return '';
  const [anio, mes, dia] = fecha.slice(0, 10).split('-');
  return `${dia}-${mes}-${anio}`;
};

/** "09:30" → minutos desde medianoche. */
export const aMinutos = (hora: string): number => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

/** 570 → "09:30". */
export const desdeMinutos = (minutos: number): string => `${dosDigitos(Math.floor(minutos / 60))}:${dosDigitos(minutos % 60)}`;

/** Día "2026-10-28" + hora "10:30" (hora del teléfono) → ISO en UTC para la base. */
export const aFechaHoraIso = (fecha: string, hora: string): string => {
  const d = desdeFechaDia(fecha);
  d.setMinutes(aMinutos(hora));
  return d.toISOString();
};

/** "lunes 26 de octubre" (hoy, si no se indica otra fecha). */
export const formatFechaLargaDia = (fecha: string = hoy()): string => {
  const d = desdeFechaDia(fecha);
  return `${DIAS_LARGOS[d.getDay()]} ${d.getDate()} de ${MESES_LARGOS[d.getMonth()]}`;
};
