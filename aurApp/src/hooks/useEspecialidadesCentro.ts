import { useState } from 'react';

import { getEspecialidades } from '@/Api/getInfo';
import { guardarEspecialidadesCentro } from '@/Api/postInfo';
import { useCentro } from '@/context/CentroContext';

import { useAccion } from './useAccion';
import { useConsulta } from './useConsulta';

/** Mi centro → "Especialidades del centro": marcar varias y guardar. */
export function useEspecialidadesCentro() {
  const c = useCentro();
  const detalle = c.datos?.detalle ?? null;
  const catalogo = useConsulta(getEspecialidades, []);
  // null = sin cambios (las guardadas)
  const [editadas, setEditadas] = useState<number[] | null>(null);
  const [guardado, setGuardado] = useState(false);
  const { ejecutar, ocupado, error } = useAccion();

  const seleccion = editadas ?? detalle?.especialidadIds ?? [];
  const especialidades = catalogo.datos ?? [];

  const alternar = (id: number) => {
    setEditadas(seleccion.includes(id) ? seleccion.filter((x) => x !== id) : [...seleccion, id]);
    setGuardado(false);
  };

  const guardar = async () => {
    if (!detalle) return;
    if (await ejecutar(() => guardarEspecialidadesCentro(detalle.id, seleccion), 'No se pudieron guardar las especialidades.')) {
      setEditadas(null);
      setGuardado(true);
      c.recargar();
    }
  };

  return {
    cargando: catalogo.cargando || (c.cargando && !detalle),
    especialidades, seleccion, alternar,
    guardar, guardando: ocupado, error, guardado,
  };
}
