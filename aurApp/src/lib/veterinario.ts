import { TEXTOS_HISTORIAL, TIPO_REGISTRO_LABEL } from '@/constants/constants';
import type {
  CitaVeterinario,
  DerivacionRecibida,
  FiltroAgendaVeterinario,
  FiltroDerivaciones,
  FiltroPacientes,
  GrupoPorDia,
  ItemHistorial,
  PacienteVeterinario,
  RegistroFicha,
} from '@/interfaces';

import { diaDeCita, formatFechaCorta, formatFechaLarga, hoy, partesFechaCita } from './fechas';

// Reglas de la vista del veterinario, calculadas desde sus citas.

/** Las citas aceptadas lo hacen paciente; una solicitud pendiente o cancelada no (igual que la web). */
const ESTADOS_DE_PACIENTE = ['confirmada', 'en_curso', 'completada'];

/** Cada mascota una vez, con su última visita y cuántas tuvo. */
export const pacientesDesdeCitas = (citas: CitaVeterinario[]): PacienteVeterinario[] => {
  const pacientes = new Map<number, PacienteVeterinario>();
  for (const c of citas.filter((x) => ESTADOS_DE_PACIENTE.includes(x.estado))) {
    const existente = pacientes.get(c.mascotaId);
    if (existente) {
      existente.totalVisitas += 1;
      if (c.fechaHora > existente.ultimaVisita) existente.ultimaVisita = c.fechaHora;
      continue;
    }
    pacientes.set(c.mascotaId, {
      id: c.mascotaId,
      nombre: c.mascota,
      especie: c.especie,
      raza: c.raza,
      fotoUrl: c.fotoUrl,
      dueno: c.dueno,
      ultimaVisita: c.fechaHora,
      totalVisitas: 1,
      alergias: c.alergias,
    });
  }
  return [...pacientes.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
};

export const esDeHoy = (c: { fechaHora: string }) => diaDeCita(c.fechaHora) === hoy();
export const esDeHoyEnAdelante = (c: { fechaHora: string }) => diaDeCita(c.fechaHora) >= hoy();

/** Citas de hoy que siguen en pie (sin canceladas), por hora. */
export const citasDeHoy = (citas: CitaVeterinario[]) => citas.filter((c) => esDeHoy(c) && c.estado !== 'cancelada');

/** Solicitudes que esperan respuesta, de hoy en adelante. */
export const citasPorConfirmar = (citas: CitaVeterinario[]) => citas.filter((c) => c.estado === 'pendiente' && esDeHoyEnAdelante(c));

/** El siguiente paciente: el que está en curso, o la próxima cita confirmada de hoy. */
export const siguientePaciente = (citas: CitaVeterinario[]): CitaVeterinario | null => {
  const deHoy = citasDeHoy(citas);
  return (
    deHoy.find((c) => c.estado === 'en_curso') ??
    deHoy.find((c) => c.estado === 'confirmada' && new Date(c.fechaHora).getTime() >= Date.now() - 60 * 60 * 1000) ??
    deHoy.find((c) => c.estado === 'confirmada') ??
    null
  );
};

/** "Buenos días" / "Buenas tardes" / "Buenas noches" según la hora del teléfono. */
export const saludoDelDia = (fecha = new Date()): string => {
  const h = fecha.getHours();
  if (h < 12) return 'Buenos días';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
};

/** Agrupa citas por día ("MIÉ 28 OCT"), manteniendo el orden en que vienen. */
export const agruparPorDia = <T extends { fechaHora: string }>(items: T[]): GrupoPorDia<T>[] =>
  items.reduce<GrupoPorDia<T>[]>((grupos, item) => {
    const { dia, numero, mes } = partesFechaCita(item.fechaHora);
    const titulo = diaDeCita(item.fechaHora) === hoy() ? 'Hoy' : `${dia} ${numero} ${mes}`;
    const ultimo = grupos[grupos.length - 1];
    if (ultimo?.titulo === titulo) ultimo.items.push(item);
    else grupos.push({ titulo, items: [item] });
    return grupos;
  }, []);

/** Filtros de la agenda del veterinario (definidos fuera de los componentes para useFiltro). */
export const FILTROS_AGENDA: Record<FiltroAgendaVeterinario, (c: CitaVeterinario) => boolean> = {
  hoy: (c) => esDeHoy(c) && c.estado !== 'cancelada',
  proximas: (c) => esDeHoyEnAdelante(c) && (c.estado === 'confirmada' || c.estado === 'en_curso'),
  pendientes: (c) => c.estado === 'pendiente' && esDeHoyEnAdelante(c),
  pasadas: (c) => !esDeHoyEnAdelante(c) || c.estado === 'completada',
};

export const camposBusquedaCitaVeterinario = (c: CitaVeterinario) => [c.mascota, c.dueno, c.motivo];

export const FILTROS_PACIENTE: Record<FiltroPacientes, (p: PacienteVeterinario) => boolean> = {
  todos: () => true,
  alergias: (p) => Boolean(p.alergias),
};

export const camposBusquedaPaciente = (p: PacienteVeterinario) => [p.nombre, p.dueno, p.raza];

export const FILTROS_DERIVACION: Record<FiltroDerivaciones, (d: DerivacionRecibida) => boolean> = {
  pendientes: (d) => d.recibida && d.estado === 'pendiente',
  recibidas: (d) => d.recibida,
  enviadas: (d) => !d.recibida,
};

export const camposBusquedaDerivacion = (d: DerivacionRecibida) => [d.mascota, d.dueno, d.motivo];

/** Historial de la ficha → items de la línea de tiempo (la misma que ve el dueño). */
export const itemsDesdeFicha = (registros: RegistroFicha[], mascota: string, mascotaId: number): ItemHistorial[] =>
  registros.map((r) => {
    const esVacuna = r.tipo === 'vacuna';
    return {
      clave: `registro-${r.id}`,
      tipo: esVacuna ? 'vacuna' : 'consulta',
      mascotaId,
      mascota,
      fecha: r.fecha,
      titulo: `${esVacuna ? r.descripcion : TIPO_REGISTRO_LABEL[r.tipo]} · ${formatFechaCorta(r.fecha)}`,
      subtitulo: [r.veterinario, r.centro].filter(Boolean).join(' · ') || null,
      detalle: esVacuna ? r.tratamiento : [r.descripcion, r.tratamiento].filter(Boolean).join('\n'),
      etiqueta: r.proximaDosis ? TEXTOS_HISTORIAL.proximaDosis(formatFechaLarga(r.proximaDosis)) : null,
      receta: null,
    };
  });
