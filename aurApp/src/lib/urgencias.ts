// Urgencias sin cuenta: si un centro está abierto ahora, el orden y los enlaces
// para llamar y llegar (igual que la web, con la hora del teléfono).
import { Linking } from 'react-native';

import type { CentroUrgencia, CentroUrgenciaVista, FiltrosUrgencias, HorarioCentro } from '@/interfaces';

import { estadoUciVigente } from './estadoUci';
import { abrirEnMapa } from './mapas';

const ahoraLocal = (ahora: Date) => {
  const d = ahora.getDay();
  return {
    diaSemana: d === 0 ? 7 : d,
    hora: `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`,
  };
};

export const horarioDeHoy = (horarios: HorarioCentro[], ahora: Date) =>
  horarios.find((h) => h.diaSemana === ahoraLocal(ahora).diaSemana) ?? null;

export const abiertoAhora = (horarios: HorarioCentro[], ahora: Date) => {
  const h = horarioDeHoy(horarios, ahora);
  if (!h) return false;
  const { hora } = ahoraLocal(ahora);
  const enColacion = h.inicioColacion !== null && h.finColacion !== null && hora >= h.inicioColacion && hora < h.finColacion;
  return hora >= h.abre && hora < h.cierra && !enColacion;
};

const UCI_CON_LUGAR = ['disponible', 'pocos_cupos'];

export const prepararCentros = (centros: CentroUrgencia[], ahora: Date): CentroUrgenciaVista[] =>
  centros
    .map((c) => {
      const uciVigente = c.estadoUci !== null && estadoUciVigente(c.estadoUci.actualizadoEn, ahora);
      const abierto = c.urgencias247 || abiertoAhora(c.horarios, ahora);
      const conLugar = uciVigente && UCI_CON_LUGAR.includes(c.estadoUci!.estado);
      return { ...c, abiertoAhora: abierto, uciVigente, prioridad: conLugar ? 0 : c.urgencias247 ? 1 : abierto ? 2 : 3 };
    })
    .sort((a, b) => a.prioridad - b.prioridad || a.nombre.localeCompare(b.nombre));

export const filtrarCentros = (centros: CentroUrgenciaVista[], f: FiltrosUrgencias) =>
  centros.filter((c) =>
    (!f.comuna || c.comuna === f.comuna) &&
    (!f.soloAbiertos || c.abiertoAhora) &&
    (!f.soloUciDisponible || (c.uciVigente && UCI_CON_LUGAR.includes(c.estadoUci?.estado ?? ''))));

export const comunasDe = (centros: CentroUrgencia[]) => [...new Set(centros.map((c) => c.comuna))].sort((a, b) => a.localeCompare(b));

export const llamar = (telefono: number) => Linking.openURL(`tel:+${telefono}`);

export const comoLlegar = (direccion: string, comuna: string) => abrirEnMapa(`${direccion}, ${comuna}, Chile`);
