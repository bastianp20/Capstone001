// Consultas a la base de datos (lo que LEE la app). Mismo enfoque que auraPet/src/Api/getInfo.tsx:
//   1. Se pide a Supabase solo lo necesario.
//   2. Si hay error, se lanza (throw) para que la pantalla lo muestre.
//   3. Las filas (snake_case) se pasan al formato de la app (camelCase).
// Lo que cada persona puede ver lo deciden las reglas RLS de la base (migración 13 para el dueño).

import { ESPECIALIDAD_POR_DEFECTO } from '@/constants/constants';
import type {
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
  VeterinarioParaCita,
} from '@/interfaces';
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

export const getVeterinariosDeCentro = async (centroId: number): Promise<VeterinarioParaCita[]> => {
  const { data, error } = await supabase.rpc('veterinarios_de_centro', { p_centro_id: centroId });
  if (error) throw error;
  return data ?? [];
};

export const getVeterinariosIndependientes = async (): Promise<VeterinarioParaCita[]> => {
  const { data, error } = await supabase.rpc('veterinarios_independientes');
  if (error) throw error;
  return data ?? [];
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
      `id, mascota_id, fecha_hora, motivo, estado, sintomas_reportados,
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
      `id, nombre, direccion, comuna, telefono, es_prueba,
       horarios_centro ( dia_semana, abre, cierra, inicio_colacion, fin_colacion ),
       centro_especialidades ( especialidades ( nombre ) )`,
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
      .select('veterinarios ( id, perfiles!veterinarios_perfil_id_fkey ( nombre ), especialidades ( nombre ) )')
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
  const [centros, veterinarios, solicitudes] = await Promise.all([
    supabase.from('centros').select('id, nombre, comuna, creado_en').eq('estado_verificacion', 'pendiente'),
    supabase
      .from('veterinarios')
      .select(
        'id, creado_en, especialidad_otra, centro_solicitado_id, centro_mencionado, perfiles!veterinarios_perfil_id_fkey ( nombre ), especialidades ( nombre )',
      )
      .eq('estado_verificacion', 'pendiente'),
    supabase.from('solicitudes_centro').select('id, nombre_centro, comuna, creado_en').eq('estado', 'pendiente'),
  ]);
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
  const [resumen, solicitudes, mensajes, eliminaciones, solicitudesPlan] = await Promise.all([
    getResumenSuperadmin(),
    getSolicitudesPendientes(),
    getMensajesContacto(),
    getSolicitudesEliminacion(),
    getSolicitudesPlan(),
  ]);
  return { resumen, solicitudes, mensajes, eliminaciones, solicitudesPlan };
};
