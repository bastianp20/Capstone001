import { useState } from 'react';

import { getDetalleAdopcion } from '@/Api/getInfo';
import { postularAdopcion } from '@/Api/postInfo';
import { DATOS_POSTULACION_VACIOS, PASOS_POSTULACION, TEXTOS_POSTULACION as T } from '@/constants/constants';
import type { PasoPostulacion } from '@/interfaces';
import { validarPasoPostulacion } from '@/lib/validacionAdopcion';

import { useAccion } from './useAccion';
import { useConsulta } from './useConsulta';
import { useFormularioPasos } from './useFormularioPasos';

/** "Quiero adoptarlo" en 4 pasos: hogar, familia, experiencia y confirmación. */
export function usePostularAdopcion(adopcionId: number) {
  const formulario = useFormularioPasos(DATOS_POSTULACION_VACIOS, PASOS_POSTULACION.length, (d, paso) =>
    validarPasoPostulacion(d, paso as PasoPostulacion),
  );
  const { ejecutar, ocupado, error, limpiarError } = useAccion();
  const [enviada, setEnviada] = useState(false);
  const { datos: ficha } = useConsulta(() => getDetalleAdopcion(adopcionId), [adopcionId]);

  const enviar = async () => {
    if (!formulario.validar()) return;
    const ok = await ejecutar(() => postularAdopcion(adopcionId, formulario.datos), T.error);
    if (ok) setEnviada(true);
  };

  return {
    ...formulario,
    continuar: () => {
      limpiarError();
      formulario.continuar();
    },
    nombreAnimal: ficha?.nombre ?? '',
    sexoAnimal: ficha?.sexo ?? 'macho',
    quienPublica: ficha?.publicador.nombre ?? '',
    enviar,
    enviando: ocupado,
    error,
    enviada,
  };
}
