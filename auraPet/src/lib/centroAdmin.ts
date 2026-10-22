import { MAX_PROXIMAS_CITAS_CENTRO } from "../constants";
import type { CitaCentro, ResumenCitasCentro } from "../interfaces";

const mismoDia = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// Los números del Resumen del centro, a partir de sus citas.
// Es una función pura (recibe "ahora") para poder probarla sin la base.
export const resumirCitasCentro = (citas: CitaCentro[], ahora = new Date()): ResumenCitasCentro => {
  const vigentes = citas.filter((c) => c.estado !== "cancelada");
  const fecha = (c: CitaCentro) => new Date(c.fechaIso);

  return {
    hoy: vigentes.filter((c) => mismoDia(fecha(c), ahora)).length,
    porConfirmar: citas.filter((c) => c.estado === "pendiente" && fecha(c) >= ahora).length,
    mes: vigentes.filter((c) => fecha(c).getFullYear() === ahora.getFullYear() && fecha(c).getMonth() === ahora.getMonth()).length,
    proximas: vigentes
      .filter((c) => fecha(c) >= ahora && c.estado !== "completada")
      .sort((a, b) => fecha(a).getTime() - fecha(b).getTime())
      .slice(0, MAX_PROXIMAS_CITAS_CENTRO),
  };
};

// Texto del horario de un día: "09:00 a 18:00 · colación 13:00 a 14:00"
export const textoHorario = (h: { abre: string; cierra: string; inicioColacion: string | null; finColacion: string | null }) =>
  `${h.abre} a ${h.cierra}${h.inicioColacion ? ` · colación ${h.inicioColacion} a ${h.finColacion}` : ""}`;
