import { useState } from 'react';

import { cancelarCitaVeterinario, reagendarCitaVeterinario } from '@/Api/postInfo';
import { useAuth } from '@/Auth/AuthContext';
import { MENSAJE_SUGERIDO_CAMBIO as M, TEXTOS_CAMBIO_HORA as T } from '@/constants/constants';
import type { AccionCambioCita, HoraLibre, MotivoCambioHora } from '@/interfaces';
import { citaModificable, horasLibres } from '@/lib/agendaSemana';
import { centrosDeCitas, fechaManualAIso } from '@/lib/cambioHora';
import { formatFechaHoraCita } from '@/lib/fechas';
import { primerNombre } from '@/lib/texto';

import { useAccion } from './useAccion';
import { useDatosAgendaVeterinario } from './useDatosAgendaVeterinario';

/** "Modificar cita": reagendar (a una hora libre o escrita a mano) o cancelar, avisando al dueño y, si se quiere, al centro. */
export function useModificarCita(citaId: number) {
  const { usuarioActual } = useAuth();
  const base = useDatosAgendaVeterinario();
  const accion = useAccion();

  const [tipo, setTipo] = useState<AccionCambioCita>('reagendar');
  const [elegida, setElegida] = useState<HoraLibre | null>(null);
  const [manual, setManual] = useState(false);
  const [dia, setDia] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState<MotivoCambioHora | null>(null);
  const [detalle, setDetalle] = useState('');
  const [avisarCentro, setAvisarCentro] = useState(true);
  // null = el mensaje sugerido (se actualiza solo); texto = lo que escribió el veterinario
  const [mensajeEditado, setMensajeEditado] = useState<string | null>(null);
  const [destinos, setDestinos] = useState<string[] | null>(null);

  const cita = base.datos.citas.find((c) => c.id === citaId) ?? null;
  const libres = horasLibres(base.datos);
  const centros = cita ? centrosDeCitas([cita]) : [];
  const nuevaFecha = manual ? fechaManualAIso(dia, hora) : elegida?.inicio ?? null;
  const vet = primerNombre(usuarioActual?.nombre ?? '');

  const sugerido = () => {
    if (!cita) return '';
    const dueno = primerNombre(cita.dueno);
    const antes = formatFechaHoraCita(cita.fechaHora);
    return tipo === 'reagendar'
      ? M.reagendar(dueno, vet, cita.mascota, antes, nuevaFecha ? formatFechaHoraCita(nuevaFecha) : T.horaPorElegir)
      : M.cancelar(dueno, vet, cita.mascota, antes);
  };
  const mensaje = mensajeEditado ?? sugerido();

  const cambiarTipo = (t: AccionCambioCita) => {
    setTipo(t);
    setMensajeEditado(null);
    accion.limpiarError();
  };

  const errorDia = manual && dia.trim().length >= 10 && !fechaManualAIso(dia, hora || '00:00') ? T.diaInvalido : '';
  const puedeGuardar = !!cita && citaModificable(cita) && !!mensaje.trim() && (tipo === 'reagendar' ? !!nuevaFecha : !!motivo);

  const guardar = async () => {
    if (!cita || !puedeGuardar) return;
    const avisa = avisarCentro && centros.length > 0;
    const ok = await accion.ejecutar(
      () => tipo === 'reagendar'
        ? reagendarCitaVeterinario({ citaId: cita.id, nuevaFecha: nuevaFecha as string, mensaje, avisarCentro: avisa })
        : cancelarCitaVeterinario({ citaId: cita.id, motivo: [motivo, detalle.trim()].filter(Boolean).join(' · '), mensaje, avisarCentro: avisa }),
      T.error,
    );
    if (ok) {
      setDestinos([primerNombre(cita.dueno), ...(avisa ? centros : [])]);
      base.recargar();
    }
  };

  return {
    cargando: base.cargando && !cita,
    cita,
    modificable: !!cita && citaModificable(cita),
    tipo, cambiarTipo,
    libres, elegida, elegir: setElegida,
    manual, setManual,
    dia, setDia, hora, setHora, errorDia,
    nuevaFecha,
    motivo, setMotivo, detalle, setDetalle,
    centros, avisarCentro, setAvisarCentro,
    mensaje, setMensaje: setMensajeEditado,
    puedeGuardar, guardar, guardando: accion.ocupado, error: accion.error,
    destinos,
  };
}
