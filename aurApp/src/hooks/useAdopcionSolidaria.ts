import { useMemo, useState } from 'react';

import { getAnimalesParaVeterinarios, getMisAtencionesAdopcion, getResumenSolidario } from '@/Api/getInfo';
import { PESTANAS_SOLIDARIA, TEXTOS_SOLIDARIA as T } from '@/constants/constants';
import type { PestanaSolidaria } from '@/interfaces';
import { FILTROS_PESTANA_SOLIDARIA, esperaAtencion, masUrgentes } from '@/lib/solidaria';

import { useCargaDatos } from './useCargaDatos';
import { useRecargarAlVolver } from './useRecargarAlVolver';

const cargarSolidaria = async () => {
  const [animales, resumen, atenciones] = await Promise.all([getAnimalesParaVeterinarios(), getResumenSolidario(), getMisAtencionesAdopcion()]);
  return { animales, resumen, atenciones };
};

/** Adopción solidaria (versión liviana de la web): impacto, más urgentes y las tres pestañas. */
export function useAdopcionSolidaria(pestanaInicial: PestanaSolidaria = 'esperando') {
  const carga = useCargaDatos(cargarSolidaria, []);
  useRecargarAlVolver(carga.recargar); // al volver de registrar, el animal pasa a "atendido"
  const [pestana, setPestana] = useState<PestanaSolidaria>(pestanaInicial);

  const animales = useMemo(() => carga.datos?.animales ?? [], [carga.datos]);
  const atenciones = carga.datos?.atenciones ?? [];
  const esperando = animales.filter(esperaAtencion).length;

  const opciones = PESTANAS_SOLIDARIA.map((o) => ({
    valor: o.valor,
    texto: o.valor === 'esperando' ? T.pestanaConCantidad(o.texto, esperando) : o.texto,
  }));

  return {
    cargando: carga.cargando,
    error: carga.error,
    recargar: carga.recargar,
    recargando: carga.recargando,
    resumen: carga.datos?.resumen ?? null,
    urgentes: useMemo(() => masUrgentes(animales), [animales]),
    pestana,
    setPestana,
    opciones,
    animales: pestana === 'mias' ? [] : animales.filter(FILTROS_PESTANA_SOLIDARIA[pestana]),
    atenciones,
  };
}
