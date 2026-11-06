// Página de urgencias: qué centro está abierto ahora, en qué orden se muestran
// y los enlaces para llamar y llegar. Solo cálculos.
import type { CentroUrgencia, CentroUrgenciaVista, FiltrosUrgencias, HorarioCentro } from "../interfaces";
import { diaSemanaDeFecha, fechaEnChile, formatHora24 } from "./fechas";
import { estadoUciVigente } from "./estadoUci";

// Día (1 = lunes) y hora ("14:05") de este momento en Chile
export const ahoraEnChile = (ahora: Date) => {
  const iso = ahora.toISOString();
  return { diaSemana: diaSemanaDeFecha(fechaEnChile(iso)), hora: formatHora24(iso) };
};

export const horarioDeHoy = (horarios: HorarioCentro[], ahora: Date): HorarioCentro | null =>
  horarios.find((h) => h.diaSemana === ahoraEnChile(ahora).diaSemana) ?? null;

// ¿Atiende en este momento? (fuera de la colación)
export const abiertoAhora = (horarios: HorarioCentro[], ahora: Date) => {
  const h = horarioDeHoy(horarios, ahora);
  if (!h) return false;
  const { hora } = ahoraEnChile(ahora);
  const enColacion = h.inicioColacion !== null && h.finColacion !== null && hora >= h.inicioColacion && hora < h.finColacion;
  return hora >= h.abre && hora < h.cierra && !enColacion;
};

const UCI_CON_LUGAR = ["disponible", "pocos_cupos"];

// Orden: primero UCI con lugar (y al día), luego 24/7, luego abiertos, luego cerrados
export const prepararCentros = (centros: CentroUrgencia[], ahora: Date): CentroUrgenciaVista[] =>
  centros
    .map((c) => {
      const uciVigente = c.estadoUci !== null && estadoUciVigente(c.estadoUci.actualizadoEn, ahora);
      const abierto = c.urgencias247 || abiertoAhora(c.horarios, ahora);
      const uciConLugar = uciVigente && UCI_CON_LUGAR.includes(c.estadoUci!.estado);
      const prioridad = uciConLugar ? 0 : c.urgencias247 ? 1 : abierto ? 2 : 3;
      return { ...c, abiertoAhora: abierto, uciVigente, prioridad };
    })
    .sort((a, b) => a.prioridad - b.prioridad || a.nombre.localeCompare(b.nombre));

export const filtrarCentros = (centros: CentroUrgenciaVista[], f: FiltrosUrgencias) =>
  centros.filter((c) =>
    (!f.comuna || c.comuna === f.comuna) &&
    (!f.soloAbiertos || c.abiertoAhora) &&
    (!f.soloUciDisponible || (c.uciVigente && UCI_CON_LUGAR.includes(c.estadoUci?.estado ?? ""))));

export const comunasDe = (centros: CentroUrgencia[]) =>
  [...new Set(centros.map((c) => c.comuna))].sort((a, b) => a.localeCompare(b));

export const enlaceLlamar = (telefono: number) => `tel:+${telefono}`;

export const enlaceComoLlegar = (direccion: string, comuna: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${direccion}, ${comuna}, Chile`)}`;
