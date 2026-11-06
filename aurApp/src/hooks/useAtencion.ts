import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { getFichaPaciente } from '@/Api/getInfo';
import { actualizarMiCita } from '@/Api/postInfo';
import { CONFIRMAR_TERMINAR_SIN_REGISTRO, TEXTOS_ATENCION as T } from '@/constants/constants';
import { useVeterinario } from '@/context/VeterinarioContext';
import { confirmar } from '@/lib/confirmar';
import { descripcionMascota } from '@/lib/formatos';

import { useAccion } from './useAccion';
import { useConsulta } from './useConsulta';
import { useProgresoAtencion } from './useProgresoAtencion';

const MINUTO = 60_000;

/** "Atención en curso": la cita, el paciente, lo que va hecho, los minutos y terminar. */
export function useAtencion(citaId: number) {
  const { datos, recargar } = useVeterinario();
  const cita = datos?.citas.find((c) => c.id === citaId) ?? null;
  const ficha = useConsulta(() => (cita ? getFichaPaciente(cita.mascotaId) : Promise.resolve(null)), [cita?.mascotaId]);
  const { progreso, olvidar } = useProgresoAtencion(citaId);
  const { ejecutar, ocupado, error } = useAccion();

  // Reloj de la consulta: se actualiza cada minuto
  const [ahora, setAhora] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setAhora(Date.now()), MINUTO);
    return () => clearInterval(t);
  }, []);
  const minutos = progreso.inicio ? Math.max(0, Math.floor((ahora - new Date(progreso.inicio).getTime()) / MINUTO)) : 0;

  const terminar = async () => {
    if (!cita) return;
    if (!progreso.registro && !(await confirmar(CONFIRMAR_TERMINAR_SIN_REGISTRO))) return;
    const ok = await ejecutar(() => actualizarMiCita(cita.id, 'completada'), T.errorTerminar);
    if (!ok) return;
    await olvidar();
    await recargar();
    router.back();
  };

  const ir = (ruta: 'registro' | 'receta' | 'derivar') => router.push(`/veterinario/atencion/${citaId}/${ruta}`);

  const m = ficha.datos?.mascota ?? null;
  return {
    cita,
    enCurso: cita?.estado === 'en_curso',
    mascota: m,
    descripcion: m ? descripcionMascota(m) : '',
    dueno: ficha.datos?.dueno ?? cita?.dueno ?? '',
    cargando: !datos || ficha.cargando,
    progreso,
    minutos,
    irARegistro: () => ir('registro'),
    irAReceta: () => ir('receta'),
    irADerivar: () => ir('derivar'),
    terminar,
    terminando: ocupado,
    error,
  };
}
