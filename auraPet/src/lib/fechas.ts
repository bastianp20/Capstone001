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

// "2026-10-20" — fecha (formato de columna date) dentro de N días desde hoy.
// Se usa en los atajos de "Próximo control" de la receta.
export const fechaDentroDe = (dias: number, desde = new Date()): string => {
  const f = new Date(desde);
  f.setDate(f.getDate() + dias); // setDate se encarga de pasar de mes o de año
  return `${f.getFullYear()}-${d2(f.getMonth() + 1)}-${d2(f.getDate())}`;
};

// "10:30" — hora de una cita en formato 24 h (hora de Chile).
export const formatHora24 = (iso: string): string => {
  const { hora, minuto } = partesEnChile(iso);
  return `${d2(hora)}:${d2(minuto)}`;
};

// Día del mes (1 a 31) en que cae un timestamptz, en hora de Chile.
export const diaDelMesEnChile = (iso: string): number => partesEnChile(iso).dia;

// "16 oct" — para fechas date cortas (controles próximos).
export const formatDiaMes = (fecha: string): string => {
  const { mes, dia } = partesFecha(fecha);
  return `${dia} ${MESES_ABREV[mes - 1]}`;
};

// "martes 13 de octubre" — encabezado de la pantalla de inicio.
export const formatFechaTitulo = (fecha = new Date()): string =>
  new Intl.DateTimeFormat("es-CL", { timeZone: ZONA, weekday: "long", day: "numeric", month: "long" }).format(fecha);

// "octubre" — nombre del mes actual.
export const nombreMes = (fecha = new Date()): string =>
  new Intl.DateTimeFormat("es-CL", { timeZone: ZONA, month: "long" }).format(fecha);

// "Buenos días" / "Buenas tardes" / "Buenas noches" según la hora de Chile.
export const saludoSegunHora = (fecha = new Date()): string => {
  const { hora } = partesEnChile(fecha.toISOString());
  if (hora >= 5 && hora < 12) return "Buenos días";
  if (hora >= 12 && hora < 20) return "Buenas tardes";
  return "Buenas noches";
};

// Rangos para consultar la base: inicio de hoy, de mañana, del mes y del mes siguiente.
// Se calculan con la hora del computador (en Chile coincide con la del centro).
export const rangosDeFecha = (ahora = new Date()) => {
  const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const inicioManana = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const inicioMesSiguiente = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 1);
  const diasDelMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).getDate();
  return { inicioHoy, inicioManana, inicioMes, inicioMesSiguiente, diasDelMes, diaHoy: ahora.getDate() };
};

// Día de la semana de una fecha date ("2026-10-20"): 1 = lunes ... 7 = domingo,
// igual que dia_semana en horarios_centro. Se usa el mediodía para no cambiar de día por zona horaria.
export const diaSemanaDeFecha = (fecha: string): number => {
  const dia = new Date(`${fecha}T12:00:00`).getDay(); // 0 = domingo
  return dia === 0 ? 7 : dia;
};

// "20 de octubre de 2026, 14:30 h" — fecha de emisión de los PDF (hora de Chile).
export const formatFechaEmision = (fecha = new Date()): string => {
  const partes = new Intl.DateTimeFormat("es-CL", {
    timeZone: ZONA, day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(fecha);
  const p = Object.fromEntries(partes.map((x) => [x.type, x.value]));
  return `${p.day} de ${p.month} de ${p.year}, ${p.hour}:${p.minute} h`;
};
