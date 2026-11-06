import { useMemo } from 'react';

import { useAuth } from '@/Auth/AuthContext';
import { useCentro } from '@/context/CentroContext';
import { citasDeLaSemana, FILTROS_CITA_CENTRO, proximasCitas, textoHorarioHoy } from '@/lib/centro';

const CITAS_AHORA = 3;

/** Resumen del centro: citas de hoy y de la semana, por confirmar, equipo, suscripción, próximas citas y horario. */
export function useResumenCentro() {
  const { usuarioActual } = useAuth();
  const centro = useCentro();
  const datos = centro.datos;
  const citas = useMemo(() => datos?.citas ?? [], [datos]);

  return {
    centro,
    nombreCompleto: usuarioActual?.nombre ?? '',
    detalle: datos?.detalle ?? null,
    citasHoy: citas.filter(FILTROS_CITA_CENTRO.hoy).length,
    semana: citasDeLaSemana(citas),
    porConfirmar: citas.filter((c) => c.estado === 'pendiente' && FILTROS_CITA_CENTRO.proximas(c)).length,
    veterinarios: (datos?.equipo ?? []).filter((m) => m.tipo === 'veterinario').length,
    suscripcion: datos?.suscripcion ?? null,
    ahora: proximasCitas(citas, CITAS_AHORA),
    horarioHoy: datos ? textoHorarioHoy(datos.detalle) : '',
  };
}
