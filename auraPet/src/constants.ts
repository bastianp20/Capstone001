import type { CSSProperties } from "react";
import type {EstadoCita, UrgenciaCita, EspecieMascota, 
  // VistaHome, 
  Servicio, MedicamentoReceta, ColumnaMedicamento, AtajoProximoControl, PasoCita, ItemMenuDueno, TipoRegistro,
  OpcionFiltro, FiltroUsuarios, FiltroAsignaciones, FiltroCentros, EstadoVerificacion, RolCuenta} from '../src/interfaces'; 
import {
  Menu, Search, Bell, User, UserCircle, LogOut, Settings, Calendar, Filter, ChevronDown, ChevronRight, X, Plus, MoreVertical, Home,
  PawPrint, Heart, CalendarPlus, History, FileText,Stethoscope, Syringe, ClipboardList, ClipboardPlus, Share2, Microscope, Activity,
  Building2, Clock, MapPin, Phone, Users, ShieldCheck, Building, Settings2, AlertTriangle, AlertCircle, Info, Brain, ListOrdered,
  CheckCircle2, XCircle, Clock3, Loader2, Dog, Cat, ShieldPlus, Scissors, Trash2,
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
