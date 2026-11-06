import { router } from 'expo-router';

import { TarjetaProgreso } from '@/components/ui/TarjetaProgreso';
import { TEXTOS_PROGRESO_PERFIL as T } from '@/constants/constants';
import { useProgresoPerfilVeterinario } from '@/hooks/useProgresoPerfilVeterinario';
import type { NombreIcono, PasoPerfilVeterinario } from '@/interfaces';

const ICONO: Record<PasoPerfilVeterinario, NombreIcono> = {
  foto: 'camara',
  telefono: 'telefono',
  especialidades: 'estetoscopio',
  colegiado: 'escudo',
  horario: 'reloj',
  zona: 'ubicacion',
};

// Dónde se completa cada paso
const RUTA: Record<PasoPerfilVeterinario, '/cuenta/datos' | '/veterinario/especialidades' | '/veterinario/horario'> = {
  foto: '/cuenta/datos',
  telefono: '/cuenta/datos',
  especialidades: '/veterinario/especialidades',
  colegiado: '/veterinario/horario',
  horario: '/veterinario/horario',
  zona: '/veterinario/horario',
};

/** "Completa tu perfil" en Hoy. Desaparece al 100%. */
export function ProgresoPerfilVeterinario() {
  const p = useProgresoPerfilVeterinario();
  if (!p.listo) return null;
  return (
    <TarjetaProgreso
      titulo={T.titulo}
      textoPorcentaje={T.porcentaje(p.porcentaje)}
      porcentaje={p.porcentaje}
      pendientes={p.pendientes.map((paso) => ({ id: paso, texto: T.pasos[paso], icono: ICONO[paso] }))}
      onElegir={(id) => router.push(RUTA[id as PasoPerfilVeterinario])}
    />
  );
}
