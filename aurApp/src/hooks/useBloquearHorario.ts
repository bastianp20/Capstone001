import { useState } from 'react';

import { bloquearMiHorario } from '@/Api/postInfo';
import { useAuth } from '@/Auth/AuthContext';
import { MENSAJE_SUGERIDO_CAMBIO as M, TEXTOS_CAMBIO_HORA as T } from '@/constants/constants';
import type { MotivoCambioHora, ParametrosBloqueo } from '@/interfaces';
import { citasEnRango } from '@/lib/agendaSemana';
import { centrosDeCitas } from '@/lib/cambioHora';
import { aFechaHoraIso, aMinutos, sumarDias } from '@/lib/fechas';
import { normalizarHora } from '@/lib/horarioAtencion';
import { primerNombre } from '@/lib/texto';

import { useAccion } from './useAccion';
import { useDatosAgendaVeterinario } from './useDatosAgendaVeterinario';

/** "Bloquear horario": un rango del día (o el día entero); si tiene citas, se pueden cancelar avisando a sus dueños. */
export function useBloquearHorario(inicial: ParametrosBloqueo) {
  const { usuarioActual } = useAuth();
  const base = useDatosAgendaVeterinario();
  const accion = useAccion();

  const [todoElDia, setTodoElDia] = useState(false);
  const [desde, setDesde] = useState(inicial.desde);
  const [hasta, setHasta] = useState(inicial.hasta);
  const [motivo, setMotivo] = useState<MotivoCambioHora | null>(null);
  const [cancelarCitas, setCancelarCitas] = useState(true);
  const [avisarCentro, setAvisarCentro] = useState(true);
  const [mensajeEditado, setMensajeEditado] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  const d = normalizarHora(desde);
  const h = normalizarHora(hasta);
  const rango = todoElDia
    ? { desde: aFechaHoraIso(inicial.fecha, '00:00'), hasta: aFechaHoraIso(sumarDias(inicial.fecha, 1), '00:00') }
    : d && h && aMinutos(h) > aMinutos(d) ? { desde: aFechaHoraIso(inicial.fecha, d), hasta: aFechaHoraIso(inicial.fecha, h) } : null;

  const afectadas = rango ? citasEnRango(base.datos.citas, rango.desde, rango.hasta) : [];
  const centros = centrosDeCitas(afectadas);
  const mensaje = mensajeEditado ?? M.bloqueo(primerNombre(usuarioActual?.nombre ?? ''));
  const cancela = cancelarCitas && afectadas.length > 0;

  const puedeGuardar = !!rango && !!motivo && (!cancela || !!mensaje.trim());

  const guardar = async () => {
    if (!rango || !motivo) return;
    const ok = await accion.ejecutar(
      () => bloquearMiHorario({ ...rango, motivo, cancelarCitas: cancela, mensaje: cancela ? mensaje : '', avisarCentro: cancela && avisarCentro && centros.length > 0 }),
      T.error,
    );
    if (ok) {
      setListo(true);
      base.recargar();
    }
  };

  return {
    fecha: inicial.fecha,
    todoElDia, setTodoElDia, desde, setDesde, hasta, setHasta,
    rangoValido: !!rango,
    motivo, setMotivo,
    afectadas, cancelarCitas, setCancelarCitas, cancela,
    centros, avisarCentro, setAvisarCentro,
    mensaje, setMensaje: setMensajeEditado,
    puedeGuardar, guardar, guardando: accion.ocupado, error: accion.error,
    listo,
  };
}
