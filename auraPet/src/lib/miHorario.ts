// Cálculos para modificar citas del veterinario (reagendar, cancelar, bloquear).
// Solo arman datos: las pantallas están en components/veterinario/.
import type { CitaAgendaItem } from "../interfaces";

// ¿Se puede reagendar o cancelar? Pendiente o confirmada y todavía no pasa.
export const citaModificable = (c: CitaAgendaItem, ahora = new Date()) =>
  (c.estado === "pendiente" || c.estado === "confirmada") && new Date(c.fechaHora) > ahora;

// Citas pendientes o confirmadas que caen dentro de un rango (para "Bloquear horario").
// Se compara en milisegundos: la base y el navegador escriben el ISO distinto
// ("+00:00" vs "Z"), así que comparar los textos daría resultados equivocados.
export const citasEnRango = (citas: CitaAgendaItem[], desde: string, hasta: string): CitaAgendaItem[] => {
  const ini = new Date(desde).getTime();
  const fin = new Date(hasta).getTime();
  return citas.filter((c) => {
    const t = new Date(c.fechaHora).getTime();
    return (c.estado === "pendiente" || c.estado === "confirmada") && t >= ini && t < fin;
  });
};

// Centros distintos de un grupo de citas (a cuáles se puede avisar).
export const centrosDeCitas = (citas: CitaAgendaItem[]): string[] =>
  [...new Set(citas.map((c) => c.centro).filter((c): c is string => c !== null))];

// "Camila" — primer nombre, para los saludos de los mensajes.
export const primerNombre = (nombre: string) => nombre.trim().split(/\s+/)[0] ?? nombre;
