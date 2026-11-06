import { useMemo, useState } from 'react';

import { getDetalleAdopcion, getPostulacionesAdopcion } from '@/Api/getInfo';
import { concretarAdopcion, responderPostulacion } from '@/Api/postInfo';
import { TEXTOS_CONCRETAR, TEXTOS_POSTULANTES as T } from '@/constants/constants';
import type { ContactoPersona, PostulanteConAfinidad } from '@/interfaces';
import { calcularAfinidad } from '@/lib/afinidadAdopcion';
import { confirmar } from '@/lib/confirmar';

import { useAccion } from './useAccion';
import { useCargaDatos } from './useCargaDatos';

const cargarPostulantes = async (adopcionId: number) => {
  const [ficha, postulaciones] = await Promise.all([getDetalleAdopcion(adopcionId), getPostulacionesAdopcion(adopcionId)]);
  return { ficha, postulaciones };
};

/**
 * Elegir familia (versión liviana de la web): postulantes ordenados por afinidad,
 * elegir o rechazar, contactar y marcar como adoptado (con testimonio y traspaso de ficha).
 */
export function usePostulantesAdopcion(adopcionId: number) {
  const carga = useCargaDatos(() => cargarPostulantes(adopcionId), [adopcionId]);
  const ficha = carga.datos?.ficha ?? null;
  const { ejecutar, ocupado, error, limpiarError } = useAccion();

  const [abiertoId, setAbiertoId] = useState<number | null>(null);
  const [contacto, setContacto] = useState<ContactoPersona | null>(null);
  const [concretando, setConcretando] = useState(false);
  const [testimonio, setTestimonio] = useState('');
  const [traspasar, setTraspasar] = useState(true);

  // Primero la elegida, después las pendientes por afinidad, al final las rechazadas
  const postulantes = useMemo<PostulanteConAfinidad[]>(() => {
    if (!ficha) return [];
    const orden = { aceptada: 0, pendiente: 1, rechazada: 2, retirada: 3 };
    return (carga.datos?.postulaciones ?? [])
      .map((postulacion) => ({ postulacion, afinidad: calcularAfinidad(ficha, postulacion) }))
      .sort((a, b) => orden[a.postulacion.estado] - orden[b.postulacion.estado] || b.afinidad.porcentaje - a.afinidad.porcentaje);
  }, [ficha, carga.datos]);

  const abierto = postulantes.find((p) => p.postulacion.id === abiertoId) ?? null;
  const disponible = !!ficha && !ficha.enProceso && !ficha.adoptado;
  const nombreAnimal = ficha?.nombre ?? '';

  const responder = async (aceptar: boolean) => {
    if (!abierto) return;
    if (!aceptar) {
      const seguro = await confirmar({ titulo: T.rechazar, mensaje: T.confirmarRechazo(abierto.postulacion.nombre), textoSi: T.rechazar, textoNo: T.cancelar });
      if (!seguro) return;
    }
    const ok = await ejecutar(() => responderPostulacion(abierto.postulacion.id, aceptar), T.errorAccion);
    if (ok) {
      setAbiertoId(null);
      carga.recargar();
    }
  };

  const confirmarAdopcion = async () => {
    if (!abierto) return;
    const ok = await ejecutar(() => concretarAdopcion(adopcionId, abierto.postulacion.id, testimonio, traspasar), TEXTOS_CONCRETAR.error);
    if (ok) {
      setConcretando(false);
      setAbiertoId(null);
      carga.recargar();
    }
  };

  return {
    cargando: carga.cargando,
    errorCarga: carga.error,
    recargar: carga.recargar,
    recargando: carga.recargando,
    ficha,
    nombreAnimal,
    postulantes,
    abierto,
    /** La hoja de la persona se esconde mientras se contacta o se confirma la adopción (una hoja a la vez). */
    hojaPostulante: abierto && !contacto && !concretando ? abierto : null,
    abrir: (id: number) => {
      limpiarError();
      setAbiertoId(id);
    },
    cerrar: () => !ocupado && setAbiertoId(null),
    puedeElegir: disponible && abierto?.postulacion.estado === 'pendiente',
    puedeConcretar: !!ficha?.enProceso && abierto?.postulacion.estado === 'aceptada',
    elegir: () => responder(true),
    rechazar: () => responder(false),
    ocupado,
    error,
    // Contactar
    contacto,
    contactar: () =>
      abierto &&
      setContacto({
        nombre: abierto.postulacion.nombre,
        telefono: abierto.postulacion.telefono,
        correo: abierto.postulacion.correo,
        mensajeWhatsapp: T.whatsappTexto(nombreAnimal),
        asuntoCorreo: T.correoAsunto(nombreAnimal),
      }),
    cerrarContacto: () => setContacto(null),
    // ¡Adoptado!
    concretando,
    abrirConcretar: () => {
      limpiarError();
      setConcretando(true);
    },
    cerrarConcretar: () => !ocupado && setConcretando(false),
    testimonio,
    setTestimonio,
    traspasar,
    setTraspasar,
    confirmarAdopcion,
  };
}
