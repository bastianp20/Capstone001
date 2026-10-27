import { useMemo } from 'react';
import { Linking } from 'react-native';

import { getFichaPaciente } from '@/Api/getInfo';
import { agruparPorMes } from '@/lib/historial';
import { descripcionMascota } from '@/lib/formatos';
import { itemsDesdeFicha } from '@/lib/veterinario';

import { useConsulta } from './useConsulta';
import { useDescargaFicha } from './useDescargaFicha';

/** Ficha de un paciente para el veterinario: datos, dueño, historial y PDF. */
export function useFichaPaciente(mascotaId: number) {
  const { datos: ficha, cargando, error, recargar } = useConsulta(() => getFichaPaciente(mascotaId), [mascotaId]);
  const pdf = useDescargaFicha();

  const grupos = useMemo(
    () => (ficha ? agruparPorMes(itemsDesdeFicha(ficha.historial, ficha.mascota.nombre, ficha.mascota.id)) : []),
    [ficha],
  );

  const llamar = () => ficha?.telefonoDueno && Linking.openURL(`tel:+${ficha.telefonoDueno}`);

  return {
    ficha,
    descripcion: ficha ? descripcionMascota(ficha.mascota) : '',
    grupos,
    llamar,
    descargarPdf: () => pdf.descargar(mascotaId),
    generandoPdf: pdf.generando,
    errorPdf: pdf.error,
    cargando,
    error,
    recargar,
  };
}
