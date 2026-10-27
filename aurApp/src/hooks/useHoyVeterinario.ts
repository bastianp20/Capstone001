import { useMemo } from 'react';

import { useAuth } from '@/Auth/AuthContext';
import { useCentro } from '@/context/CentroContext';
import { useVeterinario } from '@/context/VeterinarioContext';
import { formatFechaLargaDia } from '@/lib/fechas';
import { capitalizar, primerNombre } from '@/lib/texto';
import { citasDeHoy, citasPorConfirmar, saludoDelDia, siguientePaciente } from '@/lib/veterinario';

import { useAccionesCitaVeterinario } from './useAccionesCitaVeterinario';

/** Pantalla "Hoy" del veterinario: saludo, indicadores, siguiente paciente, solicitudes y agenda del día. */
export function useHoyVeterinario() {
  const { usuarioActual } = useAuth();
  const { datos, cargando, error, recargar, recargando } = useVeterinario();
  const { centros: centrosAdministrados } = useCentro();
  const acciones = useAccionesCitaVeterinario();

  const citas = useMemo(() => datos?.citas ?? [], [datos]);
  const deHoy = useMemo(() => citasDeHoy(citas), [citas]);
  const pendientes = useMemo(() => citasPorConfirmar(citas), [citas]);

  return {
    saludo: `${saludoDelDia()}, ${primerNombre(usuarioActual?.nombre ?? '')}`,
    fecha: capitalizar(formatFechaLargaDia()),
    nombreCompleto: usuarioActual?.nombre ?? '',
    info: datos?.info ?? null,
    centrosAdministrados,
    deHoy,
    atendidas: deHoy.filter((c) => c.estado === 'completada').length,
    pendientes,
    siguiente: siguientePaciente(citas),
    derivacionesPendientes: (datos?.derivaciones ?? []).filter((d) => d.recibida && d.estado === 'pendiente').length,
    acciones,
    cargando,
    error,
    recargar,
    recargando,
  };
}
