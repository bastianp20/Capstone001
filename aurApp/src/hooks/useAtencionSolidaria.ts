import { useState } from 'react';

import { getDetalleAdopcion, getMisCentrosAtencion, getResumenSolidario } from '@/Api/getInfo';
import { registrarAtencionAdopcion } from '@/Api/postInfo';
import {
  DATOS_ATENCION_SOLIDARIA_VACIOS,
  MIN_RESUMEN_ATENCION_SOLIDARIA,
  PASO_PESO_KG,
  PREFIJO_BORRADOR_SOLIDARIA,
  TEXTOS_ATENCION_SOLIDARIA as T,
} from '@/constants/constants';
import type { AtencionGuardada, DatosAtencionSolidaria, ProcedimientoFicha } from '@/interfaces';
import { redondearAlPaso } from '@/lib/formatos';
import { esErrorDeRed } from '@/lib/red';

import { useAccion } from './useAccion';
import { useBorrador } from './useBorrador';
import { useConsulta } from './useConsulta';

const cargarFicha = async (adopcionId: number) => {
  const [ficha, centros] = await Promise.all([getDetalleAdopcion(adopcionId), getMisCentrosAtencion()]);
  return { ficha, centros };
};

/**
 * "Registrar atención" de un animal en adopción: el formulario se guarda como borrador en el teléfono
 * (sirve en terreno, sin señal) y, al guardar bien, muestra la confirmación con el sello.
 */
export function useAtencionSolidaria(adopcionId: number) {
  const consulta = useConsulta(() => cargarFicha(adopcionId), [adopcionId]);
  const ficha = consulta.datos?.ficha ?? null;
  const b = useBorrador<DatosAtencionSolidaria>(PREFIJO_BORRADOR_SOLIDARIA + adopcionId, DATOS_ATENCION_SOLIDARIA_VACIOS);
  const { ejecutar, ocupado, error, setError, limpiarError } = useAccion();
  const [sinConexion, setSinConexion] = useState(false);
  const [guardada, setGuardada] = useState<AtencionGuardada | null>(null);

  // Lo que ya está en su ficha cuenta como marcado (la base nunca lo desmarca)
  const yaEnFicha: Record<ProcedimientoFicha, boolean> = {
    vacunas: !!ficha?.vacunasAlDia,
    esterilizacion: !!ficha?.esterilizado,
    microchip: !!ficha?.conMicrochip,
    desparasitacion: false,
  };

  const alternarProcedimiento = (p: ProcedimientoFicha, marcado: boolean) =>
    b.cambiar((d) => ({ ...d, procedimientos: marcado ? [...new Set([...d.procedimientos, p])] : d.procedimientos.filter((x) => x !== p) }));

  const guardar = async () => {
    const d = b.valor;
    if (!d.estadoGeneral) return setError(T.faltaEstado);
    if (d.resumen.trim().length < MIN_RESUMEN_ATENCION_SOLIDARIA) return setError(T.faltaResumen);
    let solidarias = 0;
    const ok = await ejecutar(async () => {
      await registrarAtencionAdopcion(adopcionId, d);
      solidarias = (await getResumenSolidario().catch(() => null))?.solidarias ?? 0;
    }, T.error);
    if (!ok) return setSinConexion(true);
    setSinConexion(false);
    await b.limpiar();
    setGuardada({ nombreAnimal: ficha?.nombre ?? '', fotoUrl: ficha?.fotoUrl ?? null, solidario: d.solidario, solidarias });
  };

  return {
    cargando: consulta.cargando,
    errorCarga: consulta.error,
    recargar: consulta.recargar,
    ficha,
    centros: consulta.datos?.centros ?? [],
    datos: b.valor,
    cambiar: (cambio: Partial<DatosAtencionSolidaria>) => {
      limpiarError();
      b.cambiar(cambio);
    },
    yaEnFicha,
    alternarProcedimiento,
    peso: b.valor.pesoKg ?? ficha?.pesoKg ?? null,
    cambiarPeso: (nuevo: number) => b.cambiar({ pesoKg: Math.max(0, redondearAlPaso(nuevo, PASO_PESO_KG)) }),
    guardadoEn: b.guardadoEn,
    guardar,
    guardando: ocupado,
    error,
    sinConexion: sinConexion && esErrorDeRed(error),
    guardada,
  };
}
