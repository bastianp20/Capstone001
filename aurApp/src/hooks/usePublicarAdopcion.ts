import { useState } from 'react';

import { getMisRefugios } from '@/Api/getInfo';
import { publicarAdopcion } from '@/Api/postInfo';
import { useAuth } from '@/Auth/AuthContext';
import { DATOS_PUBLICAR_VACIOS, MAX_PERSONALIDAD_ADOPCION, PASOS_PUBLICAR, TEXTOS_PUBLICAR as T } from '@/constants/constants';
import type { FotoNuevaAdopcion, PasoPublicar } from '@/interfaces';
import { validarPasoPublicar } from '@/lib/validacionAdopcion';

import { useAccion } from './useAccion';
import { useConsulta } from './useConsulta';
import { useFormularioPasos } from './useFormularioPasos';
import { useFotosAdopcion } from './useFotosAdopcion';

/**
 * "Dar en adopción" en 4 pasos, con fotos de la cámara o la galería.
 * refugioInicial: desde "Mi refugio" ya viene elegido publicar a nombre del refugio.
 */
export function usePublicarAdopcion(refugioInicial: number | null = null) {
  const { usuarioActual } = useAuth();
  const formulario = useFormularioPasos({ ...DATOS_PUBLICAR_VACIOS, refugioId: refugioInicial }, PASOS_PUBLICAR.length, (d, paso) => validarPasoPublicar(d, paso as PasoPublicar));
  const { datos, cambiar } = formulario;
  const { ejecutar, ocupado, error, setError, limpiarError } = useAccion();
  const [publicadaId, setPublicadaId] = useState<number | null>(null);
  const { datos: misRefugios = [] } = useConsulta(() => getMisRefugios(), []);

  const fotos = useFotosAdopcion(
    datos.fotos.length,
    (foto: FotoNuevaAdopcion) => {
      limpiarError();
      cambiar('fotos', [...datos.fotos, foto]);
    },
    setError,
  );

  const publicar = async () => {
    if (!usuarioActual) return;
    await ejecutar(async () => setPublicadaId(await publicarAdopcion(usuarioActual.id, datos)), T.error);
  };

  return {
    ...formulario,
    continuar: () => {
      limpiarError();
      formulario.continuar();
    },
    volver: () => {
      limpiarError();
      formulario.volver();
    },
    quitarFoto: (indice: number) => cambiar('fotos', datos.fotos.filter((_, i) => i !== indice)),
    alternarPersonalidad: (rasgo: string) => {
      const marcado = datos.personalidad.includes(rasgo);
      if (!marcado && datos.personalidad.length >= MAX_PERSONALIDAD_ADOPCION) return setError(T.errores.maxPersonalidad);
      limpiarError();
      cambiar('personalidad', marcado ? datos.personalidad.filter((r) => r !== rasgo) : [...datos.personalidad, rasgo]);
    },
    fotos,
    misRefugios,
    nombreRefugio: misRefugios.find((r) => r.id === datos.refugioId)?.nombre ?? null,
    publicar,
    publicando: ocupado,
    error,
    publicadaId,
  };
}
