// Consultas a la base de datos (lo que LEE la app). Mismo enfoque que auraPet/src/Api/getInfo.tsx:
//   1. Se pide a Supabase solo lo necesario.
//   2. Si hay error, se lanza (throw) para que la pantalla lo muestre.
//   3. Las filas (snake_case) se pasan al formato de la app (camelCase).
// Lo que cada persona puede ver lo deciden las reglas RLS de la base (migración 13 para el dueño).

import { ESPECIALIDAD_POR_DEFECTO, RAZA_SIN_INDICAR, TEXTOS_MODERACION } from '@/constants/constants';
import type {
  AnimalParaVeterinario,
  AtencionPropia,
  CentroAtencion,
  ResumenSolidario,
  CasoModeracion,
  DecisionModeracion,
  DetalleMiRefugio,
  EstadoCasoModeracion,
  MotivoReporte,
  ResumenModeracion,
  AnimalAdopcion,
  AvisoModeracion,
  ChequeoAdopcion,
  EstadoPostulacion,
  EstadoPublicacion,
  FichaAdopcion,
  OpcionRefugio,
  PostulacionRecibida,
  PublicacionPropia,
  RecepcionRefugio,
  Refugio,
  ResumenAdopciones,
  ResumenRefugios,
  SexoAdopcion,
  TamanoAdopcion,
  TenenciaAdopcion,
  ViviendaAdopcion,
  CentroAdministrado,
  CentroDetalle,
  CentroParaCita,
  CitaCentro,
  CitaDueno,
  CitaVeterinario,
  DatosCentro,
  DatosDueno,
  DatosSuperadmin,
  DatosVeterinario,
  Derivacion,
  DerivacionRecibida,
  EstadoSolicitudEliminacion,
  FichaPaciente,
  FichaPdfCruda,
  InfoVeterinario,
  Mascota,
  MensajeContacto,
  MiembroEquipo,
  Plan,
  Receta,
  RegistroMedico,
  ResumenSuperadmin,
  SolicitudEliminacion,
  SolicitudPendiente,
  SolicitudPlan,
  SuscripcionCentro,
  EspecialidadOpcion,
  ProfesionalParaCita,
  DestinoDerivacion,
  MisEspecialidades,
  TipoDestinoDerivacion,
  SolicitudEliminacionPropia,
  AvisoCita,
  BloqueoHorario,
  EstadoUciCentro,
  HorarioAtencion,
  ListaUrgencias,
  ProgresoPerfilCentro,
  ProgresoPerfilVeterinario,
  TelefonoEnUrgencias,
  TipoAvisoCita,
} from '@/interfaces';
import { edadAdopcion, especieAdopcion, etapaAdopcion, urlFotoAdopcion } from '@/lib/adopcion';
import type { Database } from '@/lib/database.types';
import { urlFotoPerfil } from '@/lib/fotoPerfil';
import { pacientesDesdeCitas } from '@/lib/veterinario';
import { supabase } from '@/lib/supabase';

// ─── Mascotas ───────────────────────────────────────────────────────────

export const getMascotasPorDueno = async (duenoId: string): Promise<Mascota[]> => {
  const { data, error } = await supabase
    .from('mascotas')
    .select(
      'id, nombre, especie, raza, fecha_nacimiento, sexo, esterilizado, peso_kg, alergias, condiciones_cronicas, microchip, foto_url',
    )
    .eq('dueno_id', duenoId)
    .order('creado_en');
  if (error) throw error;
  return (data ?? []).map((m) => ({
    id: m.id,
    nombre: m.nombre,
    especie: m.especie,
    raza: m.raza,
    fechaNacimiento: m.fecha_nacimiento,
    sexo: m.sexo,
    esterilizado: m.esterilizado,
    pesoKg: m.peso_kg,
    alergias: m.alergias,
    condicionesCronicas: m.condiciones_cronicas,
    microchip: m.microchip,
    fotoUrl: m.foto_url,
  }));
};

// ─── Citas ──────────────────────────────────────────────────────────────

/**
 * El dueño no puede leer los perfiles de los veterinarios (tienen teléfonos), así que los
 * nombres se piden con las mismas funciones que usa "Pedir hora": veterinarios_de_centro y
 * veterinarios_independientes. Si alguna falla, la cita se muestra sin nombre.
 */
const nombresDeVeterinarios = async (
  filas: { centro_id: number | null; veterinario_id: number | null }[],
): Promise<Map<number, string>> => {
  const conVeterinario = filas.filter((f) => f.veterinario_id !== null);
  const centros = [...new Set(conVeterinario.map((f) => f.centro_id).filter((id): id is number => id !== null))];
  const hayIndependientes = conVeterinario.some((f) => f.centro_id === null);

  const respuestas = await Promise.all([
    ...centros.map((id) => supabase.rpc('veterinarios_de_centro', { p_centro_id: id })),
    ...(hayIndependientes ? [supabase.rpc('veterinarios_independientes')] : []),
  ]);

  const nombres = new Map<number, string>();
  respuestas.forEach(({ data }) => (data ?? []).forEach((v) => nombres.set(v.id, v.nombre)));
  return nombres;
};

/** Todas las citas de las mascotas del dueño, de la más nueva a la más antigua. */
export const getCitasDueno = async (duenoId: string): Promise<CitaDueno[]> => {
  const { data, error } = await supabase
    .from('citas')
    .select(
      `id, mascota_id, centro_id, veterinario_id, fecha_hora, motivo, estado, sintomas_reportados,
       cancelada_por, motivo_cancelacion,
       mascotas!inner ( nombre, dueno_id ),
       centros ( nombre, direccion, comuna )`,
    )
    .eq('mascotas.dueno_id', duenoId)
    .order('fecha_hora', { ascending: false });
  if (error) throw error;

  const filas = data ?? [];
  const veterinarios = await nombresDeVeterinarios(filas);

  return filas.map((c) => ({
    id: c.id,
    mascotaId: c.mascota_id,
    mascota: c.mascotas?.nombre ?? 'Mascota',
    fechaHora: c.fecha_hora,
    motivo: c.motivo,
    estado: c.estado,
    sintomas: c.sintomas_reportados ?? [],
    centroId: c.centro_id,
    centro: c.centros?.nombre ?? null,
    direccion: c.centros ? `${c.centros.direccion}, ${c.centros.comuna}` : null,
    veterinario: c.veterinario_id ? (veterinarios.get(c.veterinario_id) ?? null) : null,
    // Rechazada = cancelada por alguien que no es el dueño (el veterinario, migración 18)
    rechazada: c.estado === 'cancelada' && c.cancelada_por !== duenoId,
    motivoCancelacion: c.motivo_cancelacion,
    puedeCancelar: c.estado === 'pendiente' || c.estado === 'confirmada',
  }));
};

// ─── Historial, recetas y derivaciones ──────────────────────────────────

export const getHistorialDueno = async (): Promise<{ registros: RegistroMedico[]; recetas: Receta[] }> => {
  const [registros, recetas] = await Promise.all([
    supabase
      .from('registros_medicos')
      .select('id, mascota_id, fecha, tipo, descripcion, tratamiento, proxima_dosis, mascotas ( nombre ), centros ( nombre )')
      .order('fecha', { ascending: false }),
    supabase
      .from('recetas')
      .select(
        'id, mascota_id, creada_en, indicaciones, proximo_control, mascotas ( nombre ), receta_medicamentos ( nombre, dosis, frecuencia, duracion )',
      )
      .order('creada_en', { ascending: false }),
  ]);
  if (registros.error) throw registros.error;
  if (recetas.error) throw recetas.error;

  return {
    registros: (registros.data ?? []).map((r) => ({
      id: r.id,
      mascotaId: r.mascota_id,
      mascota: r.mascotas?.nombre ?? 'Mascota',
      fecha: r.fecha,
      tipo: r.tipo,
      descripcion: r.descripcion,
      tratamiento: r.tratamiento,
      proximaDosis: r.proxima_dosis,
      centro: r.centros?.nombre ?? null,
    })),
    recetas: (recetas.data ?? []).map((r) => ({
      id: r.id,
      mascotaId: r.mascota_id,
      mascota: r.mascotas?.nombre ?? 'Mascota',
      fecha: r.creada_en.slice(0, 10),
      indicaciones: r.indicaciones,
      proximoControl: r.proximo_control,
      medicamentos: r.receta_medicamentos ?? [],
    })),
  };
};

/** Derivaciones de todas las mascotas del dueño (listar_derivaciones sin mascota, migración 29). */
export const getDerivacionesDueno = async (): Promise<Derivacion[]> => {
  const { data, error } = await supabase.rpc('listar_derivaciones', {});
  if (error) throw error;
  return (data ?? []).map((d) => ({
    id: d.id,
    mascotaId: d.mascota_id,
    mascota: d.mascota,
    fecha: d.creada_en.slice(0, 10),
    origen: d.origen,
    destino: d.destino,
    motivo: d.motivo,
    estado: d.estado,
    resultado: d.resultado,
  }));
};

/** Todo lo que necesitan las pestañas del dueño, en paralelo. */
export const getDatosDueno = async (duenoId: string): Promise<DatosDueno> => {
  const [mascotas, citas, historial, derivaciones] = await Promise.all([
    getMascotasPorDueno(duenoId),
    getCitasDueno(duenoId),
    getHistorialDueno(),
    getDerivacionesDueno(),
  ]);
  return { mascotas, citas, ...historial, derivaciones };
};

// ─── Pedir hora ─────────────────────────────────────────────────────────

/** Centros aprobados con su horario (la base solo muestra los del mismo "mundo" real/prueba). */
export const getCentrosParaCita = async (): Promise<CentroParaCita[]> => {
  const { data, error } = await supabase
    .from('centros')
    .select('id, nombre, comuna, direccion, es_prueba, horarios_centro ( dia_semana, abre, cierra, inicio_colacion, fin_colacion )')
    .eq('estado_verificacion', 'aprobado')
    .order('nombre');
  if (error) throw error;
  return (data ?? []).map((c) => ({
    id: c.id,
    nombre: c.nombre,
    comuna: c.comuna,
    direccion: c.direccion,
    esPrueba: c.es_prueba,
    horarios: (c.horarios_centro ?? []).map((h) => ({
      diaSemana: h.dia_semana,
      abre: h.abre.slice(0, 5),
      cierra: h.cierra.slice(0, 5),
      inicioColacion: h.inicio_colacion?.slice(0, 5) ?? null,
      finColacion: h.fin_colacion?.slice(0, 5) ?? null,
    })),
  }));
};

// ─── Ficha en PDF ───────────────────────────────────────────────────────

/** Todo lo que lleva la ficha (función ficha_pdf, migración 34). La base revisa que sea tu mascota. */
export const getFichaPdf = async (mascotaId: number): Promise<FichaPdfCruda> => {
  const { data, error } = await supabase.rpc('ficha_pdf', { p_mascota_id: mascotaId });
  if (error) throw error;
  if (!data) throw new Error('No se encontró la ficha.');
  return data as unknown as FichaPdfCruda;
};

// =====================================================================
// VETERINARIO
// =====================================================================

/** La ficha de veterinario de la cuenta conectada y sus centros (null si no tiene ficha). */
export const getInfoVeterinario = async (perfilId: string): Promise<InfoVeterinario> => {
  const { data, error } = await supabase
    .from('veterinarios')
    .select('id, estado_verificacion, veterinario_centros ( centros ( nombre ) )')
    .eq('perfil_id', perfilId)
    .maybeSingle();
  if (error) throw error;
  return {
    id: data?.id ?? null,
    estado: data?.estado_verificacion ?? null,
    centros: (data?.veterinario_centros ?? [])
      .map((vc) => vc.centros?.nombre)
      .filter((n): n is string => Boolean(n)),
  };
};

/** Todas las citas asignadas al veterinario, de la más temprana a la más tarde. */
export const getCitasVeterinario = async (veterinarioId: number): Promise<CitaVeterinario[]> => {
  const { data, error } = await supabase
    .from('citas')
    .select(
      `id, mascota_id, fecha_hora, motivo, estado, sintomas_reportados, centro_id, reagendada_en,
       mascotas ( nombre, especie, raza, fecha_nacimiento, alergias, foto_url, perfiles ( nombre ) ),
       centros ( nombre )`,
    )
    .eq('veterinario_id', veterinarioId)
    .order('fecha_hora');
  if (error) throw error;
  return (data ?? []).map((c) => ({
    id: c.id,
    mascotaId: c.mascota_id,
    mascota: c.mascotas?.nombre ?? 'Mascota',
    especie: c.mascotas?.especie ?? null,
    raza: c.mascotas?.raza ?? null,
    fechaNacimiento: c.mascotas?.fecha_nacimiento ?? null,
    alergias: c.mascotas?.alergias ?? null,
    fotoUrl: c.mascotas?.foto_url ?? null,
    dueno: c.mascotas?.perfiles?.nombre ?? 'Dueño desconocido',
    fechaHora: c.fecha_hora,
    motivo: c.motivo,
    sintomas: c.sintomas_reportados ?? [],
    estado: c.estado,
    centro: c.centros?.nombre ?? null,
    centroId: c.centro_id,
    reagendada: c.reagendada_en !== null,
  }));
};

/** Derivaciones recibidas (a mí o a mis centros) y enviadas por mí (mis_derivaciones, migración 29). */
export const getDerivacionesVeterinario = async (): Promise<DerivacionRecibida[]> => {
  const { data, error } = await supabase.rpc('mis_derivaciones');
  if (error) throw error;
  return (data ?? []).map((d) => ({
    id: d.id,
    mascotaId: d.mascota_id,
    mascota: d.mascota,
    dueno: d.dueno ?? 'Dueño desconocido',
    fecha: d.creada_en.slice(0, 10),
    origen: d.origen,
    destino: d.destino,
    motivo: d.motivo,
    estado: d.estado,
    resultado: d.resultado,
    recibida: d.direccion !== 'enviada',
  }));
};

export const getDatosVeterinario = async (perfilId: string): Promise<DatosVeterinario> => {
  const info = await getInfoVeterinario(perfilId);
  if (info.id === null) return { info, citas: [], pacientes: [], derivaciones: [] };
  const [citas, derivaciones] = await Promise.all([getCitasVeterinario(info.id), getDerivacionesVeterinario()]);
  return { info, citas, pacientes: pacientesDesdeCitas(citas), derivaciones };
};

/** Ficha de un paciente: datos de la mascota y del dueño + historial completo (historial_de_paciente, migración 19). */
export const getFichaPaciente = async (mascotaId: number): Promise<FichaPaciente> => {
  const [mascota, historial] = await Promise.all([
    supabase
      .from('mascotas')
      .select(
        'id, nombre, especie, raza, sexo, fecha_nacimiento, peso_kg, alergias, condiciones_cronicas, esterilizado, microchip, foto_url, perfiles ( nombre, telefono )',
      )
      .eq('id', mascotaId)
      .single(),
    supabase.rpc('historial_de_paciente', { p_mascota_id: mascotaId }),
  ]);
  if (mascota.error) throw mascota.error;
  if (historial.error) throw historial.error;
  const m = mascota.data;
  return {
    mascota: {
      id: m.id,
      nombre: m.nombre,
      especie: m.especie,
      raza: m.raza,
      fechaNacimiento: m.fecha_nacimiento,
      sexo: m.sexo,
      esterilizado: m.esterilizado,
      pesoKg: m.peso_kg,
      alergias: m.alergias,
      condicionesCronicas: m.condiciones_cronicas,
      microchip: m.microchip,
      fotoUrl: m.foto_url,
    },
    dueno: m.perfiles?.nombre ?? 'Dueño desconocido',
    telefonoDueno: m.perfiles?.telefono ?? null,
    historial: (historial.data ?? []).map((r) => ({
      id: r.id,
      fecha: r.fecha,
      tipo: r.tipo,
      descripcion: r.descripcion,
      tratamiento: r.tratamiento,
      proximaDosis: r.proxima_dosis,
      veterinario: r.veterinario,
      centro: r.centro,
    })),
  };
};

// =====================================================================
// ADMINISTRADOR DE CENTRO
// =====================================================================

export const getMisCentrosAdmin = async (perfilId: string): Promise<CentroAdministrado[]> => {
  const { data, error } = await supabase.from('admins_centro').select('centros ( id, nombre )').eq('perfil_id', perfilId);
  if (error) throw error;
  return (data ?? [])
    .map((f) => f.centros)
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
};

export const getCentroDetalle = async (centroId: number): Promise<CentroDetalle> => {
  const { data, error } = await supabase
    .from('centros')
    .select(
      `id, nombre, direccion, comuna, telefono, es_prueba, tiene_uci, urgencias_24_7, urgencias_revisado_en,
       horarios_centro ( dia_semana, abre, cierra, inicio_colacion, fin_colacion ),
       centro_especialidades ( especialidad_id, especialidades ( nombre ) )`,
    )
    .eq('id', centroId)
    .single();
  if (error) throw error;
  return {
    id: data.id,
    nombre: data.nombre,
    direccion: data.direccion,
    comuna: data.comuna,
    telefono: data.telefono,
    esPrueba: data.es_prueba,
    especialidades: (data.centro_especialidades ?? [])
      .map((ce) => ce.especialidades?.nombre)
      .filter((n): n is string => Boolean(n))
      .sort(),
    especialidadIds: (data.centro_especialidades ?? []).map((ce) => ce.especialidad_id),
    tieneUci: data.tiene_uci,
    urgencias247: data.urgencias_24_7,
    urgenciasRevisadas: data.urgencias_revisado_en !== null,
    horarios: (data.horarios_centro ?? [])
      .map((h) => ({
        diaSemana: h.dia_semana,
        abre: h.abre.slice(0, 5),
        cierra: h.cierra.slice(0, 5),
        inicioColacion: h.inicio_colacion?.slice(0, 5) ?? null,
        finColacion: h.fin_colacion?.slice(0, 5) ?? null,
      }))
      .sort((a, b) => a.diaSemana - b.diaSemana),
  };
};

export const getEquipoCentro = async (centroId: number): Promise<MiembroEquipo[]> => {
  const [vets, admins] = await Promise.all([
    supabase
      .from('veterinario_centros')
      .select('veterinarios ( id, perfiles!veterinarios_perfil_id_fkey ( nombre ), especialidades!veterinarios_especialidad_id_fkey ( nombre ) )')
      .eq('centro_id', centroId),
    supabase.from('admins_centro').select('perfil_id, perfiles!admins_centro_perfil_id_fkey ( nombre )').eq('centro_id', centroId),
  ]);
  if (vets.error) throw vets.error;
  if (admins.error) throw admins.error;
  const equipo: MiembroEquipo[] = [
    ...(vets.data ?? [])
      .map((f) => f.veterinarios)
      .filter((v): v is NonNullable<typeof v> => Boolean(v))
      .map((v) => ({
        clave: `veterinario-${v.id}`,
        nombre: v.perfiles?.nombre ?? 'Veterinario sin cuenta',
        tipo: 'veterinario' as const,
        detalle: v.especialidades?.nombre ?? ESPECIALIDAD_POR_DEFECTO,
      })),
    ...(admins.data ?? []).map((a) => ({
      clave: `admin-${a.perfil_id}`,
      nombre: a.perfiles?.nombre ?? 'Sin nombre',
      tipo: 'admin' as const,
      detalle: 'Administrador',
    })),
  ];
  return equipo.sort((a, b) => a.nombre.localeCompare(b.nombre));
};

export const getCitasCentro = async (centroId: number): Promise<CitaCentro[]> => {
  const { data, error } = await supabase
    .from('citas')
    .select(
      `id, fecha_hora, motivo, estado,
       mascotas ( nombre, perfiles ( nombre ) ),
       veterinarios ( perfiles!veterinarios_perfil_id_fkey ( nombre ) )`,
    )
    .eq('centro_id', centroId)
    .order('fecha_hora', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((c) => ({
    id: c.id,
    mascota: c.mascotas?.nombre ?? 'Mascota',
    dueno: c.mascotas?.perfiles?.nombre ?? 'Dueño desconocido',
    veterinario: c.veterinarios?.perfiles?.nombre ?? null,
    fechaHora: c.fecha_hora,
    motivo: c.motivo,
    estado: c.estado,
  }));
};

export const getPlanes = async (): Promise<Plan[]> => {
  const { data, error } = await supabase.from('planes').select('id, nombre, precio_mensual, limite_veterinarios, orden').order('orden');
  if (error) throw error;
  return (data ?? []).map((p) => ({
    id: p.id,
    nombre: p.nombre,
    precioMensual: p.precio_mensual,
    limiteVeterinarios: p.limite_veterinarios,
  }));
};

/** Plan y uso del centro (resumen_suscripcion revisa que quien pregunta administre el centro). */
export const getSuscripcionCentro = async (centroId: number, planes: Plan[]): Promise<SuscripcionCentro | null> => {
  const { data, error } = await supabase.rpc('resumen_suscripcion', { p_centro_id: centroId });
  if (error) throw error;
  const s = data?.[0];
  const plan = s && planes.find((p) => p.id === s.plan_id);
  if (!s || !plan) return null;
  return {
    plan,
    estado: s.estado,
    inicio: s.inicio,
    finPrueba: s.fin_prueba,
    renovacion: s.renovacion,
    veterinarios: s.veterinarios,
    citasMes: s.citas_mes,
    planSolicitado: s.plan_solicitado,
  };
};

export const getDatosCentro = async (centroId: number): Promise<DatosCentro> => {
  const [detalle, citas, equipo, planes] = await Promise.all([
    getCentroDetalle(centroId),
    getCitasCentro(centroId),
    getEquipoCentro(centroId),
    getPlanes(),
  ]);
  // Si la suscripción falla (por ejemplo, un centro sin plan), el resto igual se muestra.
  const suscripcion = await getSuscripcionCentro(centroId, planes).catch(() => null);
  return { detalle, citas, equipo, suscripcion, planes };
};

// =====================================================================
// SUPERADMIN
// =====================================================================

/** Los números del resumen. Solo cuenta filas (head: true), no descarga datos. */
export const getResumenSuperadmin = async (): Promise<ResumenSuperadmin> => {
  const contar = async (consulta: PromiseLike<{ count: number | null; error: unknown }>) => {
    const { count, error } = await consulta;
    if (error) throw error;
    return count ?? 0;
  };
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const [usuarios, centrosActivos, citasMes, veterinarios] = await Promise.all([
    contar(supabase.from('perfiles').select('*', { count: 'exact', head: true }).is('desactivado_en', null)),
    contar(supabase.from('centros').select('*', { count: 'exact', head: true }).eq('estado_verificacion', 'aprobado')),
    contar(
      supabase
        .from('citas')
        .select('*', { count: 'exact', head: true })
        .gte('fecha_hora', inicioMes.toISOString())
        .neq('estado', 'cancelada'),
    ),
    contar(supabase.from('veterinarios').select('*', { count: 'exact', head: true }).eq('estado_verificacion', 'aprobado')),
  ]);
  return { usuarios, centrosActivos, citasMes, veterinarios };
};

/** Centros, veterinarios y solicitudes de /solicitar-centro que esperan aprobación (igual que la web). */
export const getSolicitudesPendientes = async (): Promise<SolicitudPendiente[]> => {
  const [centros, veterinarios, solicitudes, refugios] = await Promise.all([
    supabase.from('centros').select('id, nombre, comuna, creado_en').eq('estado_verificacion', 'pendiente'),
    supabase
      .from('veterinarios')
      .select(
        'id, creado_en, especialidad_otra, centro_solicitado_id, centro_mencionado, perfiles!veterinarios_perfil_id_fkey ( nombre ), especialidades!veterinarios_especialidad_id_fkey ( nombre )',
      )
      .eq('estado_verificacion', 'pendiente'),
    supabase.from('solicitudes_centro').select('id, nombre_centro, comuna, creado_en').eq('estado', 'pendiente'),
    supabase.rpc('admin_listar_refugios'),
  ]);
  if (refugios.error) throw refugios.error;
  if (centros.error) throw centros.error;
  if (veterinarios.error) throw veterinarios.error;
  if (solicitudes.error) throw solicitudes.error;

  const idsCentros = [
    ...new Set((veterinarios.data ?? []).map((v) => v.centro_solicitado_id).filter((id): id is number => id !== null)),
  ];
  const nombreCentro = new Map<number, string>();
  if (idsCentros.length) {
    const { data, error } = await supabase.from('centros').select('id, nombre').in('id', idsCentros);
    if (error) throw error;
    (data ?? []).forEach((c) => nombreCentro.set(c.id, c.nombre));
  }

  const lista: SolicitudPendiente[] = [
    ...(centros.data ?? []).map((c) => ({
      clave: `centro-${c.id}`,
      tipo: 'centro' as const,
      nombre: c.nombre,
      detalle: c.comuna,
      creadoEn: c.creado_en,
    })),
    ...(veterinarios.data ?? []).map((v) => ({
      clave: `veterinario-${v.id}`,
      tipo: 'veterinario' as const,
      nombre: v.perfiles?.nombre ?? 'Veterinario sin nombre',
      detalle: [
        v.especialidades?.nombre ?? v.especialidad_otra ?? ESPECIALIDAD_POR_DEFECTO,
        v.centro_solicitado_id ? nombreCentro.get(v.centro_solicitado_id) : v.centro_mencionado,
      ]
        .filter(Boolean)
        .join(' · '),
      creadoEn: v.creado_en,
    })),
    ...(solicitudes.data ?? []).map((s) => ({
      clave: `solicitud_centro-${s.id}`,
      tipo: 'solicitud_centro' as const,
      nombre: s.nombre_centro,
      detalle: s.comuna,
      creadoEn: s.creado_en,
    })),
    // Refugios que postularon ("Súmate a AuraPet", migraciones 48 y 51)
    ...(refugios.data ?? [])
      .filter((r) => r.estado === 'pendiente')
      .map((r) => {
        const sinAdministradores = !Array.isArray(r.administradores) || r.administradores.length === 0;
        return {
          clave: `refugio-${r.id}`,
          tipo: 'refugio' as const,
          nombre: r.nombre,
          detalle: [r.comuna, r.responsable, r.es_prueba ? TEXTOS_MODERACION.prueba : null].filter(Boolean).join(' · '),
          creadoEn: r.creado_en,
          invitarA: r.correo_acceso && sinAdministradores ? r.correo_acceso : null,
        };
      }),
  ];
  return lista.sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
};

export const getMensajesContacto = async (): Promise<MensajeContacto[]> => {
  const { data, error } = await supabase
    .from('mensajes_contacto')
    .select('id, nombre, correo, asunto, mensaje, estado, creado_en')
    .order('creado_en', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((m) => ({
    id: m.id,
    nombre: m.nombre,
    correo: m.correo,
    asunto: m.asunto,
    mensaje: m.mensaje,
    estado: m.estado,
    creadoEn: m.creado_en,
  }));
};

export const getSolicitudesEliminacion = async (): Promise<SolicitudEliminacion[]> => {
  const { data, error } = await supabase.rpc('listar_solicitudes_eliminacion');
  if (error) throw error;
  return (data ?? []).map((s) => ({
    id: s.id,
    nombre: s.nombre,
    correo: s.correo,
    rol: s.rol,
    motivo: s.motivo,
    estado: s.estado as EstadoSolicitudEliminacion,
    respuesta: s.respuesta,
    creadaEn: s.creada_en,
  }));
};

/** Centros que pidieron cambiar de plan (listar_suscripciones, migración 28). */
export const getSolicitudesPlan = async (): Promise<SolicitudPlan[]> => {
  const [suscripciones, planes] = await Promise.all([supabase.rpc('listar_suscripciones'), getPlanes()]);
  if (suscripciones.error) throw suscripciones.error;
  const nombrePlan = (id: string | null) => planes.find((p) => p.id === id)?.nombre ?? id ?? '—';
  return (suscripciones.data ?? [])
    .filter((s) => s.solicitud_id !== null)
    .map((s) => ({
      solicitudId: s.solicitud_id,
      centro: s.centro,
      comuna: s.comuna,
      planActual: nombrePlan(s.plan_id),
      planSolicitado: nombrePlan(s.plan_solicitado),
      mensaje: s.mensaje,
      solicitadoPor: s.solicitado_por,
      solicitadoEn: s.solicitado_en,
    }));
};

export const getDatosSuperadmin = async (): Promise<DatosSuperadmin> => {
  const [resumen, solicitudes, mensajes, eliminaciones, solicitudesPlan, moderacion] = await Promise.all([
    getResumenSuperadmin(),
    getSolicitudesPendientes(),
    getMensajesContacto(),
    getSolicitudesEliminacion(),
    getSolicitudesPlan(),
    getResumenModeracion(),
  ]);
  return { resumen, solicitudes, mensajes, eliminaciones, solicitudesPlan, moderacion };
};

// ─── Pedir hora con filtro de especialidades (migraciones 45 y 49) ──────

export const getEspecialidades = async (): Promise<EspecialidadOpcion[]> => {
  const { data, error } = await supabase.from('especialidades').select('id, nombre').order('nombre');
  if (error) throw error;
  return data ?? [];
};

/** Quién se puede agendar (por centro o independiente), con sus especialidades y su foto. Ya viene del mismo mundo (prueba/real). */
export const getProfesionalesParaCita = async (): Promise<ProfesionalParaCita[]> => {
  const { data, error } = await supabase.rpc('profesionales_para_cita');
  if (error) throw error;
  return (data ?? []).map((p) => ({
    veterinarioId: p.veterinario_id,
    nombre: p.nombre,
    centroId: p.centro_id,
    especialidadIds: p.especialidad_ids ?? [],
    especialidades: p.especialidades,
    fotoUrl: urlFotoPerfil(p.avatar_url),
  }));
};

// ─── Eliminar la cuenta (migraciones 32 y 49) ───────────────────────────

/** La última solicitud de eliminación de la persona (o null si nunca pidió). */
export const getMiSolicitudEliminacion = async (perfilId: string): Promise<SolicitudEliminacionPropia | null> => {
  const { data, error } = await supabase
    .from('solicitudes_eliminacion')
    .select('estado, creada_en, respuesta')
    .eq('perfil_id', perfilId)
    .order('creada_en', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? { estado: data.estado as SolicitudEliminacionPropia['estado'], creadaEn: data.creada_en, respuesta: data.respuesta } : null;
};

// ─── Atención desde el celular (fase 2, migraciones 45 y 50) ────────────

/** A quién puede derivar el veterinario conectado (colegas y centros del mismo mundo), con foto y dónde atiende. */
export const getDestinosDerivacion = async (): Promise<DestinoDerivacion[]> => {
  const { data, error } = await supabase.rpc('destinos_derivacion');
  if (error) throw error;
  return (data ?? []).map((d) => ({
    clave: `${d.tipo}-${d.id}`,
    tipo: d.tipo as TipoDestinoDerivacion,
    id: d.id,
    nombre: d.nombre,
    detalle: d.detalle,
    especialidadIds: d.especialidad_ids ?? [],
    fotoUrl: urlFotoPerfil(d.avatar_url),
    lugar: d.lugar,
  }));
};

/** Las especialidades del veterinario conectado (para "Mis especialidades"). */
export const getMisEspecialidades = async (): Promise<MisEspecialidades> => {
  const { data, error } = await supabase.rpc('mis_especialidades');
  if (error) throw error;
  const fila = data?.[0];
  return { ids: fila?.ids ?? [], otra: fila?.otra ?? '' };
};

// ─── Adopción (Fase 3; mismas funciones de la base que /adopta en la web) ───
// Todas son funciones "security definer": la base decide qué se ve (prueba/real, ocultas por moderación).

type FilaAnimalAdopcion = Database['public']['Functions']['listar_adopciones']['Returns'][number];
type FilaDetalleAdopcion = Database['public']['Functions']['detalle_adopcion']['Returns'][number];

const chequeoDesdeFila = (a: FilaAnimalAdopcion | FilaDetalleAdopcion): ChequeoAdopcion | null =>
  a.chequeo_veterinario && a.chequeo_resumen
    ? {
        veterinario: a.chequeo_veterinario,
        centro: a.chequeo_centro,
        fecha: a.chequeo_fecha?.slice(0, 10) ?? '',
        resumen: a.chequeo_resumen,
        solidario: !!a.chequeo_solidario,
      }
    : null;

const animalDesdeFila = (
  a: FilaAnimalAdopcion | FilaDetalleAdopcion,
  foto: string | null,
  refugio: { id: number | null; nombre: string | null },
): AnimalAdopcion => {
  const especie = especieAdopcion(a.especie);
  const sexo = a.sexo as SexoAdopcion;
  return {
    id: a.id,
    nombre: a.nombre,
    especie,
    raza: a.raza?.trim() || RAZA_SIN_INDICAR[sexo],
    sexo,
    tamano: a.tamano as TamanoAdopcion,
    edad: edadAdopcion(a.fecha_nacimiento),
    etapa: etapaAdopcion(especie, a.fecha_nacimiento),
    comuna: a.comuna,
    personalidad: a.personalidad ?? [],
    frase: a.frase,
    chequeo: chequeoDesdeFila(a),
    enProceso: a.estado === 'en_proceso',
    fotoUrl: urlFotoAdopcion(foto),
    refugioId: refugio.id,
    refugio: refugio.nombre,
  };
};

/** Animales esperando hogar (primero los disponibles), con su último chequeo. */
export const getAnimalesAdopcion = async (): Promise<AnimalAdopcion[]> => {
  const { data, error } = await supabase.rpc('listar_adopciones');
  if (error) throw error;
  return (data ?? []).map((a) => animalDesdeFila(a, a.foto_url, { id: a.refugio_id, nombre: a.refugio_nombre }));
};

/** Números de arriba de Adopta: esperando hogar · revisados · ya tienen familia. */
export const getResumenAdopciones = async (): Promise<ResumenAdopciones> => {
  const { data, error } = await supabase.rpc('resumen_adopciones');
  if (error) throw error;
  const fila = data?.[0];
  return { esperando: Number(fila?.esperando ?? 0), revisados: Number(fila?.revisados ?? 0), conFamilia: Number(fila?.con_familia ?? 0) };
};

/** Ficha de un animal. null si no existe o no se puede ver. */
export const getDetalleAdopcion = async (id: number): Promise<FichaAdopcion | null> => {
  const { data, error } = await supabase.rpc('detalle_adopcion', { p_id: id });
  if (error) throw error;
  const a = data?.[0];
  if (!a) return null;
  const fotos = (a.fotos ?? []).map(urlFotoAdopcion).filter((f): f is string => !!f);
  const esRefugio = a.publicador_tipo === 'refugio';
  return {
    ...animalDesdeFila(a, a.fotos?.[0] ?? null, { id: null, nombre: esRefugio ? a.publicador_nombre : null }),
    historia: a.historia,
    fotos,
    rasgos: {
      energia: a.energia,
      sociablePerros: a.sociable_perros,
      sociableGatos: a.sociable_gatos,
      sociableNinos: a.sociable_ninos,
    },
    vacunasAlDia: a.vacunas_al_dia,
    esterilizado: a.esterilizado,
    conMicrochip: a.con_microchip,
    pesoKg: a.peso_kg === null ? null : Number(a.peso_kg),
    alergias: a.alergias,
    solicitaChequeo: a.solicita_chequeo,
    adoptado: a.estado === 'adoptada',
    publicador: { nombre: a.publicador_nombre, tipo: a.publicador_tipo, adopciones: Number(a.publicador_adopciones ?? 0) },
    esMia: !!a.es_mia,
    yaPostule: !!a.ya_postule,
  };
};

/** Avisos del equipo sobre mis publicaciones (ocultas o advertidas), por id de publicación. */
const getAvisosModeracion = async (): Promise<Map<number, AvisoModeracion>> => {
  const { data, error } = await supabase.rpc('avisos_moderacion_mias');
  if (error) throw error;
  return new Map((data ?? []).map((a) => [a.adopcion_id, { tipo: a.tipo as AvisoModeracion['tipo'], mensaje: a.mensaje }]));
};

type FilaPublicacion = Database['public']['Functions']['mis_publicaciones']['Returns'][number];

/** Una fila de mis_publicaciones o animales_de_mi_refugio, con su aviso de moderación si hay. */
const publicacionDesdeFila = (a: FilaPublicacion, avisos: Map<number, AvisoModeracion>): PublicacionPropia => {
  const sexo = a.sexo as SexoAdopcion;
  return {
    id: a.id,
    nombre: a.nombre,
    especie: especieAdopcion(a.especie),
    raza: a.raza?.trim() || RAZA_SIN_INDICAR[sexo],
    edad: edadAdopcion(a.fecha_nacimiento),
    comuna: a.comuna,
    fotoUrl: urlFotoAdopcion(a.foto_url),
    estado: a.estado as EstadoPublicacion,
    creadaEn: a.creada_en,
    revisadaPor: a.revisada_por,
    postulaciones: Number(a.postulaciones),
    nuevas: Number(a.postulaciones_nuevas),
    elegido: a.elegido,
    refugio: a.refugio_nombre,
    moderacion: avisos.get(a.id) ?? null,
  };
};

/** Mis animales publicados (o de mis refugios), con sus postulaciones y el aviso de moderación si hay. */
export const getMisPublicaciones = async (): Promise<PublicacionPropia[]> => {
  const [{ data, error }, avisos] = await Promise.all([supabase.rpc('mis_publicaciones'), getAvisosModeracion()]);
  if (error) throw error;
  return (data ?? []).map((a) => publicacionDesdeFila(a, avisos));
};

/** Postulaciones de un animal mío (con el contacto de cada persona). */
export const getPostulacionesAdopcion = async (adopcionId: number): Promise<PostulacionRecibida[]> => {
  const { data, error } = await supabase.rpc('postulaciones_de_adopcion', { p_adopcion_id: adopcionId });
  if (error) throw error;
  return (data ?? []).map((x) => ({
    id: x.id,
    nombre: x.nombre,
    correo: x.correo,
    telefono: x.telefono,
    vivienda: x.vivienda as ViviendaAdopcion,
    tienePatio: x.tiene_patio,
    tenencia: x.tenencia as TenenciaAdopcion,
    permitenMascotas: x.permiten_mascotas,
    hayNinos: x.hay_ninos,
    edadesNinos: x.edades_ninos,
    otrasMascotas: x.otras_mascotas,
    cualesMascotas: x.cuales_mascotas,
    todosDeAcuerdo: x.todos_de_acuerdo,
    experiencia: x.experiencia,
    motivo: x.motivo,
    estado: x.estado as EstadoPostulacion,
    creadaEn: x.creada_en,
  }));
};

/** Refugios verificados (del mismo mundo que la cuenta: prueba o real). */
export const getRefugios = async (): Promise<Refugio[]> => {
  const { data, error } = await supabase.rpc('listar_refugios');
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    nombre: r.nombre,
    comuna: r.comuna,
    region: r.region,
    descripcion: r.descripcion,
    logoUrl: urlFotoAdopcion(r.logo_url),
    portadaUrl: urlFotoAdopcion(r.portada_url ?? r.fotos?.[0] ?? null),
    telefono: r.telefono,
    correo: r.correo,
    cuposTotales: r.cupos_totales,
    cuposOcupados: r.cupos_ocupados,
    recibe: r.recibe_animales as RecepcionRefugio,
    especies: r.especies ?? [],
    enAdopcion: Number(r.en_adopcion),
  }));
};

export const getResumenRefugios = async (): Promise<ResumenRefugios> => {
  const { data, error } = await supabase.rpc('resumen_refugios');
  if (error) throw error;
  const r = data?.[0];
  return { refugios: Number(r?.refugios ?? 0), animales: Number(r?.animales ?? 0), aliados: Number(r?.aliados ?? 0) };
};

/** Refugios que administro (para publicar a su nombre). */
export const getMisRefugios = async (): Promise<OpcionRefugio[]> => {
  const { data, error } = await supabase.rpc('mis_refugios');
  if (error) throw error;
  return data ?? [];
};

// ─── Fase 4: moderación (superadmin, migración 47) ──────────────────────

export const getResumenModeracion = async (): Promise<ResumenModeracion> => {
  const { data, error } = await supabase.rpc('resumen_moderacion');
  if (error) throw error;
  const r = data?.[0];
  return { porRevisar: Number(r?.por_revisar ?? 0), urgentes: Number(r?.urgentes ?? 0) };
};

/** Publicaciones reportadas (todos sus reportes juntos), primero las urgentes. */
export const getCasosModeracion = async (estado: EstadoCasoModeracion): Promise<CasoModeracion[]> => {
  const { data, error } = await supabase.rpc('casos_moderacion', { p_estado: estado });
  if (error) throw error;
  return (data ?? []).map((c) => ({
    adopcionId: c.adopcion_id,
    nombre: c.nombre,
    especie: especieAdopcion(c.especie),
    comuna: c.comuna,
    fotoUrl: urlFotoAdopcion(c.foto_url),
    publicadaEn: c.publicada_en,
    publicador: c.publicador,
    esPrueba: c.es_prueba,
    reportes: Number(c.reportes),
    motivoPrincipal: c.motivo_principal as MotivoReporte,
    urgente: c.urgente,
    publicaciones: Number(c.publicaciones),
    reportesPrevios: Number(c.reportes_previos),
    decision: (c.decision as DecisionModeracion | null) ?? null,
    detalle: ((c.detalle ?? []) as unknown as { motivo: MotivoReporte; comentario: string | null; creada_en: string }[]).map((r) => ({
      motivo: r.motivo,
      comentario: r.comentario,
      creadaEn: r.creada_en,
    })),
  }));
};

// ─── Fase 4: Mi refugio (migración 42) ──────────────────────────────────

/** Datos y números del mes del refugio que administro (null si no lo administro). */
export const getDetalleMiRefugio = async (refugioId: number): Promise<DetalleMiRefugio | null> => {
  const { data, error } = await supabase.rpc('detalle_mi_refugio', { p_id: refugioId });
  if (error) throw error;
  const r = data?.[0];
  if (!r) return null;
  return {
    id: r.id,
    nombre: r.nombre,
    comuna: r.comuna,
    region: r.region,
    portadaUrl: urlFotoAdopcion(r.portada_url),
    cuposTotales: r.cupos_totales,
    cuposOcupados: r.cupos_ocupados,
    recibe: r.recibe_animales as RecepcionRefugio,
    cuposActualizadosEn: r.cupos_actualizados_en,
    publicadosMes: Number(r.publicados_mes),
    postulacionesMes: Number(r.postulaciones_mes),
    adoptadosMes: Number(r.adoptados_mes),
  };
};

/** Animales publicados a nombre del refugio (mismas tarjetas que "Mis publicaciones"). */
export const getAnimalesMiRefugio = async (refugioId: number): Promise<PublicacionPropia[]> => {
  const [{ data, error }, avisos] = await Promise.all([supabase.rpc('animales_de_mi_refugio', { p_id: refugioId }), getAvisosModeracion()]);
  if (error) throw error;
  return (data ?? []).map((a) => publicacionDesdeFila(a, avisos));
};

// ─── Adopción solidaria (veterinario, migraciones 39 y 40) ──────────────

/** Animales en adopción que el veterinario puede atender (del mismo mundo que su cuenta). */
export const getAnimalesParaVeterinarios = async (): Promise<AnimalParaVeterinario[]> => {
  const { data, error } = await supabase.rpc('adopciones_para_veterinarios');
  if (error) throw error;
  return (data ?? []).map((a) => {
    const sexo = a.sexo as SexoAdopcion;
    return {
      id: a.id,
      nombre: a.nombre,
      especie: especieAdopcion(a.especie),
      raza: a.raza?.trim() || RAZA_SIN_INDICAR[sexo],
      edad: edadAdopcion(a.fecha_nacimiento),
      comuna: a.comuna,
      fotoUrl: urlFotoAdopcion(a.foto_url),
      enProceso: a.estado === 'en_proceso',
      solicitaAtencion: a.solicita_chequeo,
      revisada: a.revisada,
      yaAtendi: a.ya_atendi,
      diasEsperando: Number(a.dias_esperando),
      publicador: a.publicador_nombre,
      refugio: a.refugio_nombre,
      enMiComuna: a.en_mi_comuna,
    };
  });
};

/** Atenciones gratis del veterinario, cuántos de esos animales ya tienen familia y si es aliado solidario. */
export const getResumenSolidario = async (): Promise<ResumenSolidario> => {
  const { data, error } = await supabase.rpc('resumen_solidario');
  if (error) throw error;
  const r = data?.[0];
  return { solidarias: Number(r?.solidarias ?? 0), adoptados: Number(r?.adoptados ?? 0), aliado: !!r?.aliado };
};

export const getMisAtencionesAdopcion = async (): Promise<AtencionPropia[]> => {
  const { data, error } = await supabase.rpc('mis_atenciones_adopcion');
  if (error) throw error;
  return (data ?? []).map((q) => ({
    id: q.id,
    adopcionId: q.adopcion_id,
    nombre: q.nombre,
    especie: especieAdopcion(q.especie),
    fotoUrl: urlFotoAdopcion(q.foto_url),
    fecha: q.fecha.slice(0, 10),
    resumen: q.resumen,
    solidario: q.solidario,
    centro: q.centro,
  }));
};

/** Centros donde atiende el veterinario (para "Centro donde atendiste"). */
export const getMisCentrosAtencion = async (): Promise<CentroAtencion[]> => {
  const { data, error } = await supabase.rpc('mis_centros_de_atencion');
  if (error) throw error;
  return (data ?? []).map((c) => ({ id: c.id, nombre: c.nombre }));
};


// =====================================================================
// Horario de atención, agenda completa, UCI y urgencias (migraciones 52 a 56)
// =====================================================================

/** Bloqueos de horario del veterinario conectado que todavía no terminan. */
export const getMisBloqueos = async (): Promise<BloqueoHorario[]> => {
  const { data, error } = await supabase
    .from('bloqueos_veterinario')
    .select('id, desde, hasta, motivo')
    .gt('hasta', new Date().toISOString())
    .order('desde');
  if (error) throw error;
  return data ?? [];
};

interface HorarioAtencionBase {
  independiente: boolean; urgencias_24_7: boolean; a_domicilio: boolean; comunas: string[]; duracion: number;
  lugares: { centro_id: number | null; nombre: string | null; horario_centro: { dia_semana: number; abre: string; cierra: string }[] }[];
  tramos: { centro_id: number | null; dia_semana: number; desde: string; hasta: string }[];
}

export const getMiHorarioAtencion = async (): Promise<HorarioAtencion> => {
  const { data, error } = await supabase.rpc('mi_horario_atencion');
  if (error) throw error;
  const h = data as unknown as HorarioAtencionBase;
  return {
    independiente: h.independiente,
    urgencias247: h.urgencias_24_7,
    aDomicilio: h.a_domicilio,
    comunas: h.comunas ?? [],
    duracion: h.duracion,
    lugares: (h.lugares ?? []).map((l) => ({
      centroId: l.centro_id,
      nombre: l.nombre,
      horarioCentro: (l.horario_centro ?? []).map((x) => ({ diaSemana: x.dia_semana, abre: x.abre, cierra: x.cierra })),
    })),
    tramos: (h.tramos ?? []).map((t) => ({ centroId: t.centro_id, diaSemana: t.dia_semana, desde: t.desde, hasta: t.hasta })),
  };
};

/** null si la cuenta no tiene ficha de veterinario. "zona" solo viene para independientes. */
export const getProgresoPerfilVeterinario = async (): Promise<ProgresoPerfilVeterinario | null> => {
  const { data, error } = await supabase.rpc('progreso_perfil_veterinario');
  if (error) throw error;
  if (!data) return null;
  const p = data as unknown as { pasos: Record<string, boolean | null> };
  return Object.fromEntries(Object.entries(p.pasos).filter(([, v]) => v !== null)) as ProgresoPerfilVeterinario;
};

export const getMiTelefonoEnUrgencias = async (): Promise<TelefonoEnUrgencias> => {
  const { data, error } = await supabase.rpc('mi_telefono_en_urgencias');
  if (error) throw error;
  const t = data as unknown as { mostrar: boolean; tiene_telefono: boolean } | null;
  return { mostrar: t?.mostrar ?? false, tieneTelefono: t?.tiene_telefono ?? false };
};

/** Avisos sin leer. Con centroId, solo los de ese centro; sin él, los personales (dueño). */
export const getAvisosCitas = async (centroId?: number): Promise<AvisoCita[]> => {
  let consulta = supabase
    .from('notificaciones')
    .select('id, tipo, titulo, mensaje, fecha_anterior, fecha_nueva')
    .is('leida_en', null)
    .order('creada_en', { ascending: false })
    .limit(20);
  consulta = centroId === undefined ? consulta.is('centro_id', null) : consulta.eq('centro_id', centroId);
  const { data, error } = await consulta;
  if (error) throw error;
  return (data ?? []).map((a) => ({
    id: a.id,
    tipo: a.tipo as TipoAvisoCita,
    titulo: a.titulo,
    mensaje: a.mensaje,
    fechaAnterior: a.fecha_anterior,
    fechaNueva: a.fecha_nueva,
  }));
};

/** Fila de estado_uci_centros (consulta o Realtime) → formato de la app. */
export const estadoUciDesdeFila = (f: { centro_id: number; estado: string; motivo: string | null; detalle: string | null; actualizado_en: string }): EstadoUciCentro => ({
  centroId: f.centro_id,
  estado: f.estado as EstadoUciCentro['estado'],
  motivo: f.motivo as EstadoUciCentro['motivo'],
  detalle: f.detalle,
  actualizadoEn: f.actualizado_en,
});

export const getEstadoUci = async (centroId: number): Promise<EstadoUciCentro | null> => {
  const { data, error } = await supabase
    .from('estado_uci_centros')
    .select('centro_id, estado, motivo, detalle, actualizado_en')
    .eq('centro_id', centroId)
    .maybeSingle();
  if (error) throw error;
  return data ? estadoUciDesdeFila(data) : null;
};

export const getProgresoPerfilCentro = async (centroId: number): Promise<ProgresoPerfilCentro | null> => {
  const { data, error } = await supabase.rpc('progreso_perfil_centro', { p_centro_id: centroId });
  if (error) throw error;
  return (data as unknown as ProgresoPerfilCentro) ?? null;
};

interface ListaUrgenciasBase {
  centros: {
    id: number; nombre: string; direccion: string; comuna: string; telefono: number | null;
    urgencias_24_7: boolean; tiene_uci: boolean;
    estado_uci: Parameters<typeof estadoUciDesdeFila>[0] | null;
    horarios: { dia_semana: number; abre: string; cierra: string; inicio_colacion: string | null; fin_colacion: string | null }[];
  }[];
  veterinarios: { id: number; nombre: string; telefono: number; avatar_url: string | null; a_domicilio: boolean; comunas: string[] }[];
}

/** Centros y veterinarios para urgencias. Funciona sin sesión (mundo real). */
export const getUrgencias = async (): Promise<ListaUrgencias> => {
  const { data, error } = await supabase.rpc('listar_urgencias');
  if (error) throw error;
  const l = data as unknown as ListaUrgenciasBase;
  return {
    centros: (l.centros ?? []).map((c) => ({
      id: c.id,
      nombre: c.nombre,
      direccion: c.direccion,
      comuna: c.comuna,
      telefono: c.telefono,
      urgencias247: c.urgencias_24_7,
      tieneUci: c.tiene_uci,
      estadoUci: c.estado_uci ? estadoUciDesdeFila(c.estado_uci) : null,
      horarios: (c.horarios ?? []).map((h) => ({
        diaSemana: h.dia_semana, abre: h.abre, cierra: h.cierra, inicioColacion: h.inicio_colacion, finColacion: h.fin_colacion,
      })),
    })),
    veterinarios: (l.veterinarios ?? []).map((v) => ({
      id: v.id, nombre: v.nombre, telefono: v.telefono, avatarUrl: v.avatar_url, aDomicilio: v.a_domicilio, comunas: v.comunas ?? [],
    })),
  };
};
