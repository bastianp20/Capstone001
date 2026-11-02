import { router } from 'expo-router';
import { useState } from 'react';

import { agregarRegistroAtencion, actualizarPesoPaciente } from '@/Api/postInfo';
import { PASO_PESO_KG, TEXTOS_REGISTRO_ATENCION as T } from '@/constants/constants';
import { useVeterinario } from '@/context/VeterinarioContext';
import type { DatosRegistroAtencion } from '@/interfaces';
import { formatFechaChilena, hoy, parsearFechaChilena } from '@/lib/fechas';
import { esErrorDeRed } from '@/lib/red';

import { useAccion } from './useAccion';
import { useBorrador } from './useBorrador';
import { useProgresoAtencion } from './useProgresoAtencion';

/** "Registrar atención": el formulario (guardado como borrador), el peso y el envío con reintento. */
export function useRegistrarAtencion(citaId: number, pesoActual: number | null) {
  const { datos } = useVeterinario();
  const cita = datos?.citas.find((c) => c.id === citaId) ?? null;
  const vacio: DatosRegistroAtencion = { tipo: 'diagnostico', fecha: formatFechaChilena(hoy()), descripcion: '', tratamiento: '', proximaDosis: '', pesoKg: null };
  const b = useBorrador<DatosRegistroAtencion>(`registro-${citaId}`, vacio);
  const { marcar } = useProgresoAtencion(citaId);
  const { ejecutar, ocupado, error, setError } = useAccion();
  const [sinConexion, setSinConexion] = useState(false);

  const peso = b.valor.pesoKg ?? pesoActual;
  const cambiarPeso = (nuevo: number) => b.cambiar({ pesoKg: Math.max(0, Math.round(nuevo / PASO_PESO_KG) * PASO_PESO_KG) });

  const guardar = async () => {
    if (!cita) return;
    const d = b.valor;
    const fecha = parsearFechaChilena(d.fecha);
    const proximaDosis = d.proximaDosis.trim() ? parsearFechaChilena(d.proximaDosis, true) : null;
    if (!d.descripcion.trim()) return setError(T.faltaDescripcion);
    if (!fecha || (d.proximaDosis.trim() && !proximaDosis)) return setError(T.fechaInvalida);

    const ok = await ejecutar(async () => {
      await agregarRegistroAtencion({ citaId, mascotaId: cita.mascotaId, tipo: d.tipo, fecha, descripcion: d.descripcion, tratamiento: d.tratamiento, proximaDosis });
      if (d.pesoKg !== null && d.pesoKg !== pesoActual) await actualizarPesoPaciente(cita.mascotaId, d.pesoKg);
    }, T.error);
    if (!ok) return setSinConexion(true);
    setSinConexion(false);
    marcar({ registro: true });
    await b.limpiar();
    router.back();
  };

  return {
    datos: b.valor,
    cambiar: b.cambiar,
    peso,
    cambiarPeso,
    guardadoEn: b.guardadoEn,
    guardar,
    guardando: ocupado,
    error,
    // El aviso de "Sin conexión" solo aparece si el envío falló por la red
    sinConexion: sinConexion && esErrorDeRed(error),
    esVacuna: b.valor.tipo === 'vacuna',
  };
}
