
// aquí van todas las consultas a la base de datos

//   3. Si hay error, lo lanza (throw) para que la pantalla lo muestre.
//   4. Transforma las filas al formato que la pantalla ya conocía.
//
// OJO: lo que cada persona puede ver lo deciden las reglas RLS de la base.
// Si una tabla aún no tiene reglas para un rol, la consulta devuelve [].

// Tipos que ya usaban las pantallas (formato "listo para mostrar").
import type {
  CitaProximaDueno,        // cita para el cuadradito del panel del dueño
  CitaResumen,             // cita para la tabla del superadmin
  EstadoCita,              // "pendiente" | "confirmada" | ...
  HistorialRecienteItem,   // ítem de "historial reciente" del dueño
  Mascota,                 // mascota con los campos que muestra la app
  PreguntaFrecuente,       // pregunta + respuesta + cantidad de consultas
  SolicitudPendiente,      // centro o veterinario esperando aprobación
  UrgenciaCita,            // "baja" | "media" | "alta" | "critica",
  ResumenSuperadmin,
  VeterinarioAsignaciones,
  CentroAdministrado,
  CentroDetalle,
  MiembroEquipo,
  CitaCentro,
  PacienteVeterinario,
  InicioVeterinarioDatos,
  HistorialDueno,
  CentroParaCita,
  VeterinarioParaCita,
} from "../interfaces";
// auí importamos supabase para poder hacer las consutas a la base de datos. 
import { supabase } from "../lib/supabase";
// Funciones para mostrar las fechas que vienen de la base.
import { formatFechaCaja, formatFechaCorta, formatFechaHora, formatFechaLarga, formatHora12h, formatHora24, diaDelMesEnChile, fechaDentroDe, rangosDeFecha } from "../lib/fechas";
import { DIAS_CONTROLES_PROXIMOS, MAX_ITEMS_PENDIENTES, URGENCIAS_ALTAS } from "../constants";

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
      id, mascota_id, fecha_hora, motivo, estado, urgencia,
      mascotas!inner ( nombre, dueno_id ),
      centros ( nombre )
    `)                                            // + datos de su mascota y su centro (como un JOIN)
    .eq("mascotas.dueno_id", duenoId)             // solo citas de mascotas de este dueño (por eso el !inner)
    .gte("fecha_hora", new Date().toISOString())  // gte = "mayor o igual": desde ahora en adelante
    .neq("estado", "cancelada")                   // neq = "distinto de": sin las canceladas
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
  mascota: string;
  especie: string;
  raza: string;
  dueno: string;
  motivo: string;
  estado: EstadoCita;
  urgencia: UrgenciaCita;
}

// Lo que necesita la barra superior del panel del veterinario.
export interface InfoVeterinario {
  id: number | null;      // id en la tabla veterinarios (null si la cuenta aún no tiene ficha profesional)
  centros: string[];      // nombres de los centros donde atiende
}

// Busca la ficha de veterinario de la persona conectada y sus centros.
// Recibe el id de la CUENTA (uuid) y devuelve el id de VETERINARIO (número),
// que es el que usan la agenda y los pacientes.
export const getInfoVeterinario = async (perfilId: string): Promise<InfoVeterinario> => {
  const { data, error } = await supabase
    .from("veterinarios")
    .select("id, veterinario_centros ( centros ( nombre ) )")  // sus centros, a través de la tabla intermedia
    .eq("perfil_id", perfilId)                    // la ficha de esta cuenta
    .maybeSingle();                               // una fila o ninguna (si no existe, data = null, sin error)
  if (error) throw error;
  const fila = data;
  return {
    id: fila?.id ?? null,                         // null si la cuenta no tiene ficha de veterinario
    centros: (fila?.veterinario_centros ?? [])    // [{ centros: { nombre } }, ...]
      .map((vc) => vc.centros?.nombre)            // -> ["Clínica VetSur", ...]
      .filter((nombre): nombre is string => Boolean(nombre)), // sin vacíos
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
// tuvo y la fecha de la última.
export const getPacienteByVeterinarioId = async (veterinarioId: number): Promise<PacienteVeterinario[]> => {
  const { data, error } = await supabase
    .from("citas")
    .select("mascota_id, fecha_hora, mascotas ( nombre, especie, raza, fecha_nacimiento, peso_kg, alergias, perfiles ( nombre ) )")
    .eq("veterinario_id", veterinarioId)
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
      id, numero_colegiado, estado_verificacion,
      perfiles!veterinarios_perfil_id_fkey ( nombre, es_prueba ),
      especialidades ( nombre ),
      veterinario_centros ( centros ( id, nombre, es_prueba ) )
    `);
  if (error) throw error;
  return (data ?? [])
    .map((v) => ({
      id: v.id,
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

// Todas las citas de la plataforma, con mascota, dueño, veterinario y centro.
export const getCitasResumen = async (): Promise<CitaResumen[]> => {
  const { data, error } = await supabase
    .from("citas")
    .select(`
      id, fecha_hora, estado, urgencia,
      mascotas ( nombre, perfiles ( nombre ) ),
      veterinarios ( perfiles!veterinarios_perfil_id_fkey ( nombre ) ),
      centros ( nombre )
    `)                                            // veterinarios tiene 2 relaciones con perfiles (perfil_id y
                                                  // revisado_por); "!veterinarios_perfil_id_fkey" le dice cuál usar
    .order("fecha_hora", { ascending: false });   // las más nuevas primero
  if (error) throw error;
  const filas = data ?? [];
  return filas.map((c) => ({
    id: c.id,
    mascota: c.mascotas?.nombre ?? "Mascota desconocida",
    dueno: c.mascotas?.perfiles?.nombre ?? "Dueño desconocido",
    veterinario: c.veterinarios?.perfiles?.nombre ?? "Sin asignar",
    centro: c.centros?.nombre ?? "Centro desconocido",
    fechaHora: formatFechaHora(c.fecha_hora),     // "10/09 · 10:30"
    estado: c.estado,
    urgencia: c.urgencia ?? "baja",              // sin urgencia aún -> se muestra como baja
  }));
};

// Centros y veterinarios que esperan aprobación (reemplaza SolicitudPendiente.ts).
export const getSolicitudesPendientes = async (): Promise<SolicitudPendiente[]> => {
  // Pedimos las dos listas al mismo tiempo (Promise.all = en paralelo, más rápido).
  const [centros, veterinarios] = await Promise.all([
    supabase
      .from("centros")
      .select("id, nombre, creado_en")
      .eq("estado_verificacion", "pendiente"),
    supabase
      .from("veterinarios")
      .select("id, creado_en, perfiles!veterinarios_perfil_id_fkey ( nombre )")
      .eq("estado_verificacion", "pendiente"),
  ]);
  if (centros.error) throw centros.error;
  if (veterinarios.error) throw veterinarios.error;

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
    })),
  ];
  return lista
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))     // las más recientes primero
    .map(({ creadoEn, ...s }) => ({ ...s, fechaRegistro: formatFechaCorta(creadoEn) })); // "23/07/2026"
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
