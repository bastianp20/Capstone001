import { useMemo, useState } from 'react';

import { getEspecialidades, getProfesionalesParaCita } from '@/Api/getInfo';
import { cumpleEspecialidades, especialidadesFiltrables } from '@/lib/especialidades';

import { useConsulta } from './useConsulta';

// "¿Qué necesita tu mascota?": especialidades marcadas → solo quienes las tienen TODAS.
// Sin nada marcado se ve todo (igual que en la web).
export function useFiltroEspecialidadesCita() {
  const catalogo = useConsulta(getEspecialidades, []);
  const consulta = useConsulta(getProfesionalesParaCita, []);
  const [seleccion, setSeleccion] = useState<number[]>([]);

  const especialidades = useMemo(() => especialidadesFiltrables(catalogo.datos ?? []), [catalogo.datos]);
  const queCumplen = useMemo(() => (consulta.datos ?? []).filter((p) => cumpleEspecialidades(p, seleccion)), [consulta.datos, seleccion]);

  return {
    especialidades,
    seleccion,
    alternar: (id: number) => setSeleccion((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    quitar: () => setSeleccion([]),
    queCumplen,
    /** Nombres de las marcadas, en el orden del catálogo ("Dermatología", "Cardiología"). */
    nombresElegidos: especialidades.filter((e) => seleccion.includes(e.id)).map((e) => e.nombre),
    cargando: consulta.cargando,
    error: !!consulta.error,
    recargar: consulta.recargar,
  };
}
