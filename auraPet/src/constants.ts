import type { CSSProperties } from "react";
import type {EstadoCita, UrgenciaCita, EspecieMascota, 
  // VistaHome, 
  Servicio, MedicamentoReceta, ColumnaMedicamento, AtajoProximoControl, PasoCita, ItemMenuDueno, TipoRegistro,
  OpcionFiltro, FiltroUsuarios, FiltroAsignaciones, FiltroCentros, EstadoVerificacion, RolCuenta, EstadoVacuna, CargoResponsable, DatosSolicitudCentro, ItemConIcono, OpcionChip, PasoWizard, PreguntaRespuesta, TipoSolicitud, ItemMenuSuperAdmin, OpcionCrearSuperAdmin, CuentaUsuario, CentroListado, VeterinarioAsignaciones, FiltroHistorial, RangoCitas, SolicitudHistorial, DatosLaboralesVeterinario, OpcionModoCentro, EstadoSuscripcion, EstadoHistorialSuscripcion, FuncionPlan, PlanId, FiltroSuscripciones, SuscripcionListada, EstadoDerivacion, PestanaDerivaciones, DatosContacto, EstadoContacto, FiltroMensajes, MensajeContacto, OtraFormaContacto, ItemMenuCentroAdmin} from '../src/interfaces'; 
import {
  Menu, Search, Bell, User, UserCircle, Megaphone, Inbox, LogOut, Settings, Calendar, Filter, ChevronDown, ChevronRight, X, Plus, MoreVertical, Home,
  PawPrint, Heart, CalendarPlus, History, FileText,Stethoscope, Syringe, ClipboardList, ClipboardPlus, Share2, Microscope, Activity,
  Building2, Clock, MapPin, Phone, Users, ShieldCheck, Building, Settings2, AlertTriangle, AlertCircle, Info, Brain, ListOrdered,
  CheckCircle2, XCircle, Clock3, Loader2, Dog, Cat, ShieldPlus, Scissors, Trash2, ChevronLeft, Pencil, Scale, CalendarCheck, Send, SearchCheck, BadgeCheck, Check, ArrowRight, ArrowLeft, LayoutDashboard, ClipboardCheck, CalendarDays, Link2, CreditCard, Sparkles, Lock,
} from 'lucide-react';

export const Colors = {
  bg: "rgb(31, 27, 27)",
  sidebarBg: "#12181f",
  sidebarActive: "#0f8f80",
  sidebarText: "#b8c1cc",
  border: "#e4e6ea",
  text: "#1a1f27",
  textMuted: "#6b7280",
  accent: "#0f8f80",
  accentSoft: "#e3f5f2",
  primario: "#0f8f80",
  secundario: "#e3f5f2",

  oscuro: "rgb(31, 27, 27)",
  sidebarOscuro: "#12181f",
  texto: "#1a1f27",
  textoSuave: "#6b7280",
  textoSidebar: "#b8c1cc",
  borde: "#e4e6ea",

  estadoConfirmada: "#2452a8",
  estadoCompletada: "#177a4f",
  estadoCancelada: "#a4272a",
  estadoPendiente: "#4b5563",

  urgenciaCriticaFondo: "#e0403f",
  urgenciaCriticaTexto: "#ffffff",
  urgenciaAltaFondo: "#f4a13a",
  urgenciaAltaTexto: "#5a3600",
  urgenciaMediaFondo: "#f0d251",
  urgenciaMediaTexto: "#5a4b00",
  urgenciaBajaFondo: "#e3f5f2",
  urgenciaBajaTexto: "#177a4f",
};

export const badgeStyles: Record<string, CSSProperties> = {
  // estado de cita
  confirmada: { background: "#e3edfb", color: "#2452a8" },
  en_curso: { background: "#dff3ea", color: "#177a4f" },
  cancelada: { background: "#fbe4e4", color: "#a4272a" },
  pendiente: { background: "#eceef1", color: "#4b5563" },
  completada: { background: "#dff3ea", color: "#177a4f" },
  // urgencia
  critica: { background: "#e0403f", color: "#ffffff" },
  alta: { background: "#f4a13a", color: "#5a3600" },
  media: { background: "#f0d251", color: "#5a4b00" },
  baja: { background: "#dff3ea", color: "#177a4f" },
};

export const ESTADO_LABEL: Record<EstadoCita, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  en_curso: "En curso",
  completada: "Completada",
  cancelada: "Cancelada",
};

export const URGENCIA_LABEL: Record<UrgenciaCita, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Urgente",
  critica: "Crítica",
};

export const Badge = (style: CSSProperties): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: "nowrap",
  ...style,
});


export const Iconos = {
  // y esto es de caracter general nmas
  menu: Menu,
  buscar: Search,
  notificaciones: Bell,
  usuario: User,
  perfil: UserCircle,
  cerrarSesion: LogOut,
  configuracion: Settings,
  calendario: Calendar,
  filtro: Filter,
  flechaAbajo: ChevronDown,
  flechaDerecha: ChevronRight,
  cerrar: X,
  agregar: Plus,
  opciones: MoreVertical,
  inicio: Home,

  // esto es pa los dueños de mascotas
  huella: PawPrint,
  favoritos: Heart,
  solicitarCita: CalendarPlus,
  historial: History,
  fichaMedica: FileText,

  // esto es pa los veterinarios :P 
  diagnostico: Stethoscope,
  vacuna: Syringe,
  receta: ClipboardList,
  nuevoDiagnostico: ClipboardPlus,
  derivacion: Share2,
  muestra: Microscope,
  signosVitales: Activity,

  // esto es pa los centros 
  centro: Building2,
  horario: Clock,
  ubicacion: MapPin,
  telefono: Phone,

  // para el super admin :p 
  usuarios: Users,
  permisos: ShieldCheck,
  veterinarias: Building,
  configuracionSistema: Settings2,

  // esto es para el sistema de ia y su agrupación por urgencia
  urgenciaAlta: AlertTriangle,
  urgenciaMedia: AlertCircle,
  urgenciaBaja: Info,
  ia: Brain,
  prioridad: ListOrdered,

  // esto es para los estados 
  completado: CheckCircle2,
  cancelado: XCircle,
  eliminar: Trash2,
  pendiente: Clock3,
  cargando: Loader2,
  advertencia: AlertTriangle,
  verMas: ChevronRight,
  volver: ChevronLeft,
  editar: Pencil,
  peso: Scale,
  suscripcion: CreditCard,
  destacado: Sparkles,
  candado: Lock,
  check: Check,
  siguiente: ArrowRight,
  anterior: ArrowLeft,

  // esto se usará para el modulo de adopción
  perro: Dog,
  gato: Cat,
  vacunasAlDia: ShieldPlus,
  esterilizado: Scissors,
};

// Los formatos de fecha (calcularEdad, formatFechaLarga, formatFechaCaja, etc.)
// ahora están en src/lib/fechas.ts y trabajan con las fechas de Supabase.

export const EMOJI_ESPECIE: Record<EspecieMascota, string> = {
  perro: "🐕",
  gato: "🐈",
  ave: "🐦",
  conejo: "🐇",
  otro: "🐾",
};

export const getFechaHoy = (): number => {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  return Number(`${yyyy}${mm}${dd}`);
};

export const links: { ruta: string; label: string }[] = [
  { ruta: "/como-funciona", label: "Cómo funciona" },
  { ruta: "/veterinarias", label: "Para veterinarias" },
  { ruta: "/duenos", label: "Para dueños" },
  { ruta: "/nosotros", label: "Nosotros" },
  { ruta: "/contacto", label: "Contacto" },
];

// --- Preguntas Frecuentes de Contacto ---
//
// Las preguntas que se muestran NO están escritas a mano en un archivo:
// se calculan contando cuántos mensajes de contactoMock caen en cada
// "categoria" (el tema de fondo de la consulta) y mostrando las
// categorías que más se repiten, osea la moda. El texto de la
// respuesta sí es contenido nuestro (alguien tiene que redactarlo),
// pero cuáles preguntas aparecen y en qué orden depende 100% de los
// datos de contactoMock.
export const respuestasPorCategoria: Record<string, { pregunta: string; respuesta: string }> = {
  "precios": {
    pregunta: "¿Cuánto cuesta usar AuraPet?",
    respuesta: "AuraPet es gratuito para los dueños de mascotas. Las veterinarias y centros tienen sus propios planes para administrar pacientes, agenda y fichas clínicas.",
  },
  "login": {
    pregunta: "Olvidé mi contraseña, ¿cómo la recupero?",
    respuesta: "Desde la pantalla de inicio de sesión puedes solicitar restablecer tu contraseña con tu correo registrado. Te llegará un enlace para crear una nueva.",
  },
  "notificaciones": {
    pregunta: "¿Por qué no me llegan los recordatorios de mis citas?",
    respuesta: "Puede deberse a los permisos de notificaciones de tu dispositivo o a un correo desactualizado en tu perfil. Si ya revisaste eso y sigue sin llegarte, escríbenos para revisarlo.",
  },
  "historial-celular": {
    pregunta: "¿Puedo ver el historial médico de mi mascota desde el celular?",
    respuesta: "Sí, el historial de vacunas, diagnósticos y tratamientos se ve igual desde el celular que desde el computador, apenas tu veterinaria lo vaya registrando.",
  },
  "registro-veterinaria": {
    pregunta: "¿Cómo registro mi veterinaria o centro en la plataforma?",
    respuesta: "Escríbenos contándonos sobre tu centro (sucursales, cantidad de veterinarios) y nuestro equipo te guía en el proceso de validación y alta.",
  },
  "cobertura": {
    pregunta: "¿AuraPet funciona fuera de la Región Metropolitana?",
    respuesta: "Estamos sumando veterinarias de otras regiones de forma progresiva. Si en tu ciudad aún no hay centros afiliados, escríbenos y te avisamos apenas se sumen.",
  },
  "cuenta-eliminar": {
    pregunta: "¿Puedo eliminar mi cuenta y mis datos?",
    respuesta: "Sí, puedes solicitar la eliminación de tu cuenta y tu historial escribiéndonos desde este formulario. Lo procesamos manualmente para confirmar que seas tú.",
  },
  "bugs-app": {
    pregunta: "La app se cierra o se traba al usarla, ¿qué hago?",
    respuesta: "Cuéntanos el modelo de tu celular y en qué paso exacto se cierra (agendar, subir una foto, etc.) para poder reproducir el error y arreglarlo lo antes posible.",
  },
  "cambio-veterinaria": {
    pregunta: "¿Puedo cambiar a mi mascota de veterinaria sin perder su historial?",
    respuesta: "Sí, el historial queda asociado a tu mascota, no al centro. Al agendar en una nueva veterinaria afiliada, el equipo puede ver sus registros anteriores.",
  },
  "multi-veterinario": {
    pregunta: "¿Cómo agrego a otros veterinarios de mi centro a la plataforma?",
    respuesta: "Como encargada o encargado del centro puedes invitar a tus colegas desde el panel de tu centro para que vean y actualicen las fichas de los pacientes.",
  },
};

// los servicios que estarán disponibles en la web y app 
export const servicios: Servicio[] = [
    {
        icono: Calendar,
        titulo: "Agendar citas",
        descripcion: "Reserva hora con la veterinaria que prefieras en pocos clics.",
    },
    {
        icono: FileText,
        titulo: "Historial médico digital",
        descripcion: "Toda la ficha clínica de tu mascota disponible cuando la necesites.",
    },
    {
        icono: MapPin,
        titulo: "Encontrar veterinarios cercanos",
        descripcion: "Busca centros y especialistas cerca de ti, con reseñas reales.",
    },
    {
      icono: Heart,
      titulo: "Adopciones Responsables",
      descripcion: "Conecta con refugios y adopta mascotas de manera segura y responsable."
    }
];

// =====================================================================
// RECETAS (modal de nueva receta del veterinario)
// =====================================================================

// Una fila vacía de la tabla de medicamentos. Es una función (y no un objeto
// fijo) para que cada fila nueva sea un objeto distinto.
export const medicamentoVacio = (): MedicamentoReceta => ({
  nombre: "",
  dosis: "",
  frecuencia: "",
  duracion: "",
});

// Columnas de la tabla de medicamentos: el orden de aquí es el orden en pantalla.
export const COLUMNAS_MEDICAMENTO: ColumnaMedicamento[] = [
  { campo: "nombre", titulo: "Medicamento", placeholder: "Ej: Meloxicam 1,5 mg/ml" },
  { campo: "dosis", titulo: "Dosis", placeholder: "Ej: 0,1 ml por kg" },
  { campo: "frecuencia", titulo: "Frecuencia", placeholder: "Ej: Cada 24 horas" },
  { campo: "duracion", titulo: "Duración", placeholder: "Ej: 5 días" },
];

// Atajos para fijar el próximo control sin abrir el calendario.
export const ATAJOS_PROXIMO_CONTROL: AtajoProximoControl[] = [
  { texto: "En 7 días", dias: 7 },
  { texto: "En 15 días", dias: 15 },
  { texto: "En 1 mes", dias: 30 },
];

// =====================================================================
// INICIO DEL VETERINARIO
// =====================================================================

// Botón principal de la "Próxima cita" según el estado en que está.
// Debe calzar con los pasos que acepta la función actualizar_mi_cita (migración 12).
export const SIGUIENTE_PASO_CITA: Partial<Record<EstadoCita, PasoCita>> = {
  pendiente: { estado: "confirmada", texto: "Confirmar cita" },
  confirmada: { estado: "en_curso", texto: "Iniciar atención" },
  en_curso: { estado: "completada", texto: "Finalizar atención" },
};

// Urgencias de menor a mayor (para el selector "Cambiar")
export const ORDEN_URGENCIAS: UrgenciaCita[] = ["baja", "media", "alta", "critica"];

// Urgencias que cuentan como "urgentes" en los indicadores y pendientes
export const URGENCIAS_ALTAS: UrgenciaCita[] = ["alta", "critica"];

// Días del mes que se rotulan bajo el gráfico de atenciones
export const MARCAS_EJE_MES = [1, 8, 15, 22, 29];

// Cuántos ítems mostrar en cada bloque de "Pendientes"
export const MAX_ITEMS_PENDIENTES = 3;

// Días hacia adelante que cuentan como "controles próximos"
export const DIAS_CONTROLES_PROXIMOS = 7;

// =====================================================================
// PANEL DEL DUEÑO
// =====================================================================

// Menú lateral del dueño. El orden aquí es el orden en pantalla.
export const MENU_DUENO: ItemMenuDueno[] = [
  { id: "inicio", texto: "Inicio", icono: Home },
  { id: "mascotas", texto: "Mis mascotas", icono: PawPrint },
  { id: "solicitar", texto: "Solicitar cita", icono: CalendarPlus },
  { id: "historial", texto: "Historial médico", icono: History },
  { id: "configuracion", texto: "Configuración", icono: Settings },
];

// Especies para registrar una mascota (deben calzar con el enum especie_mascota)
export const ESPECIES_MASCOTA: { valor: EspecieMascota; texto: string }[] = [
  { valor: "perro", texto: "Perro" },
  { valor: "gato", texto: "Gato" },
  { valor: "ave", texto: "Ave" },
  { valor: "conejo", texto: "Conejo" },
  { valor: "otro", texto: "Otro" },
];

// Tipos de registro del historial médico (enum tipo_registro)
export const TIPO_REGISTRO_LABEL: Record<TipoRegistro, string> = {
  diagnostico: "Diagnóstico",
  vacuna: "Vacuna",
  cirugia: "Cirugía",
  control: "Control",
  otro: "Otro",
};

// Síntomas frecuentes: chips que el dueño puede marcar al pedir hora
export const SINTOMAS_FRECUENTES = [
  "Vómitos", "Diarrea", "No come", "Decaimiento", "Tos", "Cojera", "Picazón", "Fiebre",
];

// Cuántas citas e ítems de historial se muestran en el inicio
export const MAX_CITAS_INICIO_DUENO = 3;
export const MAX_HISTORIAL_INICIO_DUENO = 3;

// Las horas de cita van de 15 en 15 minutos (input type="time" usa segundos)
export const PASO_HORA_CITA_SEGUNDOS = 15 * 60;

// =====================================================================
// CUENTAS DE PRUEBA
// =====================================================================
// Ayuda que se muestra bajo la casilla "Cuenta de prueba" al crear cuentas
export const TEXTO_CUENTA_PRUEBA =
  "Solo para el equipo de desarrollo: verá y usará únicamente los centros de prueba de AuraPet.";

// =====================================================================
// EDITAR CUENTAS (superadmin)
// =====================================================================
// Las cuentas REALES se editan solo después de escribir un código, y por un tiempo limitado.
export const SEGUNDOS_DESBLOQUEO_CUENTA_REAL = 60;
export const LARGO_CODIGO_CONFIRMACION = 6;
// Sin 0/O ni 1/I/L, que se confunden al leer
export const CARACTERES_CODIGO_CONFIRMACION = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

// Ayuda bajo la casilla "Centro de prueba" al editar un centro
export const TEXTO_CENTRO_PRUEBA =
  "Solo lo verán y usarán las cuentas de prueba. Su equipo también debe ser de prueba.";

// Estado de verificación de centros y veterinarios: texto y colores del chip
export const ESTADO_VERIFICACION: Record<EstadoVerificacion, { texto: string; fondo: string; color: string }> = {
  aprobado: { texto: "Verificado", fondo: "#e3f5f2", color: "#0f8f80" },
  pendiente: { texto: "Pendiente", fondo: "#fdf3e1", color: "#8a5a00" },
  rechazado: { texto: "Rechazado", fondo: "#fdecec", color: "#a4272a" },
};

// =====================================================================
// FILTROS (chips) de las listas del superadmin
// =====================================================================
export const FILTROS_USUARIOS: OpcionFiltro<FiltroUsuarios>[] = [
  { valor: "todos", texto: "Todos" },
  { valor: "dueno", texto: "Dueños" },
  { valor: "veterinario", texto: "Veterinarios" },
  { valor: "administrativo", texto: "Administrativos" },
  { valor: "superadmin", texto: "Superadmins" },
  { valor: "prueba", texto: "De prueba" },
];

export const FILTROS_ASIGNACIONES: OpcionFiltro<FiltroAsignaciones>[] = [
  { valor: "todos", texto: "Todos" },
  { valor: "sinCentro", texto: "Sin centro" },
  { valor: "pendientes", texto: "Pendientes" },
  { valor: "prueba", texto: "De prueba" },
];

export const FILTROS_CENTROS: OpcionFiltro<FiltroCentros>[] = [
  { valor: "todos", texto: "Todos" },
  { valor: "aprobado", texto: "Verificados" },
  { valor: "pendiente", texto: "Pendientes" },
  { valor: "rechazado", texto: "Rechazados" },
  { valor: "real", texto: "Reales" },
  { valor: "prueba", texto: "De prueba" },
];

// Cómo se muestra cada rol en la lista de usuarios (texto y colores del chip)
export const ESTILO_ROL: Record<RolCuenta, { texto: string; fondo: string; color: string }> = {
  dueno: { texto: "Dueño", fondo: "#eef2ff", color: "#3b4cb8" },
  veterinario: { texto: "Veterinario", fondo: "#e3f5f2", color: "#0f8f80" },
  superadmin: { texto: "Superadmin", fondo: "#fdf3e1", color: "#8a5a00" },
  administrativo: { texto: "Administrativo", fondo: "#f3eefe", color: "#6b3fb8" },
};

// Modal de rechazo (RechazarModal): largo máximo del motivo y textos por defecto.
// Cada pantalla puede reemplazar título/descripción por props si lo necesita.
export const MAX_CARACTERES_RECHAZO = 500;

export const TEXTOS_RECHAZO = {
  titulo: "Rechazar solicitud",
  descripcion: "La persona verá este motivo. Esta acción no se puede deshacer.",
  etiqueta: "Motivo",
  placeholder: "Escribe aquí las razones del rechazo…",
  cancelar: "Cancelar",
  confirmar: "Confirmar rechazo",
  procesando: "Rechazando…",
  cerrar: "Cerrar",
};

// Ficha del paciente (veterinario)
export const SEXO_LABEL: Record<"macho" | "hembra", string> = {
  macho: "Macho",
  hembra: "Hembra",
};

// Orden de los tipos en el selector "Tipo de registro"
export const TIPOS_REGISTRO: TipoRegistro[] = ["diagnostico", "control", "vacuna", "cirugia", "otro"];

// Una vacuna "por vencer" es la que le toca dentro de estos días
export const DIAS_AVISO_VACUNA = 30;

export const MAX_CARACTERES_REGISTRO = 1000;
export const MAX_CARACTERES_DATO_CLINICO = 300;

export const ESTADO_VACUNA: Record<EstadoVacuna, { texto: string; fondo: string; color: string }> = {
  al_dia: { texto: "Al día", fondo: "rgba(16, 185, 129, 0.15)", color: "#6ee7b7" },
  por_vencer: { texto: "Por vencer", fondo: "rgba(245, 158, 11, 0.15)", color: "#fcd34d" },
  vencida: { texto: "Vencida", fondo: "rgba(239, 68, 68, 0.15)", color: "#fca5a5" },
};

export const TEXTO_SIN_REGISTRAR = "Sin registrar";

// =====================================================================
// Página "Solicitar unirse como centro" (/solicitar-centro)
// =====================================================================
export const RUTA_SOLICITAR_CENTRO = "/solicitar-centro";
export const RUTA_PANEL = "/panel";                       // paneles internos (con sesión)
export const RUTA_NUEVA_PASSWORD = "/nueva-contrasena";   // destino del enlace "restablecer contraseña"

export const LARGO_TELEFONO_CL = 9;          // sin el +56
export const PREFIJO_TELEFONO_CL = "+56";
export const MAX_CARACTERES_MENSAJE_SOLICITUD = 500;

export const TEXTOS_SOLICITUD = {
  eyebrow: "Para centros veterinarios",
  titular: "Haz crecer tu centro con AuraPet",
  bajada: "Únete a la red de atención de mascotas en Chile y lleva tu clínica u hospital al siguiente nivel.",
  tituloProceso: "Cómo funciona",
  volver: "Volver al inicio",
  tituloFormulario: "Solicitar unirse como centro veterinario",
  subtituloFormulario: "Completa los datos y nuestro equipo revisará tu solicitud.",
  tituloPreguntas: "Preguntas frecuentes",
  continuar: "Continuar",
  atras: "Atrás",
  enviar: "Enviar solicitud",
  enviando: "Enviando…",
  editar: "Editar",
  aceptaContacto: "Acepto que AuraPet me contacte para revisar esta solicitud",
  exitoTitulo: "¡Solicitud enviada!",
  exitoQueSigue: "Lo que viene",
};

export const BENEFICIOS_SOLICITUD: ItemConIcono[] = [
  { icono: CalendarCheck, titulo: "Agenda online", detalle: "Citas en línea y menos inasistencias" },
  { icono: FileText, titulo: "Fichas y recetas digitales", detalle: "Todo el historial en un solo lugar" },
  { icono: Brain, titulo: "Urgencias priorizadas con IA", detalle: "Atiende primero lo que no puede esperar" },
];

export const PROCESO_SOLICITUD: ItemConIcono[] = [
  { icono: Send, titulo: "Envías tu solicitud", detalle: "Toma menos de 3 minutos" },
  { icono: SearchCheck, titulo: "La revisamos", detalle: "En 1 a 3 días hábiles" },
  { icono: BadgeCheck, titulo: "Activamos tu cuenta", detalle: "Te contactamos para empezar" },
];

export const PASOS_WIZARD_SOLICITUD: PasoWizard[] = [
  { titulo: "Tu centro", campos: ["nombreCentro", "direccion", "comuna", "telefonoCentro", "sitioWeb"] },
  { titulo: "Responsable", campos: ["nombreResponsable", "cargo", "correo", "telefonoResponsable", "mensaje"] },
  { titulo: "Revisar", campos: ["aceptaContacto"] },
];

export const CARGOS_RESPONSABLE: OpcionChip<CargoResponsable>[] = [
  { valor: "dueno", texto: "Dueño/a" },
  { valor: "director_medico", texto: "Director/a médico/a" },
  { valor: "administrador", texto: "Administrador/a" },
  { valor: "otro", texto: "Otro" },
];

export const DATOS_SOLICITUD_VACIOS: DatosSolicitudCentro = {
  nombreCentro: "",
  direccion: "",
  comuna: "",
  telefonoCentro: "",
  especialidadIds: [],
  sitioWeb: "",
  nombreResponsable: "",
  cargo: "",
  correo: "",
  telefonoResponsable: "",
  mensaje: "",
  aceptaContacto: false,
};

// Sugerencias para el campo comuna (Región Metropolitana). Se puede escribir cualquier otra.
export const COMUNAS_SUGERIDAS = [
  "Cerrillos", "Cerro Navia", "Colina", "Conchalí", "El Bosque", "Estación Central", "Huechuraba",
  "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Lampa",
  "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa",
  "Padre Hurtado", "Pedro Aguirre Cerda", "Peñaflor", "Peñalolén", "Pirque", "Providencia",
  "Pudahuel", "Puente Alto", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Bernardo",
  "San Joaquín", "San José de Maipo", "San Miguel", "San Ramón", "Santiago", "Talagante", "Vitacura",
];

export const PREGUNTAS_SOLICITUD: PreguntaRespuesta[] = [
  {
    pregunta: "¿Tiene costo unirse?",
    respuesta: "Enviar la solicitud es gratis. Cuando la revisemos te contaremos los planes disponibles antes de activar tu cuenta.",
  },
  {
    pregunta: "¿Qué pasa después de enviar?",
    respuesta: "Nuestro equipo revisa los datos en 1 a 3 días hábiles y te escribe al correo de contacto para coordinar la activación.",
  },
  {
    pregunta: "¿Qué datos necesito tener a mano?",
    respuesta: "El nombre, la dirección y el teléfono del centro, y los datos de contacto de la persona responsable. Los horarios y el equipo se configuran después.",
  },
];

// Mensajes de validación del formulario
export const ERRORES_SOLICITUD = {
  requerido: "Este campo es obligatorio.",
  correo: "Ingresa un correo válido (ej: nombre@correo.cl).",
  telefono: `Ingresa los ${LARGO_TELEFONO_CL} dígitos del teléfono.`,
  cargo: "Elige un cargo.",
  sitioWeb: "Ingresa una dirección válida (ej: www.tucentro.cl).",
  aceptaContacto: "Debes aceptar para enviar la solicitud.",
};

// Cómo se muestra el tipo en "Solicitudes pendientes" del superadmin
export const TIPO_SOLICITUD_LABEL: Record<TipoSolicitud, string> = {
  veterinario: "Veterinario",
  centro: "Centro",
  solicitud_centro: "Quiere unirse",
};

export const TEXTOS_DETALLE_SOLICITUD = {
  titulo: "Solicitud para unirse",
  seccionCentro: "Centro",
  seccionResponsable: "Responsable",
  seccionMensaje: "Mensaje",
  aprobar: "Aprobar y crear centro",
  aprobando: "Aprobando…",
  rechazar: "Rechazar",
  verDetalle: "Ver detalle",
  ayudaAprobar: "Al aprobar se crea el centro. Después crea la cuenta del responsable desde \"+ Crear\" y márcala como administradora del centro.",
};

// =====================================================================
// Panel del superadmin
// =====================================================================
export const MENU_SUPERADMIN: ItemMenuSuperAdmin[] = [
  { seccion: "resumen", texto: "Resumen", icono: LayoutDashboard },
  { seccion: "usuarios", texto: "Usuarios", icono: Users },
  { seccion: "centros", texto: "Centros", icono: Building2 },
  { seccion: "asignaciones", texto: "Centros y veterinarios", icono: Link2 },
  { seccion: "aprobaciones", texto: "Aprobaciones", icono: ClipboardCheck },
  { seccion: "suscripciones", texto: "Suscripciones", icono: CreditCard },
  { seccion: "mensajes", texto: "Mensajes", icono: Inbox },
  { seccion: "citas", texto: "Citas", icono: CalendarDays },
];

export const OPCIONES_CREAR_SUPERADMIN: OpcionCrearSuperAdmin[] = [
  { tipo: "profesional", texto: "Cuenta profesional", icono: Stethoscope },
  { tipo: "dueno", texto: "Cuenta dueño", icono: PawPrint },
  { tipo: "administrativo", texto: "Cuenta administrativa", icono: Building2 },
  { tipo: "superadmin", texto: "Cuenta superadmin", icono: ShieldCheck },
  { tipo: "centro", texto: "Agregar centro", icono: Building },
];

export const TEXTOS_SUPERADMIN = {
  resumen: "Resumen",
  solicitudesPendientes: "Solicitudes pendientes",
  sinPendientes: "No hay solicitudes pendientes.",
  verTodas: "Ver todas",
  proximasCitas: "Próximas citas",
  sinProximasCitas: "No hay citas próximas.",
  aprobar: "Aprobar",
  rechazar: "Rechazar",
  notificaciones: "Solicitudes pendientes",
  configuracion: "Configuración",
  crear: "Crear",
  aprobadaOk: (nombre: string) => `Se aprobó la solicitud de ${nombre}.`,
  rechazadaOk: (nombre: string) => `Se rechazó la solicitud de ${nombre}.`,
};

// Cuánto dura en pantalla el aviso de "aprobada/rechazada"
export const MS_AVISO = 6000;

// Cuántas filas se muestran en las tablas del Resumen
export const LIMITE_PENDIENTES_RESUMEN = 5;
export const LIMITE_CITAS_RESUMEN = 8;

// Columnas (grid-template-columns) de cada tabla del panel
export const COLUMNAS_SUPERADMIN = {
  solicitudes: "2.4fr 1.2fr 1.3fr 1.7fr",
  historial: "2fr 1fr 1fr 1.3fr 1fr 2fr",
  citas: "1.6fr 1.4fr 1.4fr 1.1fr 1fr 0.9fr",
  usuarios: "1.4fr 1.7fr 1fr 1.1fr 0.8fr 0.9fr 0.7fr 1.6fr",
  centros: "1.7fr 0.9fr 1.1fr 0.9fr 0.7fr 0.5fr 0.8fr 1.6fr",
  asignaciones: "1.6fr 0.8fr 2fr 1.5fr",
  suscripciones: "1.6fr 1fr 0.9fr 0.9fr 0.7fr 2fr 1.7fr",
  mensajes: "1.5fr 1fr 2.6fr 1fr 0.9fr 1.6fr",
};

// Colores de las etiquetas que no salen de otra tabla de estilos
export const ETIQUETA_PRUEBA = { texto: "Prueba", fondo: "#fdf3e1", color: "#8a5a00" };
export const ETIQUETA_CUENTA = {
  activa: { texto: "Activa", fondo: "#e3f5f2", color: "#0f8f80" },
  desactivada: { texto: "Desactivada", fondo: "#fdecec", color: "#a4272a" },
};
export const ETIQUETA_DECISION: Record<"aprobado" | "rechazado", { texto: string; fondo: string; color: string }> = {
  aprobado: { texto: "Aprobada", fondo: "#e3f5f2", color: "#0f8f80" },
  rechazado: { texto: "Rechazada", fondo: "#fdecec", color: "#a4272a" },
};

// Qué deja pasar cada chip de filtro de las secciones (los textos están en FILTROS_*)
export const PREDICADOS_FILTRO_USUARIOS: Record<FiltroUsuarios, (u: CuentaUsuario) => boolean> = {
  todos: () => true,
  dueno: (u) => u.rol === "dueno",
  veterinario: (u) => u.rol === "veterinario",
  administrativo: (u) => u.rol === "administrativo",
  superadmin: (u) => u.rol === "superadmin",
  prueba: (u) => u.es_prueba,
};

export const PREDICADOS_FILTRO_CENTROS: Record<FiltroCentros, (c: CentroListado) => boolean> = {
  todos: () => true,
  aprobado: (c) => c.estado === "aprobado",
  pendiente: (c) => c.estado === "pendiente",
  rechazado: (c) => c.estado === "rechazado",
  real: (c) => !c.esPrueba,
  prueba: (c) => c.esPrueba,
};

export const PREDICADOS_FILTRO_ASIGNACIONES: Record<FiltroAsignaciones, (v: VeterinarioAsignaciones) => boolean> = {
  todos: () => true,
  sinCentro: (v) => v.centros.length === 0,
  pendientes: (v) => v.estado === "pendiente",
  prueba: (v) => v.esPrueba,
};

// ---- Aprobaciones ----
export const TEXTOS_APROBACIONES = {
  titulo: "Aprobaciones",
  subtitulo: "Revisa las solicitudes pendientes y el historial de lo que ya se resolvió.",
  pendientes: "Pendientes",
  historial: "Historial",
  sinHistorial: "Todavía no se ha resuelto ninguna solicitud.",
  sinCoincidencias: "Ninguna solicitud coincide con el filtro.",
  buscar: "Buscar por nombre o por quién la revisó…",
};

export const FILTROS_HISTORIAL: OpcionFiltro<FiltroHistorial>[] = [
  { valor: "todas", texto: "Todas" },
  { valor: "aprobado", texto: "Aprobadas" },
  { valor: "rechazado", texto: "Rechazadas" },
];

export const PREDICADOS_FILTRO_HISTORIAL: Record<FiltroHistorial, (s: SolicitudHistorial) => boolean> = {
  todas: () => true,
  aprobado: (s) => s.decision === "aprobado",
  rechazado: (s) => s.decision === "rechazado",
};

// Un centro o veterinario "aprobado" a menos de este tiempo de crearse lo creó
// el superadmin ya aprobado: no fue una solicitud, así que no va al historial.
export const MS_CREADO_YA_APROBADO = 60_000;

// ---- Citas ----
export const TEXTOS_CITAS = {
  titulo: "Citas",
  subtitulo: "Todas las citas de la plataforma.",
  buscar: "Buscar mascota, dueño, veterinario o centro…",
  sinCitas: "Ninguna cita coincide con los filtros.",
  todosEstados: "Todos los estados",
  todasUrgencias: "Todas las urgencias",
};

export const CITAS_POR_PAGINA = 20;
export const MS_ESPERA_BUSQUEDA = 350;   // espera antes de buscar mientras se escribe

export const FILTROS_RANGO_CITAS: OpcionFiltro<RangoCitas>[] = [
  { valor: "proximas", texto: "Próximas" },
  { valor: "hoy", texto: "Hoy" },
  { valor: "pasadas", texto: "Pasadas" },
  { valor: "todas", texto: "Todas" },
];

// =====================================================================
// Registro de veterinarios: dónde trabaja y especialidad
// =====================================================================
export const MIN_LARGO_PASSWORD = 6;
export const MAX_CARACTERES_ESPECIALIDAD_OTRA = 80;
export const MAX_CARACTERES_CENTRO_MENCIONADO = 120;
export const MAX_CARACTERES_COMUNA = 80;

export const DATOS_LABORALES_VACIOS: DatosLaboralesVeterinario = {
  modoCentro: "independiente",
  centroId: null,
  centroNombre: "",
  centroComuna: "",
  especialidadId: null,
  especialidadOtra: "",
};

export const OPCIONES_MODO_CENTRO: OpcionModoCentro[] = [
  { valor: "independiente", titulo: "Independiente", detalle: "Atiendo por mi cuenta, sin un centro" },
  { valor: "centro_aurapet", titulo: "En un centro de AuraPet", detalle: "Mi centro ya trabaja con AuraPet" },
  { valor: "centro_externo", titulo: "En otro centro", detalle: "Mi centro todavía no está en AuraPet" },
];

export const TEXTOS_REGISTRO_VETERINARIO = {
  dondeTrabajas: "¿Dónde trabajas?",
  elegirCentro: "Elige tu centro",
  sinCentros: "Todavía no hay centros disponibles.",
  nombreCentro: "Nombre del centro",
  comunaCentro: "Comuna",
  ayudaExterno: "¡Gracias! Así podremos invitar a tu centro a sumarse a AuraPet.",
  ayudaCentroPublico: "Quedarás asignado a este centro cuando aprobemos tu cuenta.",
  especialidad: "Especialidad",
  ayudaEspecialidad: "Además de medicina general. Elige una o escribe otra.",
  otra: "Otra",
  especialidadOtraPlaceholder: "Ej: Etología",
  centroRequerido: "Elige el centro donde trabajas.",
  nombreCentroRequerido: "Escribe el nombre del centro.",
  passwordCorta: `La contraseña debe tener al menos ${MIN_LARGO_PASSWORD} caracteres.`,
};

export const TEXTOS_CONFIRMAR_PASSWORD = {
  etiqueta: "Confirmar contraseña",
  placeholder: "Repite la contraseña",
  noCoinciden: "Las contraseñas no coinciden.",
  ayuda: "Escríbela de nuevo (no se puede pegar).",
};

// Cómo se describe dónde atiende un veterinario (barra superior y "Centros y veterinarios")
export const TEXTOS_CENTRO_VETERINARIO = {
  independiente: "Atención independiente (sin centro asignado)",
  independienteCorto: "Independiente (sin centro)",
  enRevision: "Cuenta en revisión",
  seAsignaAlAprobar: (centro: string) => `Pidió unirse a ${centro} · se asigna al aprobar`,
  noEstaEnAuraPet: (centro: string) => `${centro} (aún no está en AuraPet)`,
  avisoRevision: "Tu cuenta está en revisión. Un administrador de AuraPet la aprobará pronto; mientras tanto no recibirás citas.",
};

// =====================================================================
// Suscripción de los centros
// =====================================================================
export const PLAN_RECOMENDADO: PlanId = "profesional";
export const COLUMNAS_HISTORIAL_SUSCRIPCION = "1fr 1.6fr 1.3fr 1fr";

export const TEXTOS_SUSCRIPCION = {
  titulo: "Suscripción",
  subtitulo: "Revisa tu plan, su uso y compara opciones.",
  usoTitulo: "Uso del plan",
  comparadorTitulo: "Compara los planes",
  historialTitulo: "Historial",
  sinHistorial: "Todavía no hay movimientos.",
  preguntasTitulo: "Preguntas frecuentes",
  mejorarPlan: "Mejorar plan",
  planActual: "Plan actual",
  elegir: (plan: string) => `Elegir ${plan}`,
  hablarVentas: "Hablar con ventas",
  enRevision: "Solicitud en revisión",
  gratisPrueba: "Gratis durante la prueba",
  gratis: "Gratis",
  porMes: "/mes",
  recomendado: "Recomendado",
  limiteAlcanzado: "Llegaste al límite de tu plan",
  mejorarParaAgregar: "Mejorar para agregar más",
  ilimitado: "Ilimitados",
  diaDePrueba: (dia: number, total: number) => `Día ${dia} de ${total}`,
  terminaPrueba: (fecha: string) => `Tu prueba termina el ${fecha}`,
  pruebaTerminada: "Tu prueba terminó. Elige un plan para seguir usando AuraPet.",
  renueva: (fecha: string) => `Se renueva el ${fecha}`,
  solicitudPendiente: (plan: string) => `Pediste cambiar a ${plan}. El equipo de AuraPet te contactará en 1 día hábil.`,
  citasMes: (n: number) => `${n} ${n === 1 ? "cita" : "citas"} este mes`,
  sinLimiteCitas: "Sin límite de citas",
  // Modal
  modalTitulo: (plan: string) => `Mejorar a ${plan}`,
  modalResumen: (plan: string, precio: string) => `Estás solicitando el plan ${plan} por ${precio}.`,
  modalMensaje: "¿Algo que debamos saber?",
  modalNota: "El equipo de AuraPet te contactará en 1 día hábil para activarlo. No se te cobrará nada todavía.",
  modalEnviar: "Enviar solicitud",
  modalEnviando: "Enviando…",
  modalCancelar: "Cancelar",
  modalExitoTitulo: "¡Solicitud enviada!",
  modalExitoTexto: "Te contactaremos en 1 día hábil para activar tu nuevo plan.",
  modalListo: "Listo",
};

export const MAX_CARACTERES_MENSAJE_PLAN = 500;

// Frase corta bajo el nombre de cada plan
export const DESCRIPCION_PLAN: Record<PlanId, string> = {
  inicial: "Para comenzar",
  profesional: "Para equipos en crecimiento",
  gestion: "Nosotros te ayudamos a operar",
};

// Qué agrega cada plan (resumen en el modal)
export const BENEFICIO_PLAN: Record<PlanId, string> = {
  inicial: "Perfil visible y citas con hasta 2 veterinarios.",
  profesional: "Equipo ilimitado, fichas y recetas digitales, urgencias con IA y reportes.",
  gestion: "Todo lo de Profesional, más soporte prioritario y configuración asistida por AuraPet.",
};

// Comparador: misma lista y mismo orden en los 3 planes
export const FUNCIONES_PLANES: FuncionPlan[] = [
  { texto: "Perfil visible y recibir citas", valores: { inicial: true, profesional: true, gestion: true } },
  { texto: "Veterinarios", valores: { inicial: "Hasta 2", profesional: "Ilimitados", gestion: "Ilimitados" } },
  { texto: "Fichas y recetas digitales", valores: { inicial: false, profesional: true, gestion: true } },
  { texto: "Urgencias priorizadas con IA", valores: { inicial: false, profesional: true, gestion: true } },
  { texto: "Reportes", valores: { inicial: false, profesional: true, gestion: true } },
  { texto: "Soporte prioritario", valores: { inicial: false, profesional: false, gestion: true } },
  { texto: "Configuración asistida por AuraPet", valores: { inicial: false, profesional: false, gestion: true } },
];

export const ESTADO_SUSCRIPCION: Record<EstadoSuscripcion, { texto: string; fondo: string; color: string }> = {
  prueba: { texto: "Prueba", fondo: "#fdf3e1", color: "#8a5a00" },
  activa: { texto: "Activa", fondo: "#e3f5f2", color: "#0f8f80" },
  vencida: { texto: "Vencida", fondo: "#fdecec", color: "#a4272a" },
  cancelada: { texto: "Cancelada", fondo: "#eef0f2", color: "#4b5563" },
};

export const ESTADO_HISTORIAL_SUSCRIPCION: Record<EstadoHistorialSuscripcion, { texto: string; fondo: string; color: string }> = {
  completado: { texto: "Completado", fondo: "#e3f5f2", color: "#0f8f80" },
  pendiente: { texto: "En revisión", fondo: "#fdf3e1", color: "#8a5a00" },
  rechazado: { texto: "Rechazado", fondo: "#fdecec", color: "#a4272a" },
};

export const PREGUNTAS_SUSCRIPCION: PreguntaRespuesta[] = [
  {
    pregunta: "¿Puedo cambiar de plan cuando quiera?",
    respuesta: "Sí. Elige el plan y envía la solicitud; el equipo de AuraPet lo activa y el cambio rige desde ese momento.",
  },
  {
    pregunta: "¿Qué pasa cuando termina la prueba?",
    respuesta: "Tu centro sigue visible, pero para mantener todas las funciones tienes que elegir un plan. No perderás tus datos.",
  },
  {
    pregunta: "¿Cómo se paga?",
    respuesta: "Por ahora coordinamos el pago contigo cuando activamos el plan. Pronto podrás pagar en línea desde aquí.",
  },
];

// =====================================================================
// Detalle de usuario (superadmin)
// =====================================================================
export const TEXTOS_DETALLE_USUARIO = {
  verDetalles: "Ver detalles",
  cuenta: "Cuenta",
  profesional: "Ficha profesional",
  centrosAtiende: "Centros donde atiende",
  centrosAdministra: "Centros que administra",
  mascotas: "Mascotas",
  actividad: "Actividad",
  ultimasCitas: "Últimas citas",
  sinCentrosAtiende: "No atiende en ningún centro.",
  sinCentrosAdministra: "No administra ningún centro.",
  sinMascotas: "No tiene mascotas registradas.",
  sinCitas: "Todavía no tiene citas.",
  nuncaIngreso: "Nunca ha ingresado",
  editarCuenta: "Editar cuenta",
  cerrar: "Cerrar",
  cargando: "Cargando detalle…",
};

// =====================================================================
// Detalle de centro (superadmin)
// =====================================================================
export const NOMBRE_DIA: Record<number, string> = {
  1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado", 7: "Domingo",
};

export const TEXTOS_DETALLE_CENTRO = {
  datos: "Datos del centro",
  actividad: "Actividad",
  horario: "Horario de atención",
  sinHorario: "Todavía no registra su horario.",
  cerrado: "Cerrado",
  especialidades: "Especialidades",
  sinEspecialidades: "Sin especialidades registradas.",
  suscripcion: "Suscripción",
  sinSuscripcion: "Sin suscripción.",
  administradores: "Administradores",
  sinAdministradores: "Este centro no tiene administradores.",
  veterinarios: "Veterinarios",
  sinVeterinarios: "Ningún veterinario atiende aquí todavía.",
  ultimasCitas: "Últimas citas",
  origen: "Llegó por solicitud",
  editarCentro: "Editar centro",
  cargando: "Cargando detalle…",
  verDetalles: "Ver detalles",
};

// Cita rechazada por el veterinario (vista del dueño)
export const ETIQUETA_RECHAZADA = "Rechazada por el veterinario";
export const MOTIVO_RECHAZO_SIN_DETALLE = "El veterinario no indicó un motivo.";

// ---- Suscripciones (superadmin, migración 28) ----
export const MESES_ACTIVACION_PLAN = 1;       // al activar un plan, la primera renovación queda a 1 mes
export const DIAS_EXTENSION_SUSCRIPCION = 15; // botón "+15 días" (prueba o renovación)

export const FILTROS_SUSCRIPCIONES: OpcionFiltro<FiltroSuscripciones>[] = [
  { valor: "todas", texto: "Todas" },
  { valor: "por_atender", texto: "Por atender" },
  { valor: "prueba", texto: "En prueba" },
  { valor: "activa", texto: "Activas" },
  { valor: "vencida", texto: "Vencidas" },
];

export const PREDICADOS_FILTRO_SUSCRIPCIONES: Record<FiltroSuscripciones, (s: SuscripcionListada) => boolean> = {
  todas: () => true,
  por_atender: (s) => s.solicitud !== null,
  prueba: (s) => s.estado === "prueba",
  activa: (s) => s.estado === "activa",
  vencida: (s) => s.estado === "vencida" || s.estado === "cancelada",
};

export const TEXTOS_SUSCRIPCIONES = {
  titulo: "Suscripciones",
  subtitulo: "Plan de cada centro. Las solicitudes de cambio de plan llegan acá: al activarla, el plan queda activo por " +
    `${MESES_ACTIVACION_PLAN} mes y luego se renueva a mano (todavía no hay pagos en línea).`,
  activar: "Activar",
  rechazar: "Rechazar",
  extender: `+${DIAS_EXTENSION_SUSCRIPCION} días`,
  sinSolicitud: "—",
  ilimitado: "∞",
  confirmarRechazo: (centro: string, plan: string) => `¿Rechazar la solicitud de ${centro} para pasar al plan ${plan}?`,
  activado: (centro: string, plan: string) => `${centro} quedó con el plan ${plan} activo.`,
  rechazado: (centro: string) => `Se rechazó la solicitud de ${centro}.`,
  extendido: (centro: string) => `Se extendió la suscripción de ${centro} en ${DIAS_EXTENSION_SUSCRIPCION} días.`,
  vacio: "Todavía no hay centros con suscripción.",
  vacioFiltro: "Ninguna suscripción coincide con el filtro.",
};

// ---- Derivaciones (migración 29) ----
export const MAX_CARACTERES_DERIVACION = 500;
export const MAX_CARACTERES_RESULTADO_DERIVACION = 1000;

export const ESTADO_DERIVACION: Record<EstadoDerivacion, { texto: string; fondo: string; color: string }> = {
  pendiente: { texto: "Pendiente", fondo: "#fdf3e1", color: "#8a5a00" },
  realizada: { texto: "Realizada", fondo: "#e3f5f2", color: "#0f8f80" },
  cancelada: { texto: "Cancelada", fondo: "#eef0f2", color: "#4b5563" },
};

export const PESTANAS_DERIVACIONES: { valor: PestanaDerivaciones; texto: string }[] = [
  { valor: "recibidas", texto: "Recibidas" },
  { valor: "enviadas", texto: "Enviadas" },
];

export const TEXTOS_DERIVACION = {
  tituloFicha: "Derivaciones",
  vaciaFicha: "Este paciente no tiene derivaciones.",
  derivar: "Derivar",
  tituloForm: "Derivar paciente",
  destino: "Derivar a",
  elegirDestino: "Elige un veterinario o un centro…",
  grupoVeterinarios: "Veterinarios",
  grupoCentros: "Centros",
  motivo: "Motivo de la derivación",
  placeholderMotivo: "Ej: Sospecha de cardiopatía, se requiere ecocardiograma.",
  ayudaForm: "Se agrega al historial del paciente y el destino podrá ver su ficha para atenderlo.",
  guardar: "Derivar paciente",
  guardando: "Derivando…",
  marcarRealizada: "Marcar realizada",
  rechazar: "Rechazar",
  cancelar: "Cancelar derivación",
  confirmarCancelar: "¿Cancelar esta derivación?",
  resultado: "Resultado de la atención",
  placeholderResultado: "Qué se hizo y qué se encontró (lo verá quien derivó y el dueño).",
  placeholderRechazo: "Motivo del rechazo (opcional)",
  enviar: "Guardar",
  verFicha: "Ver ficha",
  tituloModal: "Derivaciones",
  subtituloModal: "Pacientes que te derivaron y los que derivaste tú",
  vaciaRecibidas: "No te han derivado pacientes.",
  vaciaEnviadas: "Todavía no derivas pacientes.",
  tituloDueno: "Derivaciones",
  subtituloDueno: "Cuando un veterinario deriva a tu mascota a un especialista o a otro centro, aparece acá.",
};

// ---- Recuperar contraseña ----
export const TEXTOS_RECUPERAR_PASSWORD = {
  enlace: "¿Olvidaste tu contraseña?",
  titulo: "Recupera tu contraseña",
  subtitulo: "Te enviaremos un enlace para crear una nueva",
  enviar: "Enviar enlace",
  enviando: "Enviando…",
  enviado: (correo: string) => `Si ${correo} tiene una cuenta, te llegará un correo con el enlace. Revisa también spam.`,
  volver: "← Volver a ingresar",
  tituloNueva: "Crea tu nueva contraseña",
  subtituloNueva: "Elige una contraseña de al menos 6 caracteres.",
  etiquetaNueva: "Nueva contraseña",
  guardar: "Guardar contraseña",
  guardando: "Guardando…",
  guardada: "¡Listo! Tu contraseña quedó actualizada.",
  continuar: "Ir a mi panel",
  sinSesion: "El enlace venció o ya se usó. Pide uno nuevo desde \"¿Olvidaste tu contraseña?\".",
  volverInicio: "Volver al inicio",
};
export const LARGO_MINIMO_PASSWORD = 6;

// ---- Contacto ----
export const ASUNTOS_CONTACTO = ["Soporte técnico", "Para dueños", "Para veterinarias", "Otro"];
export const CONTACTO_VACIO: DatosContacto = { nombre: "", correo: "", asunto: ASUNTOS_CONTACTO[0], mensaje: "" };
export const LIMITES_CONTACTO = { nombreMin: 2, nombreMax: 120, correoMax: 160, mensajeMin: 10, mensajeMax: 2000 };

export const OTRAS_FORMAS_CONTACTO: OtraFormaContacto[] = [
  { titulo: "Soporte para dueños", descripcion: "¿Tienes dudas sobre tu mascota o tu cuenta?", icono: User, correo: "soporte@aurapet.com" },
  { titulo: "Soporte para veterinarias", descripcion: "Ayuda para centros y profesionales afiliados", icono: PawPrint, correo: "veterinarias@aurapet.com" },
  { titulo: "Prensa y alianzas", descripcion: "Para medios y posibles socios", icono: Megaphone, correo: "prensa@aurapet.com" },
];

export const TEXTOS_CONTACTO = {
  enviar: "Enviar mensaje",
  enviando: "Enviando…",
  enviado: "¡Gracias! Recibimos tu mensaje y te responderemos al correo que dejaste.",
  errorNombre: `Escribe tu nombre (mínimo ${LIMITES_CONTACTO.nombreMin} letras).`,
  errorCorreo: "Escribe un correo válido.",
  errorMensaje: `El mensaje debe tener al menos ${LIMITES_CONTACTO.mensajeMin} caracteres.`,
};

export const ESTADO_CONTACTO: Record<EstadoContacto, { texto: string; fondo: string; color: string }> = {
  pendiente: { texto: "Pendiente", fondo: "#fdf3e1", color: "#8a5a00" },
  respondido: { texto: "Respondido", fondo: "#e3f5f2", color: "#0f8f80" },
  cerrado: { texto: "Cerrado", fondo: "#eef0f2", color: "#4b5563" },
};

export const FILTROS_MENSAJES: OpcionFiltro<FiltroMensajes>[] = [
  { valor: "todos", texto: "Todos" },
  { valor: "pendiente", texto: "Pendientes" },
  { valor: "respondido", texto: "Respondidos" },
  { valor: "cerrado", texto: "Cerrados" },
];

export const PREDICADOS_FILTRO_MENSAJES: Record<FiltroMensajes, (m: MensajeContacto) => boolean> = {
  todos: () => true,
  pendiente: (m) => m.estado === "pendiente",
  respondido: (m) => m.estado === "respondido",
  cerrado: (m) => m.estado === "cerrado",
};

export const TEXTOS_MENSAJES = {
  titulo: "Mensajes de contacto",
  subtitulo: "Lo que llega desde el formulario de Contacto. Responde por correo y marca el estado para llevar el orden.",
  responder: "Responder",
  marcarRespondido: "Respondido",
  cerrar: "Cerrar",
  reabrir: "Reabrir",
  vacio: "Todavía no llegan mensajes.",
  vacioFiltro: "Ningún mensaje coincide con el filtro.",
};

// ---- Panel del centro (admin del centro) ----
export const MENU_CENTRO_ADMIN: ItemMenuCentroAdmin[] = [
  { seccion: "resumen", texto: "Resumen", icono: LayoutDashboard },
  { seccion: "agenda", texto: "Agenda", icono: CalendarDays },
  { seccion: "equipo", texto: "Equipo", icono: Users },
  { seccion: "centro", texto: "Mi centro", icono: Building2 },
  { seccion: "suscripcion", texto: "Suscripción", icono: CreditCard },
];

export const DIAS_SEMANA = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]; // 1 = lunes
export const COLUMNAS_CITAS_CENTRO = "1.5fr 1.3fr 1.6fr 1fr 1fr 1fr";
export const MAX_PROXIMAS_CITAS_CENTRO = 5;
export const MS_AVISO_GUARDADO = 3000;

export const TEXTOS_CENTRO_ADMIN = {
  administrando: "Administrando",
  sinCentro: "Todavía no administras ningún centro. Pídele a un superadmin que te asigne uno.",
  volverAgenda: "Volver a mi agenda",
  configuracion: "Configuración",
  tituloResumen: "Resumen",
  subtituloResumen: "Cómo va tu centro hoy.",
  citasHoy: "Citas hoy",
  porConfirmar: "Por confirmar",
  citasMes: "Citas del mes",
  equipo: "Veterinarios",
  ilimitado: "sin límite en tu plan",
  limite: (n: number) => `de ${n} en tu plan`,
  proximas: "Próximas citas",
  verAgenda: "Ver agenda",
  sinProximas: "No hay citas próximas.",
  tituloAgenda: "Agenda del centro",
  subtituloAgenda: "Todas las citas del centro, de la más reciente a la más antigua.",
  sinCitas: "Todavía no hay citas en este centro.",
  tituloEquipo: "Equipo",
  subtituloEquipo: "Veterinarios y administradores de este centro. Para sumar o quitar personas, contacta a un superadmin.",
  sinEquipo: "Este centro todavía no tiene equipo asignado.",
  centroPrueba: "(centro de pruebas)",
  datosCentro: "Datos del centro",
  horario: "Horario de atención",
  sinHorario: "Sin horarios registrados.",
  cerrado: "Cerrado",
  especialidades: "Especialidades",
  sinEspecialidades: "Sin especialidades registradas.",
  obligatorios: "Nombre, dirección y comuna son obligatorios.",
  guardado: "Cambios guardados.",
  guardar: "Guardar cambios",
  guardando: "Guardando…",
};

export const ETIQUETA_MIEMBRO = {
  veterinario: { texto: "Veterinario", fondo: "#e3f5f2", color: "#0f8f80" },
  admin: { texto: "Admin", fondo: "#f3eefe", color: "#6b3fb8" },
};

// ---- Configuración → Privacidad y datos ----
export const TEXTOS_PRIVACIDAD = {
  descargarTitulo: "Descargar mis datos",
  descargarAyuda: "Un archivo JSON con tu cuenta y, si corresponde, tus mascotas (citas, historial, recetas y derivaciones) o tu ficha profesional.",
  descargar: "Descargar mis datos",
  descargando: "Preparando…",
  descargado: "Listo, revisa tus descargas.",
  eliminarTitulo: "Eliminar mi cuenta",
  eliminarAyuda: "Por seguridad la eliminación la hace el equipo de AuraPet (el historial médico puede tener que conservarse). Escríbenos y la gestionamos.",
  eliminar: "Pedir eliminación",
  nombreArchivo: (fecha: string) => `aurapet-mis-datos-${fecha}.json`,
};
