import { useEffect, useMemo, useState } from 'react';

import { getEspecialidades, getMisEspecialidades } from '@/Api/getInfo';
import { guardarMisEspecialidades } from '@/Api/postInfo';
import { TEXTOS_MIS_ESPECIALIDADES as T } from '@/constants/constants';
import { especialidadesFiltrables } from '@/lib/especialidades';

import { useAccion } from './useAccion';
import { useConsulta } from './useConsulta';

/** "Mis especialidades" del veterinario: marcar varias (sin límite), "Otra" y guardar. */
export function useMisEspecialidadesVeterinario() {
  const catalogo = useConsulta(getEspecialidades, []);
  const mias = useConsulta(getMisEspecialidades, []);
  const [seleccion, setSeleccion] = useState<number[]>([]);
  const [otra, setOtra] = useState('');
  const [guardado, setGuardado] = useState(false);
  const { ejecutar, ocupado, error } = useAccion();

  // Cuando llegan las guardadas, parten marcadas
  useEffect(() => {
    if (!mias.datos) return;
    setSeleccion(mias.datos.ids);
    setOtra(mias.datos.otra);
  }, [mias.datos]);

  const especialidades = useMemo(() => especialidadesFiltrables(catalogo.datos ?? []), [catalogo.datos]);
  const marcadas = seleccion.filter((id) => especialidades.some((e) => e.id === id));

  return {
    especialidades,
    seleccion,
    alternar: (id: number) => {
      setGuardado(false);
      setSeleccion((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    },
    otra,
    setOtra: (texto: string) => {
      setGuardado(false);
      setOtra(texto);
    },
    cantidad: marcadas.length,
    guardar: async () => {
      if (await ejecutar(() => guardarMisEspecialidades(marcadas, otra), T.error)) setGuardado(true);
    },
    guardando: ocupado,
    guardado,
    error,
    cargando: catalogo.cargando || mias.cargando,
  };
}
