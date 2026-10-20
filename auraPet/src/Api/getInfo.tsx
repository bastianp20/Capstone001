
// aquí van todas las consultas a la base de datos

//   3. Si hay error, lo lanza (throw) para que la pantalla lo muestre.
//   4. Transforma las filas al formato que la pantalla ya conocía.
//
// OJO: lo que cada persona puede ver lo deciden las reglas RLS de la base.
// Si una tabla aún no tiene reglas para un rol, la consulta devuelve [].

// Tipos que ya usaban las pantallas (formato "listo para mostrar").
import type {
  CitaProximaDueno,        // cita para el cuadradito del panel del dueño
  EstadoCita,              // "pendiente" | "confirmada" | ...
  HistorialRecienteItem,   // ítem de "historial reciente" del dueño
  Mascota,                 // mascota con los campos que muestra la app
  PreguntaFrecuente,       // pregunta + respuesta + cantidad de consultas
  SolicitudPendiente,      // centro o veterinario esperando aprobación
  SolicitudCentroDetalle,  // solicitud de /solicitar-centro, para revisarla
  SolicitudHistorial,      // solicitud ya aprobada o rechazada
  InfoVeterinario,         // barra superior del panel del veterinario
  Plan,
  PlanId,
  DetalleUsuario,
  DetalleUsuarioCrudo,
  DetalleCentro,
  DetalleCentroCrudo,
  SuscripcionCentro,
  HistorialSuscripcionItem,
  EstadoHistorialSuscripcion,
  FiltrosCitas,
  PaginaCitas,
  UrgenciaCita,            // "baja" | "media" | "alta" | "critica",
  ResumenSuperadmin,
  VeterinarioAsignaciones,
  CentroAdministrado,
  CentroDetalle,
  MiembroEquipo,
  CitaCentro,
  PacienteVeterinario,
  FichaPaciente,
  InicioVeterinarioDatos,
  HistorialDueno,
  CentroParaCita,
  VeterinarioParaCita,
  CentroListado,
  SuscripcionListada,
  DestinoDerivacion,
  Derivacion,
  TipoDestinoDerivacion,
  MensajeContacto,
} from "../interfaces";
// auí importamos supabase para poder hacer las consutas a la base de datos. 
import { supabase } from "../lib/supabase";
// Funciones para mostrar las fechas que vienen de la base.
import { nombreConComuna } from "../lib/centroVeterinario";
import { formatEdad } from "../lib/fichaPaciente";
import { calcularEdad, formatHorario, formatFechaCaja, formatFechaCorta, formatFechaHora, formatFechaLarga, formatHora12h, formatHora24, diaDelMesEnChile, fechaDentroDe, rangosDeFecha } from "../lib/fechas";
import { CARGOS_RESPONSABLE, DIAS_CONTROLES_PROXIMOS, ESTADO_VERIFICACION, ESTILO_ROL, MAX_ITEMS_PENDIENTES, MOTIVO_RECHAZO_SIN_DETALLE, MS_CREADO_YA_APROBADO, URGENCIAS_ALTAS } from "../constants";

// Pone la primera letra en mayúscula: "perro" -> "Perro".
const capitalize = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);


// =====================================================================
// PANEL DEL DUEÑO
// =====================================================================

// Las mascotas de un dueño.
export const getMascotasPorDueno = async (duenoId: string): Promise<Mascota[]> => {
  const { data, error } = await supabase          // "await" = esperar la respuesta de la base
    .from("mascotas")                             // de la tabla mascotas...
    .select("id, dueno_id, nombre, especie, raza, fecha_nacimiento, sexo, esterilizado, foto_url, peso_kg, alergias") // ...estas columnas...
    .eq("dueno_id", duenoId)                      // ...solo las de este dueño (where dueno_id = ...)
    .order("nombre");                             // ...ordenadas por nombre
  if (error) throw error;                         // si la base respondió con error, se avisa a la pantalla
  return (data ?? []).map((m) => ({               // por cada fila, armamos el objeto que usa la pantalla:
    id: m.id,                                     // id de la mascota
    duenoId: m.dueno_id,                          // la base usa snake_case (dueno_id); la app, camelCase
    nombre: m.nombre,
    especie: m.especie,
    raza: m.raza,
    fechaNacimiento: m.fecha_nacimiento,          // texto "2021-03-15" (o null si no se sabe)
    sexo: m.sexo,
    esterilizado: m.esterilizado,
    fotoUrl: m.foto_url,
    pesoKg: m.peso_kg,
    alergias: m.alergias,
  }));
};

// Las próximas citas de un dueño (las que todavía no pasan), con mascota y centro.
export const getProximasCitasDueno = async (duenoId: string, limite = 3): Promise<CitaProximaDueno[]> => {
  const { data, error } = await supabase
    .from("citas")                                // tabla citas
    .select(`
      id, mascota_id, fecha_hora, motivo, estado, urgencia, cancelada_por, motivo_cancelacion,
      mascotas!inner ( nombre, dueno_id ),
      centros ( nombre )
    `)                                            // + datos de su mascota y su centro (como un JOIN)
    .eq("mascotas.dueno_id", duenoId)             // solo citas de mascotas de este dueño (por eso el !inner)
    .gte("fecha_hora", new Date().toISOString())  // gte = "mayor o igual": desde ahora en adelante
    // Sin las que canceló el propio dueño, pero SÍ las que rechazó el veterinario
    // (cancelada_por = otro perfil), para que el dueño vea el motivo.
    .or(`estado.neq.cancelada,cancelada_por.neq.${duenoId}`)
    .order("fecha_hora")                          // la más próxima primero
    .limit(limite);                               // solo las primeras N
  if (error) throw error;
  const filas = data ?? [];
  return filas.map((c) => ({
    id: c.id,
    mascotaId: c.mascota_id,
    mascota: c.mascotas?.nombre ?? "Mascota desconocida",   // "?." por si viniera vacío
    centro: c.centros?.nombre ?? "Centro desconocido",
    ...formatFechaCaja(c.fecha_hora),             // agrega { dia: "10", mes: "SEP" }
    hora: formatHora24(c.fecha_hora),             // "10:30"
    puedeCancelar: c.estado === "pendiente" || c.estado === "confirmada",
    motivo: c.motivo,
    estado: c.estado,
    urgencia: c.urgencia ?? "baja",              // la urgencia puede no estar todavía (la pone la IA)
    // Rechazada = cancelada por alguien que no es el dueño (el veterinario, migración 18)
    rechazo: c.estado === "cancelada" && c.cancelada_por !== duenoId
      ? { motivo: c.motivo_cancelacion ?? MOTIVO_RECHAZO_SIN_DETALLE }
      : undefined,
  }));
};

// Lo último que pasó en el historial médico de TODAS las mascotas del dueño.
export const getHistorialRecienteDueno = async (duenoId: string, limite = 5): Promise<HistorialRecienteItem[]> => {
  const { data, error } = await supabase
    .from("registros_medicos")                    // tabla del historial
    .select("id, fecha, descripcion, mascotas!inner ( nombre, dueno_id )") // + nombre de la mascota
    .eq("mascotas.dueno_id", duenoId)             // solo mascotas de este dueño
    .order("fecha", { ascending: false })         // del más reciente al más antiguo
    .limit(limite);
  if (error) throw error;
  const filas = data ?? [];
  return filas.map((h) => ({
    id: h.id,
    mascota: h.mascotas?.nombre ?? "Mascota desconocida",
    descripcion: h.descripcion,
    fecha: formatFechaLarga(h.fecha),             // "2025-12-20" -> "20 dic 2025"
  }));
};


// =====================================================================
// PANEL DEL VETERINARIO
// =====================================================================

// Una cita tal como la muestra la agenda del veterinario.
export interface CitaAgendaItem {
  id: number;
  hora: string;           // "10:30 AM"
  fecha: string;          // "10/09 · 10:30" (la agenda trae citas de varios días)
  mascota: string;
  especie: string;
  raza: string;
  dueno: string;
  motivo: string;
  estado: EstadoCita;
  urgencia: UrgenciaCita;
}

// Busca la ficha de veterinario de la persona conectada y sus centros.
// Recibe el id de la CUENTA (uuid) y devuelve el id de VETERINARIO (número),
// que es el que usan la agenda y los pacientes.
export const getInfoVeterinario = async (perfilId: string): Promise<InfoVeterinario> => {
  const { data, error } = await supabase
    .from("veterinarios")
    .select("id, estado_verificacion, centro_solicitado_id, centro_mencionado, centro_mencionado_comuna, veterinario_centros ( centros ( nombre ) )")
    .eq("perfil_id", perfilId)                    // la ficha de esta cuenta
    .maybeSingle();                               // una fila o ninguna (si no existe, data = null, sin error)
  if (error) throw error;
  const fila = data;

  // Centro de AuraPet que pidió al registrarse (se le asigna cuando lo aprueban)
  let centroSolicitado: string | null = null;
  if (fila?.centro_solicitado_id) {
    const { data: centro } = await supabase.from("centros").select("nombre").eq("id", fila.centro_solicitado_id).maybeSingle();
    centroSolicitado = centro?.nombre ?? null;
  }

  return {
    id: fila?.id ?? null,                         // null si la cuenta no tiene ficha de veterinario
    centros: (fila?.veterinario_centros ?? [])    // [{ centros: { nombre } }, ...]
      .map((vc) => vc.centros?.nombre)            // -> ["Clínica VetSur", ...]
      .filter((nombre): nombre is string => Boolean(nombre)), // sin vacíos
    estado: fila?.estado_verificacion ?? null,
    centroSolicitado,
    centroMencionado: nombreConComuna(fila?.centro_mencionado ?? null, fila?.centro_mencionado_comuna ?? null),
  };
};

// Todas las citas asignadas a un veterinario, ordenadas por hora.
export const getAgendaVeterinario = async (veterinarioId: number): Promise<CitaAgendaItem[]> => {
  const { data, error } = await supabase
    .from("citas")
    .select(`
      id, fecha_hora, motivo, estado, urgencia,
      mascotas ( nombre, especie, raza, perfiles ( nombre ) )
    `)                                            // mascota y, a través de ella, el nombre del dueño
    .eq("veterinario_id", veterinarioId)          // solo las de este veterinario
    .order("fecha_hora");                         // de la más temprana a la más tarde
  if (error) throw error;
  const filas = data ?? [];
  return filas.map((c) => ({
    id: c.id,
    hora: formatHora12h(c.fecha_hora),            // "2026-09-10T13:30:00Z" -> "10:30 AM"
    fecha: formatFechaHora(c.fecha_hora),         // "10/09 · 10:30"
    mascota: c.mascotas?.nombre ?? "Mascota desconocida",
    especie: c.mascotas ? capitalize(c.mascotas.especie) : "—",
    raza: c.mascotas?.raza ?? "—",
    dueno: c.mascotas?.perfiles?.nombre ?? "Dueño desconocido",
    motivo: c.motivo,
    estado: c.estado,
    urgencia: c.urgencia ?? "baja",              // sin urgencia aún -> se muestra como baja
  }));
};

// Los pacientes de un veterinario: cada mascota UNA vez, con cuántas visitas
// tuvo y la fecha de la última. Solo cuentan las citas que el veterinario
// aceptó: una solicitud pendiente o cancelada/rechazada no lo hace paciente.
export const getPacienteByVeterinarioId = async (veterinarioId: number): Promise<PacienteVeterinario[]> => {
  const { data, error } = await supabase
    .from("citas")
    .select("mascota_id, fecha_hora, mascotas ( nombre, especie, raza, fecha_nacimiento, peso_kg, alergias, perfiles ( nombre ) )")
    .eq("veterinario_id", veterinarioId)
    .in("estado", ["confirmada", "en_curso", "completada"])
    .order("fecha_hora", { ascending: false });   // la más reciente primero
  if (error) throw error;

  // Agrupamos las citas por mascota: Map<idMascota, datos del paciente>.
  const pacientes = new Map<number, PacienteVeterinario>();
  const filas = data ?? [];
  for (const c of filas) {                        // recorremos cada cita
    const existente = pacientes.get(c.mascota_id);
    if (existente) {                              // si la mascota ya estaba, solo sumamos una visita
      existente.totalVisitas += 1;
      continue;
    }
    pacientes.set(c.mascota_id, {                 // si es la primera vez que aparece, la agregamos
      id: c.mascota_id,
      nombre: c.mascotas?.nombre ?? "Mascota desconocida",
      especie: c.mascotas ? capitalize(c.mascotas.especie) : "—",
      raza: c.mascotas?.raza ?? "—",
      dueno: c.mascotas?.perfiles?.nombre ?? "Dueño desconocido",
      ultimaVisita: formatFechaHora(c.fecha_hora), // como vienen de la más reciente, la primera es la última visita
      totalVisitas: 1,
      fechaNacimiento: c.mascotas?.fecha_nacimiento ?? null,
      pesoKg: c.mascotas?.peso_kg ?? null,
      alergias: c.mascotas?.alergias ?? null,
    });
  }
  // Pasamos el Map a lista y ordenamos alfabéticamente.
  return Array.from(pacientes.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
};


// La ficha completa de un paciente: datos de la mascota y del dueño (las
// políticas de la migración 12 ya los dejan ver) + el historial completo,
// que llega por la función historial_de_paciente (migración 19) porque
// incluye registros y nombres de otros veterinarios y centros.
export const getFichaPaciente = async (mascotaId: number): Promise<FichaPaciente> => {
  const [mascota, historial] = await Promise.all([
    supabase
      .from("mascotas")
      .select("id, nombre, especie, raza, sexo, fecha_nacimiento, peso_kg, alergias, condiciones_cronicas, esterilizado, microchip, perfiles ( nombre, telefono )")
      .eq("id", mascotaId)
      .single(),
    supabase.rpc("historial_de_paciente", { p_mascota_id: mascotaId }),
  ]);
  if (mascota.error) throw mascota.error;
  if (historial.error) throw historial.error;

  const m = mascota.data;
  return {
    id: m.id,
    nombre: m.nombre,
    especie: capitalize(m.especie),
    raza: m.raza ?? "—",
    sexo: m.sexo,
    edad: calcularEdad(m.fecha_nacimiento),
    fechaNacimiento: m.fecha_nacimiento,
    dueno: m.perfiles?.nombre ?? "Dueño desconocido",
    telefonoDueno: m.perfiles?.telefono ?? null,
    datosClinicos: {
      pesoKg: m.peso_kg,
      alergias: m.alergias,
      condicionesCronicas: m.condiciones_cronicas,
      esterilizado: m.esterilizado,
      microchip: m.microchip,
    },
    historial: (historial.data ?? []).map((r) => ({
      id: r.id,
      fecha: formatFechaLarga(r.fecha),           // "2025-12-20" -> "20 dic 2025"
      tipo: r.tipo,
      descripcion: r.descripcion,
      tratamiento: r.tratamiento,
      proximaDosis: r.proxima_dosis,
      veterinario: r.veterinario,
      centro: r.centro,
      esMio: r.es_mio,
    })),
  };
};

// =====================================================================
// PANEL DEL SUPERADMIN
// =====================================================================

// Los números de las tarjetas del Resumen. Solo cuenta filas (head: true),
// no descarga datos, así que es liviano aunque la base crezca.
export const getResumenSuperadmin = async (): Promise<ResumenSuperadmin> => {
  const contar = async (consulta: PromiseLike<{ count: number | null; error: unknown }>) => {
    const { count, error } = await consulta;
    if (error) throw error;
    return count ?? 0;
  };
  const perfilesActivos = () =>
    supabase.from("perfiles").select("*", { count: "exact", head: true }).is("desactivado_en", null);
  const vets = () => supabase.from("veterinarios").select("*", { count: "exact", head: true });

  // "Hoy" según la hora del computador (de 00:00 a 23:59)
  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);
  const inicioManana = new Date(inicioHoy);
  inicioManana.setDate(inicioManana.getDate() + 1);
  const citasHoy = () =>
    supabase
      .from("citas")
      .select("*", { count: "exact", head: true })
      .gte("fecha_hora", inicioHoy.toISOString())
      .lt("fecha_hora", inicioManana.toISOString())
      .neq("estado", "cancelada");

  // Todas las consultas en paralelo
  const [
    duenos, veterinariosCuenta, superadmins,
    centrosActivos, centrosPrueba,
    vetsTotal, vetsVerificados, vetsPendientes,
    citasTotal, citasUrgentes,
  ] = await Promise.all([
    contar(perfilesActivos().eq("rol", "dueno")),
    contar(perfilesActivos().eq("rol", "veterinario")),
    contar(perfilesActivos().eq("rol", "superadmin")),
    contar(supabase.from("centros").select("*", { count: "exact", head: true }).eq("estado_verificacion", "aprobado")),
    contar(supabase.from("centros").select("*", { count: "exact", head: true }).eq("estado_verificacion", "aprobado").eq("es_prueba", true)),
    contar(vets()),
    contar(vets().eq("estado_verificacion", "aprobado")),
    contar(vets().eq("estado_verificacion", "pendiente")),
    contar(citasHoy()),
    contar(citasHoy().in("urgencia", ["alta", "critica"])),
  ]);

  return {
    usuarios: { total: duenos + veterinariosCuenta + superadmins, duenos, veterinarios: veterinariosCuenta, superadmins },
    centros: { activos: centrosActivos, dePrueba: centrosPrueba },
    veterinarios: { total: vetsTotal, verificados: vetsVerificados, pendientes: vetsPendientes },
    citasHoy: { total: citasTotal, urgentes: citasUrgentes },
  };
};

// Todos los veterinarios con los centros donde atienden (sección "Centros y veterinarios").
export const getAsignacionesVeterinarios = async (): Promise<VeterinarioAsignaciones[]> => {
  const { data, error } = await supabase
    .from("veterinarios")
    .select(`
      id, numero_colegiado, estado_verificacion, centro_solicitado_id, centro_mencionado, centro_mencionado_comuna,
      perfiles!veterinarios_perfil_id_fkey ( nombre, es_prueba ),
      especialidades ( nombre ),
      veterinario_centros ( centros ( id, nombre, es_prueba ) )
    `);
  if (error) throw error;

  // Nombres de los centros que pidieron al registrarse (aún sin asignar)
  const ids = [...new Set((data ?? []).map((v) => v.centro_solicitado_id).filter((id): id is number => id !== null))];
  const nombreCentro = new Map<number, string>();
  if (ids.length) {
    const { data: cs, error: e } = await supabase.from("centros").select("id, nombre").in("id", ids);
    if (e) throw e;
    for (const c of cs ?? []) nombreCentro.set(c.id, c.nombre);
  }

  return (data ?? [])
    .map((v) => ({
      id: v.id,
      centroSolicitado: v.centro_solicitado_id ? nombreCentro.get(v.centro_solicitado_id) ?? null : null,
      centroMencionado: nombreConComuna(v.centro_mencionado, v.centro_mencionado_comuna),
      nombre: v.perfiles?.nombre ?? "Veterinario sin cuenta",
      especialidad: v.especialidades?.nombre ?? null,
      numeroColegiado: v.numero_colegiado,
      estado: v.estado_verificacion,
      esPrueba: v.perfiles?.es_prueba ?? false,
      centros: (v.veterinario_centros ?? [])
        .map((vc) => vc.centros)
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
        .map((c) => ({ id: c.id, nombre: c.nombre, esPrueba: c.es_prueba }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre)),
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
};

// Todas las citas de la plataforma (solo superadmin), con búsqueda, filtros y
// paginación. Igual idea que getAllUsers: la base hace el trabajo con la
// función listar_citas (migración 22) y devuelve también el total, para paginar.
export const getAllCitas = async (filtros: FiltrosCitas): Promise<PaginaCitas> => {
  const { inicioHoy, inicioManana } = rangosDeFecha();
  const ahora = new Date().toISOString();
  // Qué rango de fechas y en qué orden, según el chip elegido
  const rango = {
    proximas: { desde: ahora, hasta: undefined, orden: "proximas" },
    hoy: { desde: inicioHoy.toISOString(), hasta: inicioManana.toISOString(), orden: "proximas" },
    pasadas: { desde: undefined, hasta: ahora, orden: "recientes" },
    todas: { desde: undefined, hasta: undefined, orden: "recientes" },
  }[filtros.rango];

  const { data, error } = await supabase.rpc("listar_citas", {
    p_busqueda: filtros.busqueda.trim() || undefined,
    p_estado: filtros.estado ?? undefined,
    p_urgencia: filtros.urgencia ?? undefined,
    p_desde: rango.desde,
    p_hasta: rango.hasta,
    p_orden: rango.orden,
    p_limite: filtros.porPagina,
    p_offset: (filtros.pagina - 1) * filtros.porPagina,
  });
  if (error) throw error;
  const filas = data ?? [];
  return {
    total: filas[0]?.total ?? 0,                 // la base repite el total en cada fila
    citas: filas.map((c) => ({
      id: c.id,
      mascota: c.mascota,
      dueno: c.dueno ?? "Dueño desconocido",
      veterinario: c.veterinario ?? "Sin asignar",
      centro: c.centro,
      fechaHora: formatFechaHora(c.fecha_hora),   // "10/09 · 10:30"
      estado: c.estado,
      urgencia: c.urgencia ?? "baja",            // sin urgencia aún -> se muestra como baja
      motivo: c.motivo,
      esPrueba: c.es_prueba,
    })),
  };
};

// Centros y veterinarios que esperan aprobación (reemplaza SolicitudPendiente.ts).
export const getSolicitudesPendientes = async (): Promise<SolicitudPendiente[]> => {
  // Pedimos las dos listas al mismo tiempo (Promise.all = en paralelo, más rápido).
  const [centros, veterinarios, solicitudesCentro] = await Promise.all([
    supabase
      .from("centros")
      .select("id, nombre, creado_en")
      .eq("estado_verificacion", "pendiente"),
    supabase
      .from("veterinarios")
      .select("id, creado_en, especialidad_otra, centro_solicitado_id, centro_mencionado, centro_mencionado_comuna, perfiles!veterinarios_perfil_id_fkey ( nombre ), especialidades ( nombre )")
      .eq("estado_verificacion", "pendiente"),
    // Centros que pidieron unirse desde /solicitar-centro (migración 20)
    supabase
      .from("solicitudes_centro")
      .select("id, nombre_centro, creado_en")
      .eq("estado", "pendiente"),
  ]);
  if (centros.error) throw centros.error;
  if (veterinarios.error) throw veterinarios.error;
  if (solicitudesCentro.error) throw solicitudesCentro.error;

  // Nombres de los centros de AuraPet donde dicen trabajar los veterinarios
  const idsCentros = [...new Set((veterinarios.data ?? []).map((v) => v.centro_solicitado_id).filter((id): id is number => id !== null))];
  const nombreCentro = new Map<number, string>();
  if (idsCentros.length) {
    const { data, error } = await supabase.from("centros").select("id, nombre").in("id", idsCentros);
    if (error) throw error;
    for (const c of data ?? []) nombreCentro.set(c.id, c.nombre);
  }
  // "Etología · Clínica San Roque" / "Independiente" / "Centro X, Ñuñoa (no está en AuraPet)"
  const detalleVeterinario = (v: NonNullable<typeof veterinarios.data>[number]) => {
    const especialidad = v.especialidades?.nombre ?? v.especialidad_otra ?? "Medicina general";
    const lugar = v.centro_solicitado_id
      ? nombreCentro.get(v.centro_solicitado_id) ?? "Centro de AuraPet"
      : v.centro_mencionado
        ? `${v.centro_mencionado}${v.centro_mencionado_comuna ? `, ${v.centro_mencionado_comuna}` : ""} (no está en AuraPet)`
        : "Independiente";
    return `${especialidad} · ${lugar}`;
  };

  // Juntamos ambas en una sola lista con el mismo formato.
  const lista = [
    ...(centros.data ?? []).map((c) => ({
      id: `centro-${c.id}`,                       // prefijo para que no choquen los ids de centros y veterinarios
      nombre: c.nombre,
      tipo: "centro" as const,
      creadoEn: c.creado_en,
    })),
    ...(veterinarios.data ?? []).map((v) => ({
      id: `veterinario-${v.id}`,
      nombre: v.perfiles?.nombre ?? "Veterinario sin nombre",
      tipo: "veterinario" as const,
      creadoEn: v.creado_en,
      detalle: detalleVeterinario(v),
    })),
    ...(solicitudesCentro.data ?? []).map((s) => ({
      id: `solicitud_centro-${s.id}`,
      nombre: s.nombre_centro,
      tipo: "solicitud_centro" as const,
      creadoEn: s.creado_en,
    })),
  ];
  return lista
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))     // las más recientes primero
    .map(({ creadoEn, ...s }) => ({ ...s, fechaRegistro: formatFechaCorta(creadoEn) })); // "23/07/2026"
};


// Solicitudes ya resueltas (aprobadas o rechazadas), de las tres fuentes,
// con quién las revisó y cuándo. Los centros y veterinarios que el superadmin
// creó ya aprobados no cuentan: nunca fueron una solicitud.
export const getHistorialAprobaciones = async (): Promise<SolicitudHistorial[]> => {
  const [centros, veterinarios, solicitudes] = await Promise.all([
    supabase
      .from("centros")
      .select("id, nombre, estado_verificacion, revisado_por, revisado_en, motivo_rechazo, creado_en")
      .neq("estado_verificacion", "pendiente")
      .not("revisado_en", "is", null),
    supabase
      .from("veterinarios")
      .select("id, estado_verificacion, revisado_por, revisado_en, motivo_rechazo, creado_en, perfiles!veterinarios_perfil_id_fkey ( nombre )")
      .neq("estado_verificacion", "pendiente")
      .not("revisado_en", "is", null),
    supabase
      .from("solicitudes_centro")
      .select("id, nombre_centro, estado, revisado_por, revisado_en, motivo_rechazo")
      .neq("estado", "pendiente"),
  ]);
  if (centros.error) throw centros.error;
  if (veterinarios.error) throw veterinarios.error;
  if (solicitudes.error) throw solicitudes.error;

  // ¿Se aprobó en el mismo momento en que se creó? Entonces no fue una solicitud
  const fueSolicitud = (creado: string, revisado: string) =>
    new Date(revisado).getTime() - new Date(creado).getTime() > MS_CREADO_YA_APROBADO;

  type Base = Omit<SolicitudHistorial, "revisadoPor" | "fecha"> & { revisadoPorId: string | null };
  const lista: Base[] = [
    ...(centros.data ?? [])
      .filter((c) => fueSolicitud(c.creado_en, c.revisado_en!))
      .map((c) => ({
        id: `centro-${c.id}`, tipo: "centro" as const, nombre: c.nombre,
        decision: c.estado_verificacion as SolicitudHistorial["decision"],
        revisadoPorId: c.revisado_por, fechaISO: c.revisado_en!, motivo: c.motivo_rechazo,
      })),
    ...(veterinarios.data ?? [])
      .filter((v) => fueSolicitud(v.creado_en, v.revisado_en!))
      .map((v) => ({
        id: `veterinario-${v.id}`, tipo: "veterinario" as const, nombre: v.perfiles?.nombre ?? "Veterinario sin nombre",
        decision: v.estado_verificacion as SolicitudHistorial["decision"],
        revisadoPorId: v.revisado_por, fechaISO: v.revisado_en!, motivo: v.motivo_rechazo,
      })),
    ...(solicitudes.data ?? []).map((s) => ({
      id: `solicitud_centro-${s.id}`, tipo: "solicitud_centro" as const, nombre: s.nombre_centro,
      decision: s.estado as SolicitudHistorial["decision"],
      revisadoPorId: s.revisado_por, fechaISO: s.revisado_en ?? "", motivo: s.motivo_rechazo,
    })),
  ];

  // Nombres de quienes revisaron (una sola consulta para todos)
  const ids = [...new Set(lista.map((s) => s.revisadoPorId).filter((id): id is string => Boolean(id)))];
  const nombres = new Map<string, string>();
  if (ids.length) {
    const { data, error } = await supabase.from("perfiles").select("id, nombre").in("id", ids);
    if (error) throw error;
    for (const p of data ?? []) nombres.set(p.id, p.nombre);
  }

  return lista
    .sort((a, b) => b.fechaISO.localeCompare(a.fechaISO))         // lo más reciente primero
    .map(({ revisadoPorId, ...s }) => ({
      ...s,
      revisadoPor: (revisadoPorId && nombres.get(revisadoPorId)) || "—",
      fecha: s.fechaISO ? formatFechaCorta(s.fechaISO) : "—",
    }));
};

// Todo lo que envió un centro en /solicitar-centro, para que el superadmin
// lo revise antes de aprobar. Las especialidades vienen como ids y se
// traducen a nombres con el catálogo.
export const getSolicitudCentro = async (id: number): Promise<SolicitudCentroDetalle> => {
  const [solicitud, especialidades] = await Promise.all([
    supabase.from("solicitudes_centro").select("*").eq("id", id).single(),
    supabase.from("especialidades").select("id, nombre"),
  ]);
  if (solicitud.error) throw solicitud.error;
  if (especialidades.error) throw especialidades.error;

  const s = solicitud.data;
  const nombrePorId = new Map((especialidades.data ?? []).map((e) => [e.id, e.nombre]));
  return {
    id: s.id,
    nombreCentro: s.nombre_centro,
    direccion: s.direccion,
    comuna: s.comuna,
    telefonoCentro: s.telefono_centro,
    especialidades: s.especialidad_ids.map((e) => nombrePorId.get(e)).filter((n): n is string => Boolean(n)),
    sitioWeb: s.sitio_web,
    nombreResponsable: s.nombre_responsable,
    cargo: CARGOS_RESPONSABLE.find((c) => c.valor === s.cargo)?.texto ?? s.cargo,
    correo: s.correo,
    telefonoResponsable: s.telefono_responsable,
    mensaje: s.mensaje,
    fecha: formatFechaCorta(s.creado_en),
  };
};

// =====================================================================
// PÚBLICO (Home y Contacto)
// =====================================================================

// Las preguntas frecuentes. La "moda" (categorías con más mensajes de contacto)
// la calcula la base con la función preguntas_frecuentes(limite) — ver
// auraPet-Backend/supabase/migrations/03_preguntas_frecuentes_sin_mensajes.sql.
export const getPreguntasFrecuentes = async (limite = 6): Promise<PreguntaFrecuente[]> => {
  const { data, error } = await supabase.rpc("preguntas_frecuentes", { limite }); // rpc = llamar una función de la base
  if (error) throw error;
  return data ?? [];
};

// Especialidades para los chips del modal de crear profesional.
export const getEspecialidades = async () => {
  const { data, error } = await supabase
    .from("especialidades")
    .select("id, nombre")
    .order("nombre");
  if (error) throw error;
  return data;
};

// Centros aprobados para el selector del modal.
// El superadmin también ve los de prueba (es_prueba = true), los demás no.
export const getCentrosSelector = async () => {
  const { data, error } = await supabase
    .from("centros")
    .select("id, nombre, es_prueba")
    .eq("estado_verificacion", "aprobado")
    .order("nombre");
  if (error) throw error;
  return data;
};

export const getAllUsers = async () => {
  // con la funcion de rpc (remote procedure call) o llamada remota a un procedimiento, podemos llamar a la funcion listar_usuarios que creamos en la base de datos. 
  const { data, error } = await supabase.rpc("listar_usuarios"); 
  if (error) throw error; 
  return data ?? []; 
}

// =====================================================================
// ADMIN DE CENTRO
// =====================================================================

// Los centros que administra la persona conectada (sus filas en admins_centro).
export const getMisCentrosAdmin = async (perfilId: string): Promise<CentroAdministrado[]> => {
  const { data, error } = await supabase
    .from("admins_centro")
    .select("centros ( id, nombre )")
    .eq("perfil_id", perfilId);
  if (error) throw error;
  return (data ?? [])
    .map((fila) => fila.centros)
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
};

// Datos del centro con sus horarios y especialidades.
export const getCentroDetalle = async (centroId: number): Promise<CentroDetalle> => {
  const { data, error } = await supabase
    .from("centros")
    .select(`
      id, nombre, direccion, comuna, telefono, es_prueba,
      horarios_centro ( dia_semana, abre, cierra, inicio_colacion, fin_colacion ),
      centro_especialidades ( especialidades ( nombre ) )
    `)
    .eq("id", centroId)
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
        abre: h.abre.slice(0, 5),               // "09:00:00" -> "09:00"
        cierra: h.cierra.slice(0, 5),
        inicioColacion: h.inicio_colacion?.slice(0, 5) ?? null,
        finColacion: h.fin_colacion?.slice(0, 5) ?? null,
      }))
      .sort((a, b) => a.diaSemana - b.diaSemana),
  };
};

// Equipo del centro: sus veterinarios y sus administradores.
export const getEquipoCentro = async (centroId: number): Promise<MiembroEquipo[]> => {
  const [vets, admins] = await Promise.all([
    supabase
      .from("veterinario_centros")
      .select("veterinarios ( perfil_id, perfiles!veterinarios_perfil_id_fkey ( nombre ), especialidades ( nombre ) )")
      .eq("centro_id", centroId),
    supabase
      .from("admins_centro")
      .select("perfil_id, perfiles!admins_centro_perfil_id_fkey ( nombre )") // admins_centro tiene 2 relaciones con perfiles
      .eq("centro_id", centroId),
  ]);
  if (vets.error) throw vets.error;
  if (admins.error) throw admins.error;

  const equipo: MiembroEquipo[] = [
    ...(vets.data ?? [])
      .map((fila) => fila.veterinarios)
      .filter((v): v is NonNullable<typeof v> => Boolean(v))
      .map((v) => ({
        perfilId: v.perfil_id,
        nombre: v.perfiles?.nombre ?? "Veterinario sin cuenta",
        tipo: "veterinario" as const,
        detalle: v.especialidades?.nombre ?? "Medicina general",
      })),
    ...(admins.data ?? []).map((a) => ({
      perfilId: a.perfil_id,
      nombre: a.perfiles?.nombre ?? "Sin nombre",
      tipo: "admin" as const,
      detalle: "Administrador",
    })),
  ];
  return equipo.sort((a, b) => a.nombre.localeCompare(b.nombre));
};

// Todas las citas del centro, de la más nueva a la más antigua.
export const getCitasCentro = async (centroId: number): Promise<CitaCentro[]> => {
  const { data, error } = await supabase
    .from("citas")
    .select(`
      id, fecha_hora, motivo, estado, urgencia,
      mascotas ( nombre, perfiles ( nombre ) ),
      veterinarios ( perfiles!veterinarios_perfil_id_fkey ( nombre ) )
    `)
    .eq("centro_id", centroId)
    .order("fecha_hora", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((c) => ({
    id: c.id,
    fechaIso: c.fecha_hora,
    fechaHora: formatFechaHora(c.fecha_hora),
    mascota: c.mascotas?.nombre ?? "Mascota desconocida",
    dueno: c.mascotas?.perfiles?.nombre ?? "Dueño desconocido",
    veterinario: c.veterinarios?.perfiles?.nombre ?? "Sin asignar",
    motivo: c.motivo,
    estado: c.estado,
    urgencia: c.urgencia ?? "baja",
  }));
};

// =====================================================================
// INICIO DEL VETERINARIO
// =====================================================================

// Todo lo que muestra la pantalla de inicio del veterinario.
// Son 6 consultas pequeñas en paralelo (Promise.all), no una gigante.
export const getInicioVeterinario = async (veterinarioId: number): Promise<InicioVeterinarioDatos> => {
  const { inicioHoy, inicioManana, inicioMes, inicioMesSiguiente, diasDelMes } = rangosDeFecha();
  const hoyISO = fechaDentroDe(0);
  const limiteControles = fechaDentroDe(DIAS_CONTROLES_PROXIMOS);

  const [citasHoy, porConfirmar, urgencias, controles, recetas, delMes] = await Promise.all([
    // 1. Citas de hoy (sin las canceladas), con mascota y dueño
    supabase
      .from("citas")
      .select(`
        id, fecha_hora, motivo, sintomas_reportados, estado, urgencia_sugerida, urgencia, mascota_id,
        mascotas ( nombre, especie, raza, fecha_nacimiento, alergias, condiciones_cronicas, perfiles ( nombre, telefono ) )
      `)
      .eq("veterinario_id", veterinarioId)
      .gte("fecha_hora", inicioHoy.toISOString())
      .lt("fecha_hora", inicioManana.toISOString())
      .neq("estado", "cancelada")
      .order("fecha_hora"),

    // 2. Cuántas citas pendientes tiene de hoy en adelante (solo el número)
    supabase
      .from("citas")
      .select("*", { count: "exact", head: true })
      .eq("veterinario_id", veterinarioId)
      .eq("estado", "pendiente")
      .gte("fecha_hora", inicioHoy.toISOString()),

    // 3. Urgencias sugeridas por la IA que el veterinario aún no confirma
    supabase
      .from("citas")
      .select("id, fecha_hora, urgencia_sugerida, mascotas ( nombre )")
      .eq("veterinario_id", veterinarioId)
      .is("urgencia", null)
      .in("urgencia_sugerida", URGENCIAS_ALTAS)
      .in("estado", ["pendiente", "confirmada"])
      .gte("fecha_hora", inicioHoy.toISOString())
      .order("fecha_hora")
      .limit(MAX_ITEMS_PENDIENTES),

    // 4. Controles de los próximos días (de sus recetas)
    supabase
      .from("recetas")
      .select("id, proximo_control, mascotas ( nombre )")
      .eq("veterinario_id", veterinarioId)
      .gte("proximo_control", hoyISO)
      .lte("proximo_control", limiteControles)
      .order("proximo_control")
      .limit(MAX_ITEMS_PENDIENTES),

    // 5. Sus últimas recetas
    supabase
      .from("recetas")
      .select("id, creada_en, mascotas ( nombre )")
      .eq("veterinario_id", veterinarioId)
      .order("creada_en", { ascending: false })
      .limit(MAX_ITEMS_PENDIENTES),

    // 6. Atenciones completadas este mes (solo la fecha, para el gráfico)
    supabase
      .from("citas")
      .select("fecha_hora")
      .eq("veterinario_id", veterinarioId)
      .eq("estado", "completada")
      .gte("fecha_hora", inicioMes.toISOString())
      .lt("fecha_hora", inicioMesSiguiente.toISOString()),
  ]);

  for (const r of [citasHoy, porConfirmar, urgencias, controles, recetas, delMes]) {
    if (r.error) throw r.error;
  }

  // Contamos las atenciones por día: [3, 5, 0, ...] (posición 0 = día 1)
  const atencionesPorDia = Array.from({ length: diasDelMes }, () => 0);
  for (const c of delMes.data ?? []) {
    atencionesPorDia[diaDelMesEnChile(c.fecha_hora) - 1] += 1;
  }

  return {
    citasHoy: (citasHoy.data ?? []).map((c) => ({
      id: c.id,
      hora: formatHora24(c.fecha_hora),
      motivo: c.motivo,
      sintomas: c.sintomas_reportados ?? [],
      estado: c.estado,
      urgenciaSugerida: c.urgencia_sugerida,
      urgencia: c.urgencia,
      mascotaId: c.mascota_id,
      mascota: c.mascotas?.nombre ?? "Mascota desconocida",
      especie: c.mascotas ? capitalize(c.mascotas.especie) : "—",
      raza: c.mascotas?.raza ?? null,
      fechaNacimiento: c.mascotas?.fecha_nacimiento ?? null,
      alergias: c.mascotas?.alergias ?? null,
      condicionesCronicas: c.mascotas?.condiciones_cronicas ?? null,
      dueno: c.mascotas?.perfiles?.nombre ?? "Dueño desconocido",
      telefonoDueno: c.mascotas?.perfiles?.telefono ?? null,
    })),
    porConfirmar: porConfirmar.count ?? 0,
    urgenciasPorConfirmar: (urgencias.data ?? [])
      .filter((c) => c.urgencia_sugerida)
      .map((c) => ({
        citaId: c.id,
        mascota: c.mascotas?.nombre ?? "Mascota desconocida",
        fechaHora: formatFechaHora(c.fecha_hora),
        urgenciaSugerida: c.urgencia_sugerida!,
      })),
    controlesProximos: (controles.data ?? [])
      .filter((r) => r.proximo_control)
      .map((r) => ({ recetaId: r.id, mascota: r.mascotas?.nombre ?? "Mascota", fecha: r.proximo_control! })),
    recetasRecientes: (recetas.data ?? []).map((r) => ({
      id: r.id,
      mascota: r.mascotas?.nombre ?? "Mascota",
      creadaEn: r.creada_en,
    })),
    atencionesPorDia,
  };
};

// =====================================================================
// PANEL DEL DUEÑO: historial completo y solicitar cita
// =====================================================================

// Todo el historial médico y las recetas de las mascotas del dueño.
// (Las políticas de la migración 13 ya filtran: solo llegan las de SUS mascotas.)
export const getHistorialDueno = async (): Promise<HistorialDueno> => {
  const [registros, recetas] = await Promise.all([
    supabase
      .from("registros_medicos")
      .select("id, mascota_id, fecha, tipo, descripcion, tratamiento, proxima_dosis, mascotas ( nombre )")
      .order("fecha", { ascending: false }),
    supabase
      .from("recetas")
      .select("id, mascota_id, creada_en, indicaciones, proximo_control, mascotas ( nombre ), receta_medicamentos ( nombre, dosis, frecuencia, duracion )")
      .order("creada_en", { ascending: false }),
  ]);
  if (registros.error) throw registros.error;
  if (recetas.error) throw recetas.error;

  return {
    registros: (registros.data ?? []).map((r) => ({
      id: r.id,
      mascotaId: r.mascota_id,
      mascota: r.mascotas?.nombre ?? "Mascota",
      fecha: formatFechaLarga(r.fecha),
      tipo: r.tipo,
      descripcion: r.descripcion,
      tratamiento: r.tratamiento,
      proximaDosis: r.proxima_dosis ? formatFechaLarga(r.proxima_dosis) : null,
    })),
    recetas: (recetas.data ?? []).map((r) => ({
      id: r.id,
      mascotaId: r.mascota_id,
      mascota: r.mascotas?.nombre ?? "Mascota",
      fecha: formatFechaCorta(r.creada_en),
      indicaciones: r.indicaciones,
      proximoControl: r.proximo_control ? formatFechaLarga(r.proximo_control) : null,
      medicamentos: r.receta_medicamentos ?? [],
    })),
  };
};

// Centros donde se puede pedir hora, con su horario de atención.
// (La base solo muestra los aprobados y no de pruebas.)
export const getCentrosParaCita = async (): Promise<CentroParaCita[]> => {
  const { data, error } = await supabase
    .from("centros")
    .select("id, nombre, comuna, es_prueba, horarios_centro ( dia_semana, abre, cierra, inicio_colacion, fin_colacion )")
    .eq("estado_verificacion", "aprobado")
    .order("nombre");
  if (error) throw error;
  return (data ?? []).map((c) => ({
    id: c.id,
    nombre: c.nombre,
    comuna: c.comuna,
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

// Veterinarios verificados de un centro (función veterinarios_de_centro, migración 13).
export const getVeterinariosDeCentro = async (centroId: number): Promise<VeterinarioParaCita[]> => {
  const { data, error } = await supabase.rpc("veterinarios_de_centro", { p_centro_id: centroId });
  if (error) throw error;
  return data ?? [];
};

// Todos los centros (aprobados, pendientes, rechazados, reales y de prueba)
// para la sección "Centros" del superadmin, con cuántos veterinarios tiene cada uno.
export const getCentrosSuperadmin = async (): Promise<CentroListado[]> => {
  const { data, error } = await supabase
    .from("centros")
    .select("id, nombre, direccion, comuna, telefono, estado_verificacion, es_prueba, creado_en, veterinario_centros ( count )")
    .order("nombre");
  if (error) throw error;
  return (data ?? []).map((c) => ({
    id: c.id,
    nombre: c.nombre,
    direccion: c.direccion,
    comuna: c.comuna,
    telefono: c.telefono,
    estado: c.estado_verificacion,
    esPrueba: c.es_prueba,
    veterinarios: c.veterinario_centros?.[0]?.count ?? 0, // "( count )" llega como [{ count: 3 }]
    creadoEn: c.creado_en,
  }));
};

// =====================================================================
// SUSCRIPCIÓN DEL CENTRO (migración 24)
// =====================================================================

// Los planes, del más barato al más caro
export const getPlanes = async (): Promise<Plan[]> => {
  const { data, error } = await supabase.from("planes").select("id, nombre, precio_mensual, limite_veterinarios, orden").order("orden");
  if (error) throw error;
  return (data ?? []).map((p) => ({
    id: p.id as PlanId,
    nombre: p.nombre,
    precioMensual: p.precio_mensual,
    limiteVeterinarios: p.limite_veterinarios,
  }));
};

// Plan, estado, fechas y uso real del centro. La base calcula el uso
// (resumen_suscripcion) y revisa que quien pregunta administre el centro.
export const getSuscripcionCentro = async (centroId: number, planes: Plan[]): Promise<SuscripcionCentro | null> => {
  const { data, error } = await supabase.rpc("resumen_suscripcion", { p_centro_id: centroId });
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
    planSolicitado: (s.plan_solicitado as PlanId | null) ?? null,
  };
};

// Movimientos de la suscripción (activaciones, solicitudes, cambios)
export const getHistorialSuscripcion = async (centroId: number): Promise<HistorialSuscripcionItem[]> => {
  const { data, error } = await supabase
    .from("historial_suscripcion")
    .select("id, accion, detalle, estado, creado_en")
    .eq("centro_id", centroId)
    .order("creado_en", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((h) => ({
    id: h.id,
    fecha: formatFechaCorta(h.creado_en),
    accion: h.accion,
    detalle: h.detalle,
    estado: h.estado as EstadoHistorialSuscripcion,
  }));
};

// =====================================================================
// DETALLE COMPLETO DE UN USUARIO (solo superadmin) — migración 25
// =====================================================================
// La base junta todo en una sola llamada (detalle_usuario, devuelve jsonb);
// aquí solo se le da el formato que muestra el modal.
export const getDetalleUsuario = async (perfilId: string): Promise<DetalleUsuario> => {
  const { data, error } = await supabase.rpc("detalle_usuario", { p_perfil_id: perfilId });
  if (error) throw error;
  const d = data as unknown as DetalleUsuarioCrudo;
  const centro = (c: DetalleUsuarioCrudo["centros_atiende"][number]) => ({ id: c.id, nombre: c.nombre, comuna: c.comuna, esPrueba: c.es_prueba });

  return {
    cuenta: {
      id: d.cuenta.id,
      nombre: d.cuenta.nombre,
      email: d.cuenta.email,
      rol: d.cuenta.rol,
      telefono: d.cuenta.telefono,
      esPrueba: d.cuenta.es_prueba,
      activa: d.cuenta.desactivado_en === null,
      registro: formatFechaCorta(d.cuenta.creado_en),
      ultimoAcceso: d.cuenta.ultimo_acceso ? formatFechaHora(d.cuenta.ultimo_acceso) : null,
      correoConfirmado: d.cuenta.correo_confirmado,
    },
    veterinario: d.veterinario && {
      estado: d.veterinario.estado,
      especialidad: d.veterinario.especialidad,
      numeroColegiado: d.veterinario.numero_colegiado,
      revisadoPor: d.veterinario.revisado_por,
      revisadoEn: d.veterinario.revisado_en ? formatFechaCorta(d.veterinario.revisado_en) : null,
      motivoRechazo: d.veterinario.motivo_rechazo,
      centroSolicitado: d.veterinario.centro_solicitado,
      centroMencionado: nombreConComuna(d.veterinario.centro_mencionado, d.veterinario.centro_mencionado_comuna),
    },
    centrosAtiende: d.centros_atiende.map(centro),
    centrosAdministra: d.centros_administra.map(centro),
    mascotas: d.mascotas.map((m) => ({
      id: m.id,
      nombre: m.nombre,
      especie: capitalize(m.especie),
      raza: m.raza,
      sexo: m.sexo,
      edad: formatEdad(calcularEdad(m.fecha_nacimiento)),
    })),
    citas: d.citas,
    ultimasCitas: d.ultimas_citas.map((c) => ({
      id: c.id,
      fecha: formatFechaHora(c.fecha_hora),
      estado: c.estado,
      mascota: c.mascota,
      detalle: [c.centro, c.veterinario].filter(Boolean).join(" · "),
    })),
    recetasEmitidas: d.recetas_emitidas,
  };
};

// =====================================================================
// DETALLE COMPLETO DE UN CENTRO (solo superadmin) — migración 26
// =====================================================================
export const getDetalleCentro = async (centroId: number): Promise<DetalleCentro> => {
  const { data, error } = await supabase.rpc("detalle_centro", { p_centro_id: centroId });
  if (error) throw error;
  const d = data as unknown as DetalleCentroCrudo;
  const hora = (h: string) => formatHorario(h);

  return {
    centro: {
      id: d.centro.id,
      nombre: d.centro.nombre,
      direccion: d.centro.direccion,
      comuna: d.centro.comuna,
      telefono: d.centro.telefono,
      estado: d.centro.estado,
      esPrueba: d.centro.es_prueba,
      creado: formatFechaCorta(d.centro.creado_en),
      revisadoPor: d.centro.revisado_por,
      revisadoEn: d.centro.revisado_en ? formatFechaCorta(d.centro.revisado_en) : null,
      motivoRechazo: d.centro.motivo_rechazo,
    },
    horarios: d.horarios.map((h) => ({
      dia: h.dia,
      texto: `${hora(h.abre)}–${hora(h.cierra)}${h.inicio_colacion && h.fin_colacion ? ` · colación ${hora(h.inicio_colacion)}–${hora(h.fin_colacion)}` : ""}`,
    })),
    especialidades: d.especialidades,
    suscripcion: d.suscripcion && {
      plan: d.suscripcion.plan,
      precio: d.suscripcion.precio,
      estado: d.suscripcion.estado,
      finPrueba: d.suscripcion.fin_prueba ? formatFechaLarga(d.suscripcion.fin_prueba) : null,
      renovacion: d.suscripcion.renovacion ? formatFechaLarga(d.suscripcion.renovacion) : null,
      planSolicitado: d.suscripcion.plan_solicitado,
    },
    administradores: d.administradores.map((a) => ({
      id: a.id,
      nombre: a.nombre,
      detalle: `${a.email} · desde ${formatFechaCorta(a.desde)}`,
      etiqueta: ESTILO_ROL[a.rol],
    })),
    veterinarios: d.veterinarios.map((v) => ({
      id: String(v.id),
      nombre: v.nombre,
      detalle: [v.especialidad ?? "Medicina general", v.numero_colegiado && `N° ${v.numero_colegiado}`].filter(Boolean).join(" · "),
      etiqueta: ESTADO_VERIFICACION[v.estado],
    })),
    citas: d.citas,
    ultimasCitas: d.ultimas_citas.map((c) => ({
      id: c.id,
      fecha: formatFechaHora(c.fecha_hora),
      estado: c.estado,
      mascota: c.mascota,
      detalle: [c.dueno, c.veterinario ?? "Sin veterinario"].filter(Boolean).join(" · "),
    })),
    solicitudOrigen: d.solicitud_origen && {
      responsable: d.solicitud_origen.nombre_responsable,
      cargo: CARGOS_RESPONSABLE.find((c) => c.valor === d.solicitud_origen!.cargo)?.texto ?? d.solicitud_origen.cargo,
      correo: d.solicitud_origen.correo,
      telefono: d.solicitud_origen.telefono,
      sitioWeb: d.solicitud_origen.sitio_web,
      mensaje: d.solicitud_origen.mensaje,
      fecha: formatFechaCorta(d.solicitud_origen.creado_en),
    },
  };
};

// SUPERADMIN: la suscripción de cada centro, con su solicitud de cambio
// de plan pendiente (si tiene). Primero salen las que esperan respuesta.
export const getSuscripcionesSuperadmin = async (): Promise<SuscripcionListada[]> => {
  const [planes, { data, error }] = await Promise.all([getPlanes(), supabase.rpc("listar_suscripciones")]);
  if (error) throw error;
  const nombrePlan = (id: string | null) => planes.find((p) => p.id === id)?.nombre ?? id ?? "—";
  return (data ?? []).map((s) => {
    const vence = s.estado === "prueba" || (s.renovacion === null && s.fin_prueba) ? s.fin_prueba : s.renovacion;
    return {
      centroId: s.centro_id,
      centro: s.centro,
      comuna: s.comuna,
      esPrueba: s.es_prueba,
      plan: nombrePlan(s.plan_id),
      estado: s.estado,
      vence: vence ? formatFechaLarga(vence) : null,
      veterinarios: s.veterinarios,
      limite: s.limite,
      solicitud: s.solicitud_id === null ? null : {
        id: s.solicitud_id,
        plan: nombrePlan(s.plan_solicitado),
        mensaje: s.mensaje,
        solicitante: s.solicitado_por ?? "—",
        fecha: s.solicitado_en ? formatFechaCorta(s.solicitado_en) : "",
      },
    };
  });
};

// ---------- DERIVACIONES (migración 29) ----------
// A quién puede derivar el veterinario (veterinarios y centros aprobados)
export const getDestinosDerivacion = async (): Promise<DestinoDerivacion[]> => {
  const { data, error } = await supabase.rpc("destinos_derivacion");
  if (error) throw error;
  return (data ?? []).map((d) => ({ tipo: d.tipo as TipoDestinoDerivacion, id: d.id, nombre: d.nombre, detalle: d.detalle }));
};

// Derivaciones de un paciente (ficha) o, sin mascotaId, de todas las mascotas del dueño
export const getDerivaciones = async (mascotaId?: number): Promise<Derivacion[]> => {
  const { data, error } = await supabase.rpc("listar_derivaciones", mascotaId ? { p_mascota_id: mascotaId } : {});
  if (error) throw error;
  return (data ?? []).map((d) => ({
    id: d.id,
    mascotaId: d.mascota_id,
    mascota: d.mascota,
    fecha: formatFechaCorta(d.creada_en),
    origen: d.origen ?? "Veterinario no informado",
    destino: d.destino ?? "—",
    motivo: d.motivo,
    estado: d.estado,
    resultado: d.resultado,
    puedoResponder: d.puedo_responder,
    puedoCancelar: d.puedo_cancelar,
  }));
};

// Las del veterinario conectado: recibidas y enviadas (pendientes primero)
export const getMisDerivaciones = async (): Promise<Derivacion[]> => {
  const { data, error } = await supabase.rpc("mis_derivaciones");
  if (error) throw error;
  return (data ?? []).map((d) => {
    const direccion = d.direccion === "enviada" ? "enviada" : "recibida";
    const pendiente = d.estado === "pendiente";
    return {
      id: d.id,
      mascotaId: d.mascota_id,
      mascota: d.mascota,
      especie: capitalize(d.especie),
      dueno: d.dueno ?? "Dueño desconocido",
      fecha: formatFechaCorta(d.creada_en),
      origen: d.origen ?? "Veterinario no informado",
      destino: d.destino ?? "—",
      motivo: d.motivo,
      estado: d.estado,
      resultado: d.resultado,
      direccion,
      puedoResponder: pendiente && direccion === "recibida",
      puedoCancelar: pendiente && direccion === "enviada",
    };
  });
};

// Todo lo que AuraPet guarda de la persona conectada (Configuración → Privacidad)
export const getMisDatos = async () => {
  const { data, error } = await supabase.rpc("mis_datos");
  if (error) throw error;
  return data;
};

// SUPERADMIN: mensajes del formulario de contacto, los más nuevos primero
export const getMensajesContacto = async (): Promise<MensajeContacto[]> => {
  const { data, error } = await supabase
    .from("mensajes_contacto")
    .select("id, nombre, correo, asunto, mensaje, estado, creado_en")
    .order("creado_en", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((m) => ({
    id: m.id,
    nombre: m.nombre,
    correo: m.correo,
    asunto: m.asunto,
    mensaje: m.mensaje,
    estado: m.estado,
    fecha: formatFechaHora(m.creado_en),
  }));
};
