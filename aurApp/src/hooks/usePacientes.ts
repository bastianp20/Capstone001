import { useMemo } from 'react';

import { FILTROS_PACIENTES } from '@/constants/constants';
import { useVeterinario } from '@/context/VeterinarioContext';
import type { FiltroPacientes, PacienteVeterinario } from '@/interfaces';
import { camposBusquedaPaciente, FILTROS_PACIENTE } from '@/lib/veterinario';

import { useFiltro } from './useFiltro';

export function usePacientes() {
  const { datos, cargando, error, recargar, recargando } = useVeterinario();
  const pacientes = useMemo(() => datos?.pacientes ?? [], [datos]);
  const f = useFiltro<PacienteVeterinario, FiltroPacientes>({
    items: pacientes,
    camposBusqueda: camposBusquedaPaciente,
    filtros: FILTROS_PACIENTE,
    filtroInicial: 'todos',
  });
  return {
    ...f,
    opciones: FILTROS_PACIENTES.map((o) => ({ ...o, cantidad: f.cantidad(o.valor) })),
    hayPacientes: pacientes.length > 0,
    cargando,
    error,
    recargar,
    recargando,
  };
}
