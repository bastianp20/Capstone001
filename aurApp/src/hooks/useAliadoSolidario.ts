import { useState } from 'react';

import { getAnimalesParaVeterinarios, getResumenSolidario } from '@/Api/getInfo';
import { cambiarAliadoSolidario } from '@/Api/postInfo';
import { TEXTOS_ALIADO_SOLIDARIO as T } from '@/constants/constants';
import { esperaAtencion } from '@/lib/solidaria';

import { useAccion } from './useAccion';
import { useConsulta } from './useConsulta';
import { useRecargarAlVolver } from './useRecargarAlVolver';

const cargarAliado = async () => {
  const [resumen, animales] = await Promise.all([getResumenSolidario(), getAnimalesParaVeterinarios()]);
  return { resumen, esperando: animales.filter(esperaAtencion).length };
};

/** Perfil del veterinario: el interruptor "Aliado solidario", sus atenciones gratis y cuántos esperan. */
export function useAliadoSolidario() {
  const { datos, recargar } = useConsulta(cargarAliado, []);
  useRecargarAlVolver(recargar);
  const [activoLocal, setActivoLocal] = useState<boolean | null>(null);
  const { ejecutar, ocupado, error } = useAccion();

  const cambiar = async (activo: boolean) => {
    setActivoLocal(activo); // se ve al tiro; si falla, vuelve a lo que dice la base
    const ok = await ejecutar(() => cambiarAliadoSolidario(activo), T.error);
    if (!ok) setActivoLocal(null);
  };

  return {
    listo: !!datos,
    activo: activoLocal ?? datos?.resumen.aliado ?? false,
    solidarias: datos?.resumen.solidarias ?? 0,
    esperando: datos?.esperando ?? 0,
    cambiar,
    ocupado,
    error,
  };
}
