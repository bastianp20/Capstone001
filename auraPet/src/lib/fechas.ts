// Formatos de fecha de AuraPet
//
// La base de datos (Supabase) entrega las fechas como texto estándar:
//   · timestamptz (momento exacto) -> "2026-09-10T13:30:00+00:00"  (en UTC)
//   · date        (día, sin hora)  -> "2025-12-20"
//   · time        (hora de reloj)  -> "09:00:00"
// Estas funciones basicamente muestran la fecha en el formato que queremos en el front. 

// como chile cambia de horario (UTC-4 / UTC-3), nunca se restan horas a mano solo se convierte con esta zona.
const ZONA = "America/Santiago";

// Meses abreviados para los textos tipo "20 dic 2025" o "10 SEP".
const MESES_ABREV = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// Agrega un 0 adelante si hace falta: 5 -> "05".
const d2 = (n: number) => String(n).padStart(2, "0");

// timestamptz -> año, mes, día, hora y minuto EN HORA DE CHILE.
const partesEnChile = (iso: string) => {
  // Intl.DateTimeFormat es la herramienta del navegador que sabe de zonas horarias.
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(iso));
  // formatToParts devuelve [{type:"year", value:"2026"}, ...]; lo pasamos a un objeto.
  const p = Object.fromEntries(partes.map((x) => [x.type, x.value]));
  return { anio: +p.year, mes: +p.month, dia: +p.day, hora: +p.hour, minuto: +p.minute };
};

// date ("2025-12-20") -> año, mes, día. SIN new Date(), porque new Date("2025-12-20")
// lo toma como medianoche UTC y en Chile mostraría el día 19.
const partesFecha = (fecha: string) => {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  return { anio, mes, dia };
};

// "10/09 · 10:30" — panel del superadmin.
export const formatFechaHora = (iso: string): string => {
  const { dia, mes, hora, minuto } = partesEnChile(iso);
  return `${d2(dia)}/${d2(mes)} · ${d2(hora)}:${d2(minuto)}`;
};

// "10:30 AM" — agenda del veterinario.
export const formatHora12h = (iso: string): string => {
  const { hora, minuto } = partesEnChile(iso);
  return `${hora % 12 || 12}:${d2(minuto)} ${hora >= 12 ? "PM" : "AM"}`;
};

// { dia: "10", mes: "SEP" } — el cuadradito de fecha de una cita.
export const formatFechaCaja = (iso: string): { dia: string; mes: string } => {
  const { dia, mes } = partesEnChile(iso);
  return { dia: d2(dia), mes: MESES_ABREV[mes - 1].toUpperCase() };
};

// "23/07/2026" — fechas de creación (solicitudes, cuentas).
export const formatFechaCorta = (iso: string): string => {
  const { anio, mes, dia } = partesEnChile(iso);
  return `${d2(dia)}/${d2(mes)}/${anio}`;
};

// "20 dic 2025" — columnas date (historial médico).
export const formatFechaLarga = (fecha: string): string => {
  const { anio, mes, dia } = partesFecha(fecha);
  return `${dia} ${MESES_ABREV[mes - 1]} ${anio}`;
};

// Años cumplidos a partir de fecha_nacimiento (date). null si no se conoce.
export const calcularEdad = (fechaNacimiento: string | null, hoy = new Date()): number | null => {
  if (!fechaNacimiento) return null;
  const { anio, mes, dia } = partesFecha(fechaNacimiento);
  let edad = hoy.getFullYear() - anio;
  // Si este año todavía no cumple, se resta 1.
  if (hoy.getMonth() + 1 < mes || (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)) edad--;
  return edad;
};

// "09:00" — columnas time (horario de un centro).
export const formatHorario = (hora: string): string => hora.slice(0, 5);
