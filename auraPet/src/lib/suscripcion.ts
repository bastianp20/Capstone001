import { TEXTOS_SUSCRIPCION } from "../constants";
import type { Plan } from "../interfaces";
import { fechaDentroDe, formatFechaLarga } from "./fechas";

// Reglas de la suscripción, sin React ni Supabase (reutilizables y fáciles de probar).

// 29990 -> "$29.990"
export const formatearCLP = (monto: number): string => `$${monto.toLocaleString("es-CL")}`;

// "Gratis" o "$29.990/mes"
export const precioPlan = (plan: Plan): string =>
  plan.precioMensual === 0 ? TEXTOS_SUSCRIPCION.gratis : `${formatearCLP(plan.precioMensual)}${TEXTOS_SUSCRIPCION.porMes}`;

// Días entre dos fechas "AAAA-MM-DD" (mediodía, para no cambiar de día por zona horaria)
const diasEntre = (desde: string, hasta: string): number =>
  Math.round((new Date(`${hasta}T12:00:00`).getTime() - new Date(`${desde}T12:00:00`).getTime()) / 86_400_000);

// Progreso de la prueba: "Día 25 de 30" (día entre 1 y el total)
export const progresoPrueba = (inicio: string, fin: string, hoy = fechaDentroDe(0)) => {
  const total = Math.max(1, diasEntre(inicio, fin));
  const dia = Math.min(total, Math.max(1, diasEntre(inicio, hoy) + 1));
  return { dia, total, terminada: hoy > fin, fechaFin: formatFechaLarga(fin) };
};

// El plan siguiente (el que se sugiere al "Mejorar plan"); null si ya está en el más alto
export const planSiguiente = (planes: Plan[], actual: Plan): Plan | null =>
  planes.find((p) => p.precioMensual > actual.precioMensual) ?? null;
