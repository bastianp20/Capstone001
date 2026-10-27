import {
  CAMPOS_FICHA_MASCOTA,
  DIAS_AVISO_VACUNA,
  MESES_CONTROL_RECOMENDADO,
  TEXTOS_INICIO,
} from '@/constants/constants';
import type { CitaDueno, Mascota, Recordatorio, RegistroMedico, ResumenMascota } from '@/interfaces';

import { diasEntre, hoy, sumarDias, tiempoDesde, tiempoHasta } from './fechas';
import { descripcionMascota } from './formatos';

// Todo lo que muestra el inicio sobre una mascota, calculado desde sus datos reales.

const CAMPOS_SIEMPRE_LLENOS = 3; // nombre, especie y sexo son obligatorios

/** % de la ficha completa y qué falta (para invitar a completarla). */
const resumirFicha = (m: Mascota) => {
  const faltan = CAMPOS_FICHA_MASCOTA.filter(({ campo }) => {
    const valor = m[campo];
    return valor === null || valor === '';
  }).map(({ texto }) => texto);
  const total = CAMPOS_SIEMPRE_LLENOS + CAMPOS_FICHA_MASCOTA.length;
  const porcentaje = Math.round(((total - faltan.length) / total) * 100);
  return {
    fichaPorcentaje: porcentaje,
    fichaResumen: faltan.length ? TEXTOS_INICIO.fichaFalta(faltan.slice(0, 2)) : TEXTOS_INICIO.fichaCompleta,
  };
};

/** La cita activa más cercana (pendiente o confirmada, desde ahora). */
const proximaCitaDe = (mascotaId: number, citas: CitaDueno[]): CitaDueno | null => {
  const ahora = Date.now();
  return (
    citas
      .filter((c) => c.mascotaId === mascotaId && c.puedeCancelar && new Date(c.fechaHora).getTime() >= ahora)
      .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora))[0] ?? null
  );
};

/** Vacunas: según la próxima dosis de la última vacuna registrada. */
const recordatorioVacunas = (registros: RegistroMedico[]): Recordatorio => {
  const base = { id: 'vacunas', titulo: 'Vacunas', icono: 'jeringa', tono: 'lavanda' } as const;
  const ultima = registros.find((r) => r.tipo === 'vacuna'); // vienen ordenados del más nuevo al más antiguo
  if (!ultima) return { ...base, detalle: 'Sin registros', estado: 'pronto' };
  if (!ultima.proximaDosis) return { ...base, detalle: 'Al día', estado: 'al_dia' };

  const dias = diasEntre(hoy(), ultima.proximaDosis);
  if (dias < 0) return { ...base, detalle: `Venció ${tiempoDesde(ultima.proximaDosis).toLowerCase()}`, estado: 'vencido' };
  if (dias <= DIAS_AVISO_VACUNA) return { ...base, detalle: `Vence ${tiempoHasta(ultima.proximaDosis).toLowerCase()}`, estado: 'pronto' };
  return { ...base, detalle: 'Al día', estado: 'al_dia' };
};

/** Último control: la atención más reciente de cualquier tipo. */
const recordatorioControl = (registros: RegistroMedico[]): Recordatorio => {
  const base = { id: 'control', titulo: 'Último control', icono: 'reloj', tono: 'durazno' } as const;
  const ultimo = registros[0];
  if (!ultimo) return { ...base, detalle: 'Sin registros', estado: 'pronto' };
  const limite = sumarDias(ultimo.fecha, Math.round(MESES_CONTROL_RECOMENDADO * 30.44));
  return { ...base, detalle: tiempoDesde(ultimo.fecha), estado: limite < hoy() ? 'pronto' : 'al_dia' };
};

export const resumirMascota = (m: Mascota, citas: CitaDueno[], registros: RegistroMedico[]): ResumenMascota => {
  const registrosDeMascota = registros.filter((r) => r.mascotaId === m.id);
  return {
    descripcion: descripcionMascota(m),
    ...resumirFicha(m),
    proximaCita: proximaCitaDe(m.id, citas),
    recordatorios: [recordatorioVacunas(registrosDeMascota), recordatorioControl(registrosDeMascota)],
  };
};
