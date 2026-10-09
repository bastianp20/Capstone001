
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
  UrgenciaCita,            // "baja" | "media" | "alta" | "critica"
} from "../interfaces";
// auí importamos supabase para poder hacer las consutas a la base de datos. 
import { supabase } from "../lib/supabase";
// Funciones para mostrar las fechas que vienen de la base.
import { formatFechaCaja, formatFechaCorta, formatFechaHora, formatFechaLarga, formatHora12h } from "../lib/fechas";

// Pone la primera letra en mayúscula: "perro" -> "Perro".
const capitalize = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);


// =====================================================================
// PANEL DEL DUEÑO
// =====================================================================

// Las mascotas de un dueño.
export const getMascotasPorDueno = async (duenoId: string): Promise<Mascota[]> => {
  const { data, error } = await supabase          // "await" = esperar la respuesta de la base
    .from("mascotas")                             // de la tabla mascotas...
    .select("id, dueno_id, nombre, especie, raza, fecha_nacimiento, sexo, esterilizado, foto_url") // ...estas columnas...
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
export const getPacienteByVeterinarioId = async (veterinarioId: number) => {
  const { data, error } = await supabase
    .from("citas")
    .select("mascota_id, fecha_hora, mascotas ( nombre, especie, raza, perfiles ( nombre ) )")
    .eq("veterinario_id", veterinarioId)
    .order("fecha_hora", { ascending: false });   // la más reciente primero
  if (error) throw error;

  // Agrupamos las citas por mascota: Map<idMascota, datos del paciente>.
  const pacientes = new Map<number, {
    id: number; nombre: string; especie: string; raza: string; dueno: string;
    ultimaVisita: string; totalVisitas: number;
  }>();
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
    });
  }
  // Pasamos el Map a lista y ordenamos alfabéticamente.
  return Array.from(pacientes.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
};


// =====================================================================
// PANEL DEL SUPERADMIN
// =====================================================================

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
