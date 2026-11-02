import { useState } from 'react';

import { getMiSolicitudEliminacion } from '@/Api/getInfo';
import { cancelarSolicitudEliminacion, solicitarEliminacionCuenta } from '@/Api/postInfo';
import { useAuth } from '@/Auth/AuthContext';
import { CONFIRMAR_CANCELAR_ELIMINACION, TEXTOS_ELIMINAR_CUENTA as T } from '@/constants/constants';
import { confirmar } from '@/lib/confirmar';

import { useAccion } from './useAccion';
import { useConsulta } from './useConsulta';

// "Eliminar mi cuenta": el formulario (motivos, comentario, "entiendo") o, si ya
// la pidió, la solicitud en revisión con la opción de cancelarla (migraciones 32 y 49).
export function useEliminarCuenta() {
  const { usuarioActual } = useAuth();
  const perfilId = usuarioActual?.id ?? '';
  const consulta = useConsulta(() => getMiSolicitudEliminacion(perfilId), [perfilId]);
  const [motivos, setMotivos] = useState<string[]>([]);
  const [comentario, setComentario] = useState('');
  const [entiende, setEntiende] = useState(false);
  const { ejecutar, ocupado, error } = useAccion();

  const solicitud = consulta.datos ?? null;
  const pendiente = solicitud?.estado === 'pendiente' ? solicitud : null;

  const alternarMotivo = (m: string) => setMotivos((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  const enviar = async () => {
    const motivo = [motivos.join(', '), comentario.trim()].filter(Boolean).join(' · ');
    if (await ejecutar(() => solicitarEliminacionCuenta(motivo), T.error)) consulta.recargar();
  };

  const cancelar = async () => {
    if (!(await confirmar(CONFIRMAR_CANCELAR_ELIMINACION))) return;
    if (await ejecutar(cancelarSolicitudEliminacion, T.errorCancelar)) {
      setEntiende(false);
      consulta.recargar();
    }
  };

  return {
    cargando: consulta.cargando,
    correo: usuarioActual?.email ?? '',
    pendiente,
    rechazoAnterior: solicitud?.estado === 'rechazada' ? (solicitud.respuesta ?? '') : null,
    motivos,
    alternarMotivo,
    comentario,
    setComentario,
    entiende,
    setEntiende,
    enviar,
    cancelar,
    ocupado,
    error,
  };
}
