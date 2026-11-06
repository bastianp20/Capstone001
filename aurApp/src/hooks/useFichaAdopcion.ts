import { useCallback } from 'react';
import { Share } from 'react-native';

import { getDetalleAdopcion } from '@/Api/getInfo';
import { TEXTOS_FICHA_ADOPCION as T, URL_WEB_AURAPET, rutaWebFichaAdopcion } from '@/constants/constants';
import { estadoBotonAdoptar } from '@/lib/adopcion';

import { useConsulta } from './useConsulta';
import { useGuardadosAdopcion } from './useGuardadosAdopcion';
import { useRecargarAlVolver } from './useRecargarAlVolver';

/** Ficha de un animal en adopción: datos, guardar, compartir y qué muestra el botón de adoptar. */
export function useFichaAdopcion(id: number) {
  const { datos: ficha, cargando, error, recargar } = useConsulta(() => getDetalleAdopcion(id), [id]);
  useRecargarAlVolver(recargar); // al volver de postular, el botón pasa a "Ya postulaste"
  const { estaGuardado, alternar } = useGuardadosAdopcion();

  const compartir = useCallback(() => {
    if (!ficha) return;
    Share.share({ message: T.compartirTexto(ficha.nombre, `${URL_WEB_AURAPET}${rutaWebFichaAdopcion(ficha.id)}`) }).catch(() => undefined);
  }, [ficha]);

  return {
    ficha: ficha ?? null,
    cargando,
    error,
    recargar,
    estadoBoton: ficha ? estadoBotonAdoptar(ficha) : 'disponible',
    guardado: estaGuardado(id),
    alternarGuardado: () => alternar(id),
    compartir,
  };
}
