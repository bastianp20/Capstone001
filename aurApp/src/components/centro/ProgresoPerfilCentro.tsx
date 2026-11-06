import { router } from 'expo-router';

import { TarjetaProgreso } from '@/components/ui/TarjetaProgreso';
import { TEXTOS_PROGRESO_CENTRO as T } from '@/constants/constants';
import { useProgresoPerfilCentro } from '@/hooks/useProgresoPerfilCentro';
import type { NombreIcono, PasoPerfilCentro, ProgresoPerfilCentroProps } from '@/interfaces';

const ICONO: Record<PasoPerfilCentro, NombreIcono> = {
  horario: 'reloj',
  telefono: 'telefono',
  especialidades: 'estetoscopio',
  urgencias: 'alerta',
  equipo: 'equipo',
};

// Dónde se completa cada paso
const RUTA: Record<PasoPerfilCentro, '/centro/horario' | '/centro/editar' | '/centro/especialidades' | '/centro/mi-centro' | '/centro/equipo'> = {
  horario: '/centro/horario',
  telefono: '/centro/editar',
  especialidades: '/centro/especialidades',
  urgencias: '/centro/mi-centro',
  equipo: '/centro/equipo',
};

/** "Completa el perfil del centro" en el Resumen. Desaparece al 100%. */
export function ProgresoPerfilCentro({ centroId }: ProgresoPerfilCentroProps) {
  const p = useProgresoPerfilCentro(centroId);
  if (!p.listo) return null;
  return (
    <TarjetaProgreso
      titulo={T.titulo}
      textoPorcentaje={T.porcentaje(p.porcentaje)}
      porcentaje={p.porcentaje}
      pendientes={p.pendientes.map((paso) => ({ id: paso, texto: T.pasos[paso], icono: ICONO[paso] }))}
      onElegir={(id) => router.navigate(RUTA[id as PasoPerfilCentro])}
    />
  );
}
