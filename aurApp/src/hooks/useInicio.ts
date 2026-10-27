import { useMemo, useState } from 'react';

import { useAuth } from '@/Auth/AuthContext';
import { useDatosDueno } from '@/context/DatosDuenoContext';
import { resumirMascota } from '@/lib/resumenMascota';
import { nombrePropio, primerNombre } from '@/lib/texto';

/** Estado de la pantalla de inicio: la mascota elegida y su resumen, con datos reales. */
export function useInicio() {
  const { usuarioActual } = useAuth();
  const { mascotas, citas, registros, cargando, error, recargar, recargando } = useDatosDueno();
  const [idSeleccionada, setIdSeleccionada] = useState<number | null>(null);

  // Si la elegida ya no existe (o no se ha elegido), se muestra la primera.
  const mascota = mascotas.find((m) => m.id === idSeleccionada) ?? mascotas[0] ?? null;

  const resumen = useMemo(() => (mascota ? resumirMascota(mascota, citas, registros) : null), [mascota, citas, registros]);

  return {
    nombreUsuario: primerNombre(usuarioActual?.nombre ?? ''),
    nombreCompleto: nombrePropio(usuarioActual?.nombre ?? ''),
    mascotas,
    mascota,
    resumen,
    seleccionarMascota: setIdSeleccionada,
    cargando,
    error,
    recargar,
    recargando,
  };
}
