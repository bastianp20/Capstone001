import type { CSSProperties } from "react";
import fotoAdoptaPerro from "./assets/login/fondologin.png";
import fotoAdoptaPareja from "./assets/Home/siguientePaso.png";
import fotoAdoptaRetrato from "./assets/Home/fondo.png";
import type {EstadoCita, UrgenciaCita, EspecieMascota, 
  // VistaHome, 
  Servicio, MedicamentoReceta, ColumnaMedicamento, AtajoProximoControl, PasoCita, ItemMenuDueno, TipoRegistro,
  OpcionFiltro, FiltroUsuarios, FiltroAsignaciones, FiltroCentros, EstadoVerificacion, RolCuenta, EstadoVacuna, CargoResponsable, DatosSolicitudCentro, ItemConIcono, OpcionChip, PasoWizard, PreguntaRespuesta, TipoSolicitud, ItemMenuSuperAdmin, OpcionCrearSuperAdmin, CuentaUsuario, CentroListado, VeterinarioAsignaciones, FiltroHistorial, RangoCitas, SolicitudHistorial, DatosLaboralesVeterinario, OpcionModoCentro, EstadoSuscripcion, EstadoHistorialSuscripcion, FuncionPlan, PlanId, FiltroSuscripciones, SuscripcionListada, EstadoDerivacion, PestanaDerivaciones, DatosContacto, EstadoContacto, FiltroMensajes, MensajeContacto, OtraFormaContacto, ItemMenuCentroAdmin, EstadoSolicitudEliminacion, ColorNota, DatosNota, OpcionTema, DiaFormulario, TestimonioHome, PasoHome, OpcionesConfirmacion, AnimalAdopcion, OpcionAdopcion, TamanoAdopcion, EtapaAdopcion, SexoAdopcion, FiltroEspecieAdopcion, FiltrosExtraAdopcion, EspecieAdopcion, FotoMosaico, FiltroPublicaciones, EstadoPublicacion, HitoCaminoCasa, TipoActividadPublicacion, EstadoGeneralAtencion, ProcedimientoAtencion, PestanaSolidaria, DatosAtencionAdopcion, FiltrosSolidaria, RecepcionRefugio, FiltrosRefugios, RasgoAdopcion, RasgosAdopcion, PasoFormulario, CampoPostulacionAdopcion, CampoPublicarAdopcion, DatosPostulacionAdopcion, DatosPublicarAdopcion, ViviendaAdopcion, TenenciaAdopcion, EstadoBotonAdoptar} from '../src/interfaces'; 
import {
  Menu, Search, Bell, User, UserCircle, Megaphone, Inbox, UserX, StickyNote, Pin, PinOff, Download, Sun, Moon, Monitor, LogOut, Settings, Calendar, Filter, ChevronDown, ChevronRight, X, Plus, MoreVertical, Home,
  PawPrint, Heart, CalendarPlus, History, FileText,Stethoscope, Syringe, ClipboardList, ClipboardPlus, Share2, Microscope, Activity,
  Building2, Clock, MapPin, Phone, Users, ShieldCheck, Building, Settings2, AlertTriangle, AlertCircle, Info, Brain, ListOrdered,
  CheckCircle2, XCircle, Clock3, Loader2, Dog, Cat, ShieldPlus, Scissors, Trash2, ChevronLeft, Pencil, Scale, CalendarCheck, Send, SearchCheck, BadgeCheck, Check, ArrowRight, ArrowLeft, LayoutDashboard, ClipboardCheck, CalendarDays, Link2, CreditCard, Sparkles, Lock, Camera, HeartHandshake, HandHeart, Smile, HeartPulse, Eye as IconoOjo, Syringe as IconoJeringa, Bug, Scissors as IconoTijeras, ScanSearch,
} from 'lucide-react';

import { Ban, CircleAlert, DoorOpen, House, HouseHeart, Rabbit } from "lucide-react";
import type { CampoRefugio, DatosRefugio, EspecieRefugio, EstadoRefugio, FiltroEstadoRefugio, FiltrosRefugiosAdmin, PestanaMiRefugio } from "./interfaces";

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
  nota: StickyNote,
  descargar: Download,
  fijar: Pin,
  desfijar: PinOff,
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

export const RUTA_ADOPTA = "/adopta"; // página pública de adopción
export const RUTA_PUBLICAR_ADOPCION = "/adopta/publicar"; // "Dar en adopción"
export const rutaFichaAdopcion = (id: number) => `/adopta/${id}`;
export const RUTA_CONTACTO_REPORTE = "/contacto"; // "Reportar una publicación" (por ahora, el formulario de contacto)

export const links: { ruta: string; label: string }[] = [
  { ruta: "/como-funciona", label: "Cómo funciona" },
  { ruta: "/veterinarias", label: "Para veterinarias" },
  { ruta: "/duenos", label: "Para dueños" },
  { ruta: RUTA_ADOPTA, label: "Adopta" },
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
  { id: "publicaciones", texto: "Mis publicaciones", icono: Megaphone },
  { id: "refugio", texto: "Mi refugio", icono: HouseHeart },
  { id: "adopcion", texto: "Dar en adopción", icono: HeartHandshake },
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
export const TEXTO_MI_PANEL = "Mi panel";                  // botón de la barra pública cuando hay sesión
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
  { seccion: "eliminaciones", texto: "Eliminaciones", icono: UserX },
  { seccion: "notas", texto: "Notas", icono: StickyNote },
  { seccion: "citas", texto: "Citas", icono: CalendarDays },
  { seccion: "refugios", texto: "Refugios", icono: House },
  { seccion: "publicaciones", texto: "Mis publicaciones", icono: Megaphone },
  { seccion: "miRefugio", texto: "Mi refugio", icono: HouseHeart },
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
  mensajes: "1.8fr 1.1fr 2.3fr 0.9fr 0.9fr 1.7fr",
  eliminaciones: "1.6fr 0.9fr 2.2fr 0.9fr 1fr 1.6fr",
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
  enviarCorto: "Enviar",
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
  { seccion: "publicaciones", texto: "Mis publicaciones", icono: Megaphone },
  { seccion: "refugio", texto: "Mi refugio", icono: HouseHeart },
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
  nombreArchivo: (fecha: string) => `aurapet-mis-datos-${fecha}.json`,
};

// Formulario "¿Te podemos ayudar?" del inicio: no tiene campo de asunto, va fijo
export const ASUNTO_CONTACTO_INICIO = "Consulta desde el inicio";
export const CONTACTO_INICIO_VACIO: DatosContacto = { ...CONTACTO_VACIO, asunto: ASUNTO_CONTACTO_INICIO };

// ---- Eliminación de cuenta (migración 32) ----
export const MAX_CARACTERES_MOTIVO_ELIMINACION = 500;

export const ESTADO_SOLICITUD_ELIMINACION: Record<EstadoSolicitudEliminacion, { texto: string; fondo: string; color: string }> = {
  pendiente: { texto: "Pendiente", fondo: "#fdf3e1", color: "#8a5a00" },
  aprobada: { texto: "Cuenta desactivada", fondo: "#fdecec", color: "#a4272a" },
  rechazada: { texto: "Rechazada", fondo: "#eef0f2", color: "#4b5563" },
};

export const TEXTOS_ELIMINACION = {
  // Configuración (la persona)
  titulo: "Eliminar mi cuenta",
  ayuda: "Tu cuenta se desactiva y ya no podrás ingresar. El historial médico de tus mascotas se conserva, como exige la ley.",
  placeholderMotivo: "¿Por qué quieres eliminar tu cuenta? (opcional)",
  pedir: "Pedir eliminación",
  pidiendo: "Enviando…",
  enRevision: (fecha: string) => `Pediste la eliminación el ${fecha}. Está en revisión.`,
  rechazada: "Tu solicitud anterior fue rechazada.",
  // Superadmin
  tituloSeccion: "Solicitudes de eliminación",
  subtituloSeccion: "Cuentas que pidieron ser eliminadas. Desactivar impide que vuelvan a ingresar; el historial médico se conserva.",
  aprobar: "Desactivar cuenta",
  rechazar: "Rechazar",
  tituloRechazo: "Rechazar solicitud de eliminación",
  descripcionRechazo: "La persona verá este motivo en Configuración.",
  desactivada: (nombre: string) => `La cuenta de ${nombre} quedó desactivada.`,
  rechazadaOk: (nombre: string) => `Se rechazó la solicitud de ${nombre}.`,
  vacio: "No hay solicitudes de eliminación.",
  pendientes: (n: number) => (n === 1 ? "Hay 1 solicitud esperando respuesta." : `Hay ${n} solicitudes esperando respuesta.`),
};

// ---- Notas personales (migración 33) ----
export const MAX_CARACTERES_TITULO_NOTA = 120;
export const MAX_CARACTERES_NOTA = 4000;

// Nombre de cada color (los colores en sí están en css/notas/Notas.module.css)
export const COLORES_NOTA: Record<ColorNota, string> = {
  menta: "Menta",
  arena: "Arena",
  cielo: "Cielo",
  lavanda: "Lavanda",
  coral: "Coral",
};

export const NOTA_VACIA: DatosNota = { titulo: "", contenido: "", color: "menta" };

export const TEXTOS_NOTAS = {
  titulo: "Notas",
  descripcionSuperadmin: "Tu libreta: pendientes, ideas o recordatorios. Solo tú ves tus notas.",
  descripcionVeterinario: "Apuntes personales: pendientes, recordatorios o ideas. Solo tú ves tus notas.",
  nueva: "Nueva nota",
  editar: "Editar nota",
  placeholderTitulo: "Título",
  placeholderContenido: "Escribe tu nota…",
  color: "Color",
  guardar: "Guardar",
  guardando: "Guardando…",
  cancelar: "Cancelar",
  fijar: "Fijar arriba",
  desfijar: "Quitar de arriba",
  borrar: "Borrar",
  vacio: "Todavía no tienes notas. Crea la primera con \"Nueva nota\".",
  editada: (fecha: string) => `Editada ${fecha}`,
  buscar: "Buscar en mis notas…",
  sinResultados: "Ninguna nota coincide con la búsqueda.",
};

// ---- Ficha médica en PDF (lib/pdf/) ----
export const FORMATO_PDF = "letter";      // tamaño carta (en Chile se usa más que A4)
export const MAX_REGISTROS_RESUMEN_PDF = 3;
export const MAX_CARACTERES_RESUMEN_PDF = 220;

// Colores del PDF en RGB (jsPDF no lee variables CSS); mismos de theme.css
export const COLORES_PDF = {
  primario: [15, 143, 128],
  secundario: [227, 245, 242],
  texto: [26, 31, 39],
  muted: [107, 114, 128],
  borde: [228, 230, 234],
  tarjeta: [245, 247, 248],
  rojo: [164, 39, 42],
  ambar: [210, 155, 42],
} as const;

export const TEXTOS_PDF = {
  marca: "AuraPet",
  tituloFicha: "FICHA MÉDICA VETERINARIA",
  tituloResumen: "RESUMEN DE FICHA",
  tituloReceta: "RECETA MÉDICA VETERINARIA",
  cortoFicha: "Ficha Médica Veterinaria",
  cortoResumen: "Resumen de ficha",
  cortoReceta: "Receta médica veterinaria",
  emitida: "Emitido automáticamente por AuraPet",
  pacienteTutor: "PACIENTE Y TUTOR",
  alertas: "ALERTAS CLÍNICAS",
  sinAlertas: "Sin alertas registradas.",
  alergia: "Alergias: ",
  condicion: "Condiciones crónicas: ",
  vacunas: "HISTORIAL DE VACUNAS",
  sinVacunas: "Sin vacunas con próxima dosis registradas.",
  historial: "HISTORIAL MÉDICO Y CLÍNICO",
  sinHistorial: "Sin registros médicos.",
  ultimosRegistros: "ÚLTIMOS REGISTROS MÉDICOS",
  recetas: "RECETAS",
  sinRecetas: "Sin recetas emitidas.",
  derivaciones: "DERIVACIONES",
  sinDerivaciones: "Sin derivaciones.",
  prescripcion: "PRESCRIPCIÓN",
  indicaciones: "Indicaciones: ",
  proximoControl: "Próximo control: ",
  tratamiento: "Tratamiento: ",
  proximaDosis: "Próxima dosis o control: ",
  firma: "Firma y timbre del médico veterinario",
  colegiado: (n: string | null) => `N° de colegiado: ${n ?? "________________"}`,
  emitidaPor: (vet: string, centro: string | null, fecha: string) => `Emitida por ${vet}${centro ? ` · ${centro}` : ""} · ${fecha}`,
  confidencial: "Documento clínico confidencial. Contiene datos sensibles de salud protegidos por la Ley 19.628 sobre protección de la vida privada. Uso exclusivo del tutor y de los profesionales tratantes.",
  pagina: (actual: number, total: number) => `Página ${actual} de ${total}`,
  columnasVacunas: ["Vacuna", "Fecha de aplicación", "Próxima dosis", "Estado"],
  columnasMedicamentos: ["Medicamento", "Dosis", "Frecuencia", "Duración"],
  columnasDerivaciones: ["Fecha", "Derivado por", "Destino", "Motivo", "Estado", "Resultado"],
  campos: {
    nombre: "Nombre: ", especie: "Especie: ", raza: "Raza: ", sexo: "Sexo: ", nacimiento: "F. nacimiento: ",
    peso: "Peso: ", esterilizado: "Esterilizado: ", microchip: "Microchip: ", tutor: "Tutor: ", telefono: "Teléfono: ",
  },
  // Botones
  fichaCompleta: "Ficha completa (PDF)",
  resumen: "Resumen (PDF)",
  receta: "Receta (PDF)",
  generando: "Generando…",
  tituloDescargas: "Ficha médica en PDF",
  ayudaDescargas: "Descarga la ficha con el formato de AuraPet para guardarla, imprimirla o llevarla a otra clínica.",
  mascota: "Mascota",
  archivo: (tipo: string, nombre: string, fecha: string) => `aurapet-${tipo}-${nombre}-${fecha}.pdf`,
};

// =====================================================================
// CONSTANTES QUE ESTABAN SUELTAS EN OTROS ARCHIVOS (ordenadas el 20-10-2026)
// =====================================================================

// ---- Tema (lib/tema.ts) ----
export const CLAVE_TEMA = "aurapet-tema";          // localStorage
export const TEMA_POR_DEFECTO = "claro";
export const OPCIONES_TEMA: OpcionTema[] = [
  { valor: "claro", texto: "Claro", icono: Sun },
  { valor: "oscuro", texto: "Oscuro", icono: Moon },
  { valor: "auto", texto: "Automático", icono: Monitor },
];

// ---- Formularios ----
export const REGEX_CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// ---- Notas: orden de los colores en el selector ----
export const LISTA_COLORES_NOTA = Object.keys(COLORES_NOTA) as ColorNota[];

// ---- Panel del centro: días de la semana en orden (1 = lunes) ----
export const DIAS_SEMANA_ORDEN = [1, 2, 3, 4, 5, 6, 7];

// ---- Citas (superadmin): estados para el filtro ----
export const ESTADOS_CITA = Object.keys(ESTADO_LABEL) as EstadoCita[];

// ---- Solicitud de centro: todos los campos del wizard ----
export const CAMPOS_WIZARD_SOLICITUD = PASOS_WIZARD_SOLICITUD.flatMap((p) => p.campos);

// ---- Landing ----
export const TESTIMONIOS_VISIBLES_HOME = 3;
export const TESTIMONIOS_HOME: TestimonioHome[] = [
  { texto: "Agendar hora para mi perro nunca había sido tan fácil.", nombre: "Camila Rojas", rol: "Dueña de mascota" },
  { texto: "Tener el historial digital me ahorra tiempo en cada consulta.", nombre: "Ana Duarte", rol: "Veterinaria" },
  { texto: "Encontré una veterinaria cerca en minutos.", nombre: "Joaquín Bahes", rol: "Dueño de mascota" },
  { texto: "La app me ayuda a organizar mi agenda de pacientes.", nombre: "Frank de Álamos", rol: "Veterinario" },
];

export const PASOS_HOME: PasoHome[] = [
  { numero: 1, titulo: "Regístrate", descripcion: "Crea tu cuenta como dueño o veterinaria en minutos." },
  { numero: 2, titulo: "Encuentra tu veterinaria", descripcion: "Busca por cercanía, especialidad o disponibilidad." },
  { numero: 3, titulo: "Agenda tu cita", descripcion: "Elige el horario que más te acomode y listo." },
];

// ---- Crear centro: horarios por defecto ----
// Valores por defecto: lunes a viernes 9 a 19 con colación, sábado 10 a 14, domingo cerrado
export const DIAS_INICIALES_CENTRO: DiaFormulario[] = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo",
].map((nombre, i) => ({
  dia: i + 1,
  nombre,
  atiende: i < 6,
  abre: i === 5 ? "10:00" : "09:00",
  cierra: i === 5 ? "14:00" : "19:00",
  conColacion: i < 5,
  inicioColacion: "14:00",
  finColacion: "15:00",
}));

// ---- PDF: medidas en mm (lib/pdf/plantilla.ts) ----
export const MEDIDAS_PDF = {
  margen: 18,           // margen lateral y superior del contenido
  marco: 7,             // borde verde, medido desde el canto de la hoja
  inicioPaginas: 30,    // donde parte el contenido desde la página 2
  reservaPie: 26,       // alto reservado para el pie de página
  ptAMm: 0.3528,        // 1 punto tipográfico en mm
};

// ---- Solicitar cita: centro o veterinario independiente (migración 35) ----
export const VALOR_ATENCION_INDEPENDIENTE = "independiente";   // valor del <select> de centro
export const TEXTO_ATENCION_INDEPENDIENTE = "Atención independiente";
export const ESPECIALIDAD_POR_DEFECTO = "Medicina general";

export const TEXTOS_SOLICITAR_CITA = {
  elegirCentro: "Elige un centro",
  grupoCentros: "Centros",
  grupoIndependiente: "Sin centro",
  opcionIndependiente: "Veterinario independiente",
  sinPreferencia: "Sin preferencia",
  elegirVeterinario: "Elige un veterinario",
  sinIndependientes: "No hay veterinarios independientes disponibles",
  especialidad: (e: string) => `Especialidad: ${e}`,
  ayudaIndependiente: "Atiende de forma independiente: al confirmar tu hora te indicará dónde será la atención.",
  faltanDatos: "Completa mascota, dónde atenderte, fecha, hora y motivo.",
  faltaVeterinario: "Elige el veterinario independiente que te atenderá.",
  enviadaA: (destino: string) => `Tu solicitud fue enviada a ${destino}.`,
};

// =====================================================================
// CONFIRMACIONES (components/confirmacion/ConfirmarModal.tsx)
// Cada acción delicada tiene aquí su texto; se usan con useConfirmar().
// =====================================================================
export const TEXTOS_CONFIRMACION = {
  cancelar: "Cancelar",
  cerrar: "Cerrar",
  permanente: "Atención: esto se eliminará de forma permanente y no se podrá recuperar. ¿Aún así deseas continuar?",
  sinVuelta: "Esta acción no se puede deshacer.",
};

export const CONFIRMACIONES = {
  borrarNota: (titulo: string): OpcionesConfirmacion => ({
    tipo: "peligro",
    titulo: "¿Borrar esta nota?",
    mensaje: "La nota se borrará de tu libreta.",
    detalle: titulo,
    permanente: true,
    textoConfirmar: "Sí, borrar nota",
  }),
  quitarVeterinarioDeCentro: (veterinario: string, centro: string): OpcionesConfirmacion => ({
    tipo: "peligro",
    titulo: "¿Quitar al veterinario del centro?",
    mensaje: `${veterinario} dejará de atender en ${centro}. También se borran sus horarios de atención en ese centro.`,
    detalle: `${veterinario} · ${centro}`,
    permanente: true,
    textoConfirmar: "Sí, quitar",
  }),
  cancelarCita: (detalle?: string): OpcionesConfirmacion => ({
    tipo: "advertencia",
    titulo: "¿Cancelar esta cita?",
    mensaje: "El veterinario verá que la cancelaste. Si la necesitas de nuevo, tendrás que pedir otra hora.",
    detalle,
    textoConfirmar: "Sí, cancelar cita",
    textoCancelar: "Volver",
  }),
  cancelarDerivacion: (detalle: string): OpcionesConfirmacion => ({
    tipo: "advertencia",
    titulo: "¿Cancelar la derivación?",
    mensaje: "El destino dejará de verla como pendiente. Para volver a derivar tendrás que crear una nueva.",
    detalle,
    textoConfirmar: "Sí, cancelar derivación",
    textoCancelar: "Volver",
  }),
  desactivarCuenta: (nombre: string): OpcionesConfirmacion => ({
    tipo: "peligro",
    titulo: "¿Desactivar esta cuenta?",
    mensaje: `${nombre} ya no podrá ingresar a AuraPet. El historial médico de sus mascotas se conserva.`,
    detalle: nombre,
    textoConfirmar: "Sí, desactivar",
  }),
  pedirEliminacionCuenta: (): OpcionesConfirmacion => ({
    tipo: "peligro",
    titulo: "¿Pedir la eliminación de tu cuenta?",
    mensaje: "Si el equipo de AuraPet la aprueba, tu cuenta se desactivará y ya no podrás ingresar.",
    textoConfirmar: "Sí, pedir eliminación",
  }),
  rechazarPlan: (centro: string, plan: string): OpcionesConfirmacion => ({
    tipo: "advertencia",
    titulo: "¿Rechazar el cambio de plan?",
    mensaje: `${centro} seguirá con su plan actual y su solicitud quedará como rechazada.`,
    detalle: `${centro} → ${plan}`,
    textoConfirmar: "Sí, rechazar",
  }),
  retirarPublicacion: (nombre: string): OpcionesConfirmacion => ({
    tipo: "advertencia",
    titulo: `¿Retirar a ${nombre} de Adopta?`,
    mensaje: "Ya no se verá en la página de adopción, pero podrás volver a publicarlo cuando quieras.",
    detalle: nombre,
    textoConfirmar: "Sí, retirar",
  }),
  rechazarRefugio: (nombre: string): OpcionesConfirmacion => ({
    tipo: "advertencia",
    titulo: "¿Rechazar este refugio?",
    mensaje: "No aparecerá en la página de refugios. Puedes volver a verificarlo después.",
    detalle: nombre,
    textoConfirmar: "Sí, rechazar",
  }),
  rechazarPostulacion: (persona: string, animal: string): OpcionesConfirmacion => ({
    tipo: "advertencia",
    titulo: "¿Rechazar esta postulación?",
    mensaje: `${persona} ya no podrá ser elegida para adoptar a ${animal}.`,
    detalle: persona,
    textoConfirmar: "Sí, rechazar",
  }),
};

// =====================================================================
// Adopción
// =====================================================================
export const TEXTOS_ADOPCION_LOGIN = {
  titulo: "Ellos también buscan hogar",
  revisado: "Revisado por veterinario",
  verTodos: "Ver animales en adopción",
  ver: "Ver",
  anterior: "Anterior",
  siguiente: "Siguiente",
  irA: (n: number) => `Ir al grupo ${n}`,
  franja: (n: number) => (n === 1 ? "1 animal busca hogar" : `${n} animales buscan hogar`),
} as const;

export const VISIBLES_CARRUSEL_ADOPCION = 2;
export const INTERVALO_CARRUSEL_ADOPCION_MS = 4500;
// Fondo del avatar cuando el animal todavía no tiene foto (pastel de adopción).
export const TONOS_ADOPCION = ["#FFE6D5", "#E3F5F2", "#FFF3D1", "#E9E5FB"];

// --- Página /adopta ---

export const TEXTOS_ADOPCION = {
  titulo: "Adopta, cambia dos vidas",
  bajada: "Animales revisados por veterinarios de la red AuraPet, esperando una familia",
  conocerlos: "Conocerlos",
  darEnAdopcion: "Dar en adopción",
  esperando: "esperando hogar",
  revisados: "revisados por veterinarios",
  conFamilia: "ya tienen familia",
  yaTieneFamilia: (nombre: string) => `¡${nombre} ya tiene familia! 🧡`,
  destacadoTitulo: "Esta semana te presentamos a…",
  conocer: (nombre: string) => `Conocer a ${nombre}`,
  revisadoPor: (vet: string) => `Revisado por ${vet}`,
  revisadoCorto: "Revisado por veterinario",
  solidario: "Chequeo solidario",
  enProceso: "En proceso de adopción",
  soloRevisados: "Solo revisados por veterinario",
  masFiltros: "Más filtros",
  sinResultados: "No encontramos animales con esos filtros",
  sinPublicaciones: "Todavía no hay animales en adopción. ¡Pronto llegarán los primeros!",
  errorCarga: "No pudimos cargar los animales en adopción. Intenta de nuevo en un rato.",
  limpiarFiltros: "Limpiar filtros",
  cargando: "Buscando animales…",
  panelTitulo: "Filtros",
  buscar: "Busca por nombre, raza o comuna",
  comuna: "Comuna",
  todasLasComunas: "Todas las comunas",
  verResultados: (n: number) => (n === 1 ? "Ver 1 animal" : `Ver ${n} animales`),
  cerrar: "Cerrar filtros",
  bandaTitulo: "¿Necesitas darle un hogar a un animal?",
  publicar: "Publicar un animal",
  historiasTitulo: "Ya tienen familia",
  confianzaTitulo: "En AuraPet la adopción es gratuita.",
  confianzaTexto: "Nunca pagues por un animal.",
  reportar: "Reportar una publicación",
} as const;

export const ICONO_ESPECIE_ADOPCION: Record<EspecieAdopcion, typeof Dog> = { perro: Dog, gato: Cat, otro: PawPrint };

export const FILTROS_ESPECIE_ADOPCION: Record<FiltroEspecieAdopcion, (a: AnimalAdopcion) => boolean> = {
  todos: () => true,
  perro: (a) => a.especie === "perro",
  gato: (a) => a.especie === "gato",
  otro: (a) => a.especie === "otro",
};
export const OPCIONES_ESPECIE_ADOPCION: { valor: FiltroEspecieAdopcion; label: string; icono: typeof Dog }[] = [
  { valor: "todos", label: "Todos", icono: Users },
  { valor: "perro", label: "Perros", icono: Dog },
  { valor: "gato", label: "Gatos", icono: Cat },
  { valor: "otro", label: "Otros", icono: PawPrint },
];
export const CAMPOS_BUSQUEDA_ADOPCION = (a: AnimalAdopcion) => [a.nombre, a.raza, a.comuna];

export const OPCIONES_TAMANO_ADOPCION: readonly OpcionAdopcion<TamanoAdopcion>[] = [
  { valor: "pequeno", label: "Pequeño" },
  { valor: "mediano", label: "Mediano" },
  { valor: "grande", label: "Grande" },
];
export const OPCIONES_ETAPA_ADOPCION: readonly OpcionAdopcion<EtapaAdopcion>[] = [
  { valor: "cachorro", label: "Cachorro" },
  { valor: "adulto", label: "Adulto" },
  { valor: "senior", label: "Senior" },
];
export const OPCIONES_SEXO_ADOPCION: readonly OpcionAdopcion<SexoAdopcion>[] = [
  { valor: "hembra", label: "Hembra" },
  { valor: "macho", label: "Macho" },
];
export const TITULOS_FILTROS_ADOPCION = { tamano: "Tamaño", etapa: "Edad", sexo: "Sexo" } as const;

export const FILTROS_EXTRA_ADOPCION_VACIOS: FiltrosExtraAdopcion = {
  soloRevisados: false,
  tamano: null,
  etapa: null,
  sexo: null,
  comuna: null,
};

// Fotos del mosaico del hero (imágenes de marca, no son animales publicados)
export const FOTOS_HERO_ADOPCION: FotoMosaico[] = [
  { src: fotoAdoptaPerro, alt: "Perro descansando en un sillón" },
  { src: fotoAdoptaPareja, alt: "Gato y perro durmiendo juntos" },
  { src: fotoAdoptaRetrato, alt: "Perro mirando a un lado" },
];

// Pasos de la banda "Dar en adopción"
export const PASOS_DAR_EN_ADOPCION = [
  { icono: Camera, texto: "Publica con fotos", detalle: "Sube fotos claras y cuenta su historia." },
  { icono: Stethoscope, texto: "Un veterinario de la red lo revisa", detalle: "Así quien adopta sabe cómo está de salud." },
  { icono: Users, texto: "Elige a la mejor familia", detalle: "Revisa las postulaciones y elige con calma." },
];

// Alturas de las tarjetas de la grilla. Son 4 para que no coincidan con las 3 columnas
// y cada columna quede con un ritmo distinto (efecto mosaico).
export const ALTURAS_TARJETA_ADOPCION = [320, 260, 360, 300];
// Giro de las polaroids de "Ya tienen familia"
export const GIROS_POLAROID = [-4, 2, -1.5, 3];

// Desde qué edad (años) un animal se muestra como "Senior"; menor de 1 año = "Cachorro".
export const EDAD_SENIOR_ADOPCION: Record<EspecieAdopcion, number> = { perro: 8, gato: 10, otro: 8 };
// Si quien publica no indica la raza
export const RAZA_SIN_INDICAR: Record<SexoAdopcion, string> = { macho: "Mestizo", hembra: "Mestiza" };
export const EDAD_DESCONOCIDA = "Edad por confirmar";
// Animales que se muestran en el carrusel del login
export const MAX_ADOPCION_LOGIN = 6;
// Historias de "Ya tienen familia"
export const MAX_HISTORIAS_ADOPCION = 6;

// --- Ficha del animal (/adopta/:id) ---
export const BUCKET_ADOPCIONES = "adopciones";       // bucket de Supabase Storage (migración 36)
export const MAX_OTROS_ADOPCION = 8;                 // "Otros que también buscan hogar"
export const CLAVE_GUARDADOS_ADOPCION = "aurapet:adopciones-guardadas"; // corazones (solo en este navegador)

export const ETIQUETAS_RASGOS_ADOPCION: Record<RasgoAdopcion, string> = {
  energia: "Energía",
  sociablePerros: "Sociable con perros",
  sociableGatos: "Con gatos",
  sociableNinos: "Con niños",
};
export const RASGOS_ADOPCION: RasgoAdopcion[] = ["energia", "sociablePerros", "sociableGatos", "sociableNinos"];
export const NIVEL_MAXIMO_RASGO = 5;
export const RASGOS_ADOPCION_VACIOS: RasgosAdopcion = { energia: null, sociablePerros: null, sociableGatos: null, sociableNinos: null };

export const TAMANO_ADOPCION_LABEL: Record<TamanoAdopcion, string> = { pequeno: "pequeño", mediano: "mediano", grande: "grande" };

export const TEXTOS_FICHA_ADOPCION = {
  volver: "Volver a adopciones",
  cargando: "Cargando la ficha…",
  noEncontrada: "No encontramos este animal. Puede que ya no esté publicado.",
  verOtros: "Ver animales en adopción",
  personalidad: "Personalidad",
  salud: "Salud",
  vacunas: "Vacunas al día",
  vacunasPendientes: "Vacunas pendientes",
  esterilizado: (sexo: SexoAdopcion) => (sexo === "hembra" ? "Esterilizada" : "Esterilizado"),
  sinEsterilizar: "Sin esterilizar",
  microchip: "Microchip",
  sinMicrochip: "Sin microchip",
  peso: "Peso",
  alergias: "Alergias",
  sinDato: "Sin información",
  sinAlergias: "Ninguna conocida",
  chequeoTitulo: (fecha: string, vet: string, centro: string | null) =>
    `Chequeo veterinario · ${fecha} · ${vet}${centro ? `, ${centro}` : ""}`,
  chequeoSolicitado: "Revisión veterinaria solicitada",
  chequeoSolicitadoDetalle: "Un veterinario de la red AuraPet lo revisará pronto.",
  adopciones: (n: number) => (n === 1 ? "1 adopción" : `${n} adopciones`),
  quieroAdoptar: (sexo: SexoAdopcion) => (sexo === "hembra" ? "Quiero adoptarla" : "Quiero adoptarlo"),
  botonDeshabilitado: {
    mia: "Es tu publicación",
    postulado: "Ya postulaste",
    en_proceso: "En proceso de adopción",
    adoptado: "¡Ya tiene familia!",
  } as Record<Exclude<EstadoBotonAdoptar, "disponible">, string>,
  compartir: "Compartir",
  copiado: "¡Enlace copiado!",
  guardar: "Guardar",
  guardado: "Guardado",
  ley: "Al adoptar, actualiza el registro y el microchip a tu nombre (Ley 21.020).",
  otros: "Otros que también buscan hogar",
  anterior: "Ver anteriores",
  siguiente: "Ver más",
  compartirTexto: (nombre: string) => `${nombre} busca hogar en AuraPet`,
} as const;

// --- Postular ("Quiero adoptarlo") ---
export const OPCIONES_VIVIENDA_ADOPCION: readonly OpcionAdopcion<ViviendaAdopcion>[] = [
  { valor: "casa", label: "Casa" },
  { valor: "departamento", label: "Departamento" },
  { valor: "parcela", label: "Parcela" },
];
export const OPCIONES_TENENCIA_ADOPCION: readonly OpcionAdopcion<TenenciaAdopcion>[] = [
  { valor: "propia", label: "Propia" },
  { valor: "arrendada", label: "Arrendada" },
  { valor: "familiar", label: "De un familiar" },
];

export const PASOS_POSTULACION_ADOPCION: readonly PasoFormulario<CampoPostulacionAdopcion>[] = [
  { titulo: "Tu hogar", campos: ["vivienda", "tienePatio", "tenencia", "permitenMascotas"] },
  { titulo: "Tu familia", campos: ["hayNinos", "edadesNinos", "otrasMascotas", "cualesMascotas", "todosDeAcuerdo"] },
  { titulo: "Tu experiencia", campos: ["experiencia", "motivo"] },
  { titulo: "Confirmación", campos: ["aceptaCompromiso"] },
];

export const DATOS_POSTULACION_VACIOS: DatosPostulacionAdopcion = {
  vivienda: null,
  tienePatio: null,
  tenencia: null,
  permitenMascotas: null,
  hayNinos: null,
  edadesNinos: "",
  otrasMascotas: null,
  cualesMascotas: "",
  todosDeAcuerdo: null,
  experiencia: "",
  motivo: "",
  aceptaCompromiso: false,
};

export const MIN_MOTIVO_POSTULACION = 10;
export const MAX_TEXTO_POSTULACION = 800;

export const TEXTOS_POSTULACION = {
  titulo: (nombre: string) => `Quiero adoptar a ${nombre}`,
  cerrar: "Cerrar",
  vivienda: "¿Dónde vives?",
  patio: "¿Tiene patio?",
  tenencia: "La vivienda es…",
  permitenMascotas: "¿Te permiten tener mascotas?",
  hayNinos: "¿Hay niños en casa?",
  edadesNinos: "Edades (si hay niños)",
  edadesPlaceholder: "Ej: 5, 8",
  otrasMascotas: "¿Hay otras mascotas en casa?",
  cualesMascotas: "Cuáles (si hay otras mascotas)",
  cualesPlaceholder: "Ej: un gato, un hámster",
  todosDeAcuerdo: "¿Todos en casa están de acuerdo con la adopción?",
  experiencia: "¿Has tenido mascotas antes? Cuéntanos (opcional)",
  experienciaPlaceholder: "Ej: tuve una perrita por 12 años…",
  motivo: "¿Por qué quieres adoptar?",
  motivoPlaceholder: "Cuéntale a quien lo cuida qué le puedes ofrecer",
  resumen: "Revisa tu postulación",
  avisoContacto: "Al enviar, quien lo publicó podrá ver tu correo y el teléfono de tu perfil para contactarte.",
  compromiso: (nombre: string) =>
    `Me comprometo a cuidar a ${nombre}, a llevarle a sus controles veterinarios y a actualizar su registro y microchip a mi nombre.`,
  si: "Sí",
  no: "No",
  atras: "Atrás",
  continuar: "Continuar",
  enviar: "Enviar postulación",
  enviando: "Enviando…",
  error: "No se pudo enviar la postulación.",
  enviadaTitulo: "¡Postulación enviada!",
  enviadaTexto: (publicador: string) =>
    `${publicador} revisará tu solicitud y te contactará pronto para coordinar el siguiente paso. Mientras tanto, puedes ver otros animales que también buscan hogar.`,
  verMas: "Ver más animales en adopción",
  errores: {
    elegir: "Elige una opción",
    edades: "Cuéntanos las edades",
    cuales: "Cuéntanos qué mascotas",
    motivo: `Escribe al menos ${10} caracteres`,
    compromiso: "Debes aceptar el compromiso para enviar",
  },
} as const;

// --- Publicar ("Dar en adopción") ---
export const MAX_FOTOS_ADOPCION = 6;
export const MAX_MB_FOTO_ADOPCION = 5;
export const TIPOS_FOTO_ADOPCION = ["image/jpeg", "image/png", "image/webp"];
export const MAX_PERSONALIDAD_ADOPCION = 5;
export const OPCIONES_PERSONALIDAD_ADOPCION = [
  "Juguetón", "Cariñoso", "Tranquilo", "Leal", "Sociable", "Curioso", "Independiente",
  "Protector", "Regalón", "Ideal para departamento", "Bueno con niños", "Le gusta pasear",
] as const;

export const OPCIONES_ESPECIE_PUBLICAR: readonly { valor: EspecieMascota; label: string }[] = [
  { valor: "perro", label: "Perro" },
  { valor: "gato", label: "Gato" },
  { valor: "conejo", label: "Conejo" },
  { valor: "ave", label: "Ave" },
  { valor: "otro", label: "Otro" },
];

export const PASOS_PUBLICAR_ADOPCION: readonly PasoFormulario<CampoPublicarAdopcion>[] = [
  { titulo: "Datos básicos", campos: ["fotos", "nombre", "especie", "sexo", "anios", "meses", "tamano", "comuna"] },
  { titulo: "Personalidad", campos: ["personalidad", "frase"] },
  { titulo: "Salud e historia", campos: ["raza", "pesoKg", "alergias", "historia"] },
  { titulo: "Revisa y publica", campos: [] },
];

export const DATOS_PUBLICAR_VACIOS: DatosPublicarAdopcion = {
  fotos: [],
  nombre: "",
  especie: null,
  sexo: null,
  anios: "",
  meses: "",
  tamano: null,
  comuna: "",
  solicitaChequeo: true,
  personalidad: [],
  rasgos: RASGOS_ADOPCION_VACIOS,
  frase: "",
  raza: "",
  pesoKg: "",
  vacunasAlDia: false,
  esterilizado: false,
  conMicrochip: false,
  alergias: "",
  historia: "",
  refugioId: null,
};

export const TEXTOS_PUBLICAR = {
  titulo: "Dar en adopción",
  paso: (n: number, titulo: string) => `Paso ${n}: ${titulo}`,
  fotos: (n: number) => `Arrastra y suelta hasta ${MAX_FOTOS_ADOPCION} fotos, o haz clic para elegirlas (${n}/${MAX_FOTOS_ADOPCION})`,
  quitarFoto: "Quitar foto",
  fotoPrincipal: "Principal",
  nombre: "Nombre del animal",
  nombrePlaceholder: "Ej: Luna",
  especie: "Especie",
  elegir: "Elige una opción",
  sexo: "Sexo",
  edad: "Edad aproximada",
  anios: "Años",
  meses: "Meses",
  tamano: "Tamaño",
  comuna: "Comuna",
  revision: "Quiero que un veterinario de AuraPet lo revise",
  personalidad: `Personalidad (elige hasta ${MAX_PERSONALIDAD_ADOPCION})`,
  rasgos: "¿Cómo es? (1 = poco, 5 = mucho)",
  sinDato: "No sé",
  frase: "Una frase en primera persona (opcional)",
  frasePlaceholder: "Ej: Me encanta dormir al sol y que me rasquen las orejas",
  raza: "Raza (si no sabes, déjalo en blanco)",
  razaPlaceholder: "Ej: Mestizo, Labrador",
  peso: "Peso aproximado (kg)",
  vacunas: "Tiene las vacunas al día",
  esterilizado: "Está esterilizado/a",
  microchip: "Tiene microchip",
  alergias: "Alergias o condiciones (opcional)",
  historia: "Su historia",
  historiaPlaceholder: "¿Cómo llegó contigo? ¿Qué familia le vendría bien?",
  revisaTitulo: "Así se verá tu publicación",
  atras: "Atrás",
  continuar: "Continuar",
  publicar: "Publicar",
  publicando: "Publicando…",
  error: "No se pudo publicar. Intenta de nuevo.",
  listoTitulo: (nombre: string) => `¡${nombre} ya está publicado!`,
  listoTexto: "Te avisaremos cuando alguien postule. Si pediste revisión, un veterinario de la red se pondrá en contacto.",
  verPublicacion: "Ver la publicación",
  otra: "Publicar otro animal",
  sesionTitulo: "Inicia sesión para dar en adopción",
  sesionTexto: "Así las familias interesadas pueden postular y tú puedes elegir con calma.",
  ingresar: "Ingresar o crear cuenta",
  errores: {
    fotos: "Sube al menos una foto",
    fotoTipo: "Solo fotos JPG, PNG o WebP",
    fotoPeso: `Cada foto puede pesar hasta ${MAX_MB_FOTO_ADOPCION} MB`,
    fotoMaximo: `Puedes subir hasta ${MAX_FOTOS_ADOPCION} fotos`,
    nombre: "Escribe su nombre",
    elegir: "Elige una opción",
    edad: "Indica años o meses (aproximado)",
    comuna: "Elige la comuna",
    personalidad: "Elige al menos una",
    peso: "Escribe un peso válido",
    historia: "Cuéntanos un poco de su historia (mín. 20 caracteres)",
  },
} as const;
export const MIN_HISTORIA_ADOPCION = 20;

// --- "Dar en adopción" desde los paneles (cualquier rol) ---
export const TEXTOS_DAR_EN_ADOPCION_PANEL = {
  menu: "Dar en adopción",
  titulo: "Dar en adopción",
  subtitulo: "Publica un animal que busca hogar. Se verá en la página Adopta de AuraPet.",
  cerrar: "Cerrar",
} as const;
export const ICONO_DAR_EN_ADOPCION = HeartHandshake;

// =====================================================================
// Mis publicaciones (migración 39)
// =====================================================================
export const ICONO_MIS_PUBLICACIONES = Megaphone;
export const ICONO_ADOPCION_SOLIDARIA = HandHeart;
export const MAX_ACTIVIDAD_PUBLICACIONES = 6;

export const TEXTOS_MIS_PUBLICACIONES = {
  menu: "Mis publicaciones",
  titulo: "Mis publicaciones",
  bajada: "Cada uno está más cerca de casa",
  darEnAdopcion: "Dar en adopción",
  publicados: "publicados",
  nuevas: "postulaciones nuevas",
  conFamilia: "ya tienen familia",
  caminoCasa: "Camino a casa",
  nuevasPostulaciones: (n: number) => (n === 1 ? "+1 postulación nueva" : `+${n} postulaciones nuevas`),
  sinNuevas: "Sin postulaciones nuevas",
  revisarPostulaciones: "Revisar postulaciones",
  actividad: "Actividad reciente",
  sinActividad: "Aquí verás quién postula, quién los atiende y cuándo encuentran familia.",
  esperandoAtencion: "Esperando atención veterinaria",
  revisadoPor: (vet: string) => `Revisado por ${vet}`,
  enProcesoCon: (nombre: string) => `En proceso con ${nombre}`,
  postulaciones: (n: number) => (n === 1 ? "1 postulación" : `${n} postulaciones`),
  verPostulaciones: "Ver postulaciones",
  verPublicacion: "Ver publicación",
  retirar: "Retirar",
  reactivar: "Volver a publicar",
  confirmarRetirar: (nombre: string) => `¿Retirar a ${nombre} de Adopta? Ya no se verá en la página, pero podrás volver a publicarlo.`,
  aNombreDe: (refugio: string) => `A nombre de ${refugio}`,
  cargando: "Cargando tus publicaciones…",
  error: "No pudimos cargar tus publicaciones.",
  vacioTitulo: "Todavía no has publicado animales",
  vacioTexto: "¿Conoces a un perrito o gatito que busca hogar? Publícalo y te ayudamos a encontrarle familia.",
  vacioFiltro: "No hay publicaciones en esta pestaña.",
  hace: (fecha: string) => fecha,
} as const;

export const PESTANAS_PUBLICACIONES: readonly { valor: FiltroPublicaciones; label: string }[] = [
  { valor: "activos", label: "Activos" },
  { valor: "en_proceso", label: "En proceso" },
  { valor: "adoptados", label: "Adoptados" },
  { valor: "retirados", label: "Retirados" },
];
export const FILTROS_PUBLICACIONES: Record<FiltroPublicaciones, (estado: EstadoPublicacion) => boolean> = {
  activos: (e) => e === "publicada",
  en_proceso: (e) => e === "en_proceso",
  adoptados: (e) => e === "adoptada",
  retirados: (e) => e === "retirada",
};

export const ESTADO_PUBLICACION_LABEL: Record<EstadoPublicacion, string> = {
  publicada: "Publicado",
  en_proceso: "En proceso",
  adoptada: "Adoptado",
  retirada: "Retirado",
};

export const HITOS_CAMINO_CASA: readonly { hito: HitoCaminoCasa; label: string }[] = [
  { hito: "publicada", label: "Publicado" },
  { hito: "revisada", label: "Revisado por veterinario" },
  { hito: "postulaciones", label: "Postulaciones" },
  { hito: "elegida", label: "Familia elegida" },
  { hito: "adoptada", label: "Adoptado" },
];

export const TEXTO_ACTIVIDAD: Record<TipoActividadPublicacion, (animal: string, persona: string | null) => string> = {
  postulacion: (animal, persona) => `${persona ?? "Alguien"} postuló a ${animal}`,
  eleccion: (animal, persona) => `${animal} pasó a En proceso con ${persona ?? "su familia"}`,
  atencion: (animal, persona) => `${persona ?? "Un veterinario"} atendió a ${animal}`,
  adopcion: (animal) => `${animal} fue adoptado 🎉`,
};

// --- Elegir familia ---
export const TEXTOS_ELEGIR_FAMILIA = {
  volver: "Mis publicaciones",
  titulo: (nombre: string) => `Elegir familia para ${nombre}`,
  resumen: (total: number, nuevas: number) => `${total} ${total === 1 ? "postulación" : "postulaciones"}${nuevas ? ` · ${nuevas} ${nuevas === 1 ? "nueva" : "nuevas"}` : ""}`,
  verPublicacion: "Ver publicación",
  afinidad: "Afinidad",
  nueva: "Nueva",
  aceptada: "Elegida",
  rechazada: "Rechazada",
  hogar: "Su hogar",
  familia: "Su familia",
  experiencia: "Su experiencia",
  sinExperiencia: "No contó experiencia previa.",
  porQue: "Por qué quiere adoptar",
  match: "¿Por qué hacen match?",
  guia: "La afinidad es una guía, la decisión es tuya.",
  contacto: "Contacto",
  escribirCorreo: "Escribir correo",
  whatsapp: "WhatsApp",
  rechazar: "Rechazar",
  elegir: (nombre: string) => `Elegir a ${nombre}`,
  notaEsperan: "Las demás postulaciones quedan en espera",
  marcarAdoptado: (nombre: string) => `Marcar a ${nombre} como adoptado`,
  confirmarRechazo: (nombre: string) => `¿Rechazar la postulación de ${nombre}?`,
  sinPostulaciones: "Todavía nadie postula. Comparte la publicación para que llegue a más personas.",
  cargando: "Cargando postulaciones…",
  error: "No pudimos cargar las postulaciones.",
  errorAccion: "No se pudo guardar. Intenta de nuevo.",
  vivienda: { casa: "Casa", departamento: "Departamento", parcela: "Parcela" },
  tenencia: { propia: "propia", arrendada: "arrendada", familiar: "de un familiar" },
  conPatio: "con patio",
  sinPatio: "sin patio",
  permiten: "le permiten mascotas",
  noPermiten: "no le permiten mascotas",
  ninos: (edades: string | null) => (edades ? `Niños de ${edades}` : "Hay niños"),
  sinNinos: "Sin niños",
  mascotas: (cuales: string | null) => (cuales ? `Otras mascotas: ${cuales}` : "Tiene otras mascotas"),
  sinMascotas: "Sin otras mascotas",
  deAcuerdo: "Todos en casa están de acuerdo",
  noDeAcuerdo: "No todos en casa están de acuerdo",
  whatsappTexto: (animal: string) => `Hola, te escribo por tu postulación para adoptar a ${animal} en AuraPet 🐾`,
  correoAsunto: (animal: string) => `Tu postulación para adoptar a ${animal} — AuraPet`,
} as const;

// Pesos del cálculo de afinidad (lib/afinidadAdopcion.ts). Es una guía, no un filtro.
export const AFINIDAD = {
  base: 60,
  minimo: 5,
  maximo: 98,
  nivelAlto: 4,   // rasgo de 1 a 5
  nivelBajo: 2,
  ninosBien: 12,
  ninosMal: -15,
  mascotasBien: 8,
  mascotasMal: -12,
  energiaConPatio: 6,
  energiaSinPatio: -8,
  grandeEnDepto: -6,
  permitenMascotas: 4,
  noPermitenMascotas: -25,
  todosDeAcuerdo: 10,
  noTodosDeAcuerdo: -20,
  experiencia: 5,
} as const;

export const TEXTOS_AFINIDAD = {
  ninosBien: (n: string, edades: string | null) => `${n} es sociable con niños${edades ? ` y hay niños de ${edades}` : ""}`,
  ninosMal: (n: string) => `${n} no se lleva tan bien con niños: conversen cómo sería la convivencia`,
  mascotasBien: (n: string) => `${n} se lleva bien con otros animales y hay más mascotas en casa`,
  mascotasMal: (n: string) => `${n} no es muy sociable con otros animales y hay mascotas en casa`,
  energiaConPatio: (n: string) => `${n} tiene mucha energía y hay patio para jugar`,
  energiaSinPatio: (n: string) => `${n} tiene energía alta y no hay patio: conversen sobre los paseos`,
  grandeEnDepto: (n: string) => `${n} es de tamaño grande y viven en departamento`,
  permitenMascotas: "En su arriendo le permiten mascotas",
  noPermitenMascotas: "En su arriendo no le permiten mascotas",
  todosDeAcuerdo: "Todos en casa están de acuerdo",
  noTodosDeAcuerdo: "No todos en casa están de acuerdo",
  experiencia: "Ya ha tenido mascotas",
} as const;

// --- ¡Adoptado! ---
export const TEXTOS_ADOPTADA = {
  titulo: (nombre: string) => `¡${nombre} tiene familia!`,
  quien: "¿Quién lo adoptó?",
  testimonio: "Cuéntanos cómo le va (opcional)",
  testimonioPlaceholder: "Ej: ya se adaptó perfecto, duerme a los pies de la cama y ama el parque.",
  traspasar: (nombre: string, persona: string) => `Pasar la ficha médica de ${nombre} a la cuenta de ${persona}`,
  traspasarDetalle: "Su historial y sus atenciones quedan en su nueva casa",
  vistaPrevia: "Así se verá en \"Ya tienen familia\"",
  confirmar: "Confirmar adopción 🎉",
  confirmando: "Guardando…",
  gracias: "Gracias por darle una segunda oportunidad",
  cerrar: "Cerrar",
  error: "No se pudo cerrar la adopción.",
} as const;
export const MAX_TESTIMONIO_ADOPCION = 280;

// =====================================================================
// Adopción solidaria (veterinario)
// =====================================================================
export const TEXTOS_SOLIDARIA = {
  menu: "Adopción solidaria",
  titulo: "Adopción solidaria",
  bajada: "Tu atención les abre la puerta a una familia",
  impacto: "Tu impacto",
  atendidosGratis: (n: number) => (n === 1 ? "1 animal atendido gratis" : `${n} animales atendidos gratis`),
  adoptados: (n: number) => (n === 1 ? "1 ya fue adoptado" : `${n} ya fueron adoptados`),
  atencionesTotales: (n: number) => `${n} ${n === 1 ? "atención" : "atenciones"} en total`,
  aliadoTitulo: "Aliado solidario",
  aliadoTexto: "Atiendo gratis a animales de refugios",
  aliadoDetalle: "Tu sello aparece en tu perfil y en la página de Refugios",
  urgentes: "Más urgentes",
  esperandoHace: (dias: number) => (dias <= 0 ? "Publicado hoy" : dias === 1 ? "Esperando hace 1 día" : `Esperando hace ${dias} días`),
  enTuComuna: "En tu comuna",
  refugio: "Refugio",
  atender: "Atender",
  yaAtendido: "Ya lo atendiste",
  verFicha: "Ver ficha",
  pestanas: { esperando: "Esperando atención", todos: "Todos en adopción", mias: "Mis atenciones" },
  comuna: "Comuna",
  todasComunas: "Todas las comunas",
  especie: "Especie",
  todasEspecies: "Todas",
  soloRefugios: "Solo refugios",
  orden: { antiguos: "Más tiempo esperando", recientes: "Más recientes" },
  vacioEsperando: "Ningún animal está esperando atención. ¡Gracias por estar atento!",
  vacioTodos: "No hay animales en adopción con estos filtros.",
  vacioMias: "Todavía no registras atenciones. Cuando atiendas a uno, aparecerá aquí.",
  cargando: "Cargando…",
  error: "No pudimos cargar los animales en adopción.",
  solidaria: "Atención solidaria",
  conCosto: "Con costo",
  enProceso: "En proceso",
  adoptado: "Adoptado",
} as const;

export const MAX_URGENTES_SOLIDARIA = 3;
export const PESTANAS_SOLIDARIA: readonly { valor: PestanaSolidaria; label: string }[] = [
  { valor: "esperando", label: TEXTOS_SOLIDARIA.pestanas.esperando },
  { valor: "todos", label: TEXTOS_SOLIDARIA.pestanas.todos },
  { valor: "mias", label: TEXTOS_SOLIDARIA.pestanas.mias },
];
export const FILTROS_SOLIDARIA_VACIOS: FiltrosSolidaria = { comuna: null, especie: null, soloRefugios: false, orden: "antiguos" };
export const DIAS_URGENCIA_SOLIDARIA = 14; // a esta cantidad de días la barra llega a coral

export const ESTADOS_GENERALES_ATENCION: readonly { valor: EstadoGeneralAtencion; label: string; icono: typeof Dog }[] = [
  { valor: "sano", label: "Sano", icono: Smile },
  { valor: "en_tratamiento", label: "En tratamiento", icono: HeartPulse },
  { valor: "en_observacion", label: "En observación", icono: IconoOjo },
];
export const PROCEDIMIENTOS_ATENCION: readonly { valor: ProcedimientoAtencion; label: string; icono: typeof Dog }[] = [
  { valor: "vacunas", label: "Vacunas", icono: IconoJeringa },
  { valor: "desparasitacion", label: "Desparasitación", icono: Bug },
  { valor: "esterilizacion", label: "Esterilización", icono: IconoTijeras },
  { valor: "microchip", label: "Microchip", icono: ScanSearch },
  { valor: "examen_general", label: "Examen general", icono: Stethoscope },
];
export const MAX_RESUMEN_ATENCION = 300;
export const MIN_RESUMEN_ATENCION = 3;

export const datosAtencionVacios = (fecha: string, centroId: number | null): DatosAtencionAdopcion => ({
  fecha,
  centroId,
  estadoGeneral: "sano",
  procedimientos: [],
  pesoKg: "",
  resumen: "",
  solidario: true,
  monto: "",
});

export const TEXTOS_REGISTRAR_ATENCION = {
  titulo: (nombre: string) => `Registrar atención de ${nombre}`,
  publicadoPor: (quien: string) => `Publicado por ${quien}`,
  fecha: "Fecha",
  centro: "Centro donde se atendió",
  sinCentro: "Sin centro (atención particular)",
  estado: "Estado general",
  hecho: "¿Qué se hizo?",
  peso: "Peso (kg)",
  resumen: "Resumen para la ficha pública",
  resumenPlaceholder: "Ej: Sano, desparasitado, primera dosis de triple felina",
  costo: "Costo",
  gratisTitulo: "Atención solidaria — gratis",
  gratisDetalle: "Aparece como \"Atención solidaria\" en su ficha",
  costoTitulo: "Con costo",
  costoDetalle: "Se coordina directamente con quien lo publicó",
  monto: "Monto aproximado ($)",
  vistaPrevia: "Así se verá en su ficha",
  revisadoPor: (vet: string, centro: string | null) => `Revisado por ${vet}${centro ? ` · ${centro}` : ""}`,
  cancelar: "Cancelar",
  guardar: "Guardar atención",
  guardando: "Guardando…",
  errorResumen: "Escribe un resumen corto para su ficha",
  errorPeso: "Escribe un peso válido",
  errorMonto: "Escribe un monto válido",
  error: "No se pudo guardar la atención.",
} as const;

// =====================================================================
// Refugios
// =====================================================================
export const RUTA_REFUGIOS = "/adopta/refugios";
export const rutaAnimalesDeRefugio = (id: number) => `/adopta?refugio=${id}`;

export const TEXTOS_REFUGIOS = {
  titulo: "Refugios que cuidan y dan en adopción",
  refugios: (n: number) => (n === 1 ? "refugio" : "refugios"),
  animales: "animales esperando hogar",
  aliados: "veterinarios aliados",
  necesitanAyuda: "Necesitan ayuda ahora",
  verComoAyudar: "Ver cómo ayudar",
  region: "Región",
  todasRegiones: "Todas las regiones",
  comuna: "Comuna",
  todasComunas: "Todas las comunas",
  soloAbiertos: "Abiertos a recibir animales",
  perros: "Perros",
  gatos: "Gatos",
  cupos: (ocupados: number, totales: number) => `${ocupados} / ${totales} cupos`,
  esperando: (n: number) => (n === 1 ? "1 esperando hogar" : `${n} esperando hogar`),
  atendidosPor: (n: number) => `Atendidos por ${n} ${n === 1 ? "veterinario aliado" : "veterinarios aliados"}`,
  verAnimales: "Ver sus animales",
  contactar: "Contactar",
  vacio: "No encontramos refugios con esos filtros.",
  sinRefugios: "Pronto sumaremos los primeros refugios.",
  cargando: "Cargando refugios…",
  error: "No pudimos cargar los refugios.",
  tienesRefugio: "¿Tienes un refugio?",
  tienesRefugioTexto: "Muestra tus cupos y tus animales a miles de familias.",
  sumate: "Súmate a AuraPet",
  eresVet: "¿Eres veterinario?",
  eresVetTexto: "Atiende gratis a animales de refugios y lleva el sello de aliado.",
  hazteAliado: "Hazte aliado solidario",
  pestanaAnimales: "Animales",
  pestanaRefugios: "Refugios",
  filtrandoRefugio: (nombre: string) => `Mostrando los animales de ${nombre}`,
  quitarFiltro: "Ver todos",
} as const;

export const RECEPCION_REFUGIO_LABEL: Record<RecepcionRefugio, string> = {
  abierto: "Recibe animales",
  limitado: "Cupos limitados",
  sin_cupos: "Sin cupos por ahora",
};
export const FILTROS_REFUGIOS_VACIOS: FiltrosRefugios = { region: null, comuna: null, soloAbiertos: false, especie: null };
export const PUBLICAR_A_NOMBRE = { etiqueta: "Publicar a nombre de", personal: "Mi nombre (personal)" } as const;

// =====================================================================
// Gestión de refugios: superadmin y "Mi refugio" (migración 42)
// =====================================================================
export const ICONO_MI_REFUGIO = HouseHeart;
// Ítems de menú que solo ven quienes administran un refugio
export const SECCIONES_SOLO_ADMIN_REFUGIO: readonly string[] = ["refugio", "miRefugio"];

export const REGIONES_CHILE = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso", "Metropolitana",
  "O'Higgins", "Maule", "Ñuble", "Biobío", "Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes",
] as const;

export const ESPECIES_REFUGIO: readonly { valor: EspecieRefugio; label: string; icono: typeof Dog }[] = [
  { valor: "perro", label: "Perros", icono: Dog },
  { valor: "gato", label: "Gatos", icono: Cat },
  { valor: "otro", label: "Otros", icono: Rabbit },
];

export const RECEPCION_REFUGIO_OPCIONES: readonly { valor: RecepcionRefugio; titulo: string; corto: string; detalle: string; icono: typeof Dog }[] = [
  { valor: "abierto", titulo: "Abierto", corto: "Abierto", detalle: "Recibimos animales", icono: DoorOpen },
  { valor: "limitado", titulo: "Cupos limitados", corto: "Limitado", detalle: "Solo casos urgentes", icono: CircleAlert },
  { valor: "sin_cupos", titulo: "Sin cupos", corto: "Sin cupos", detalle: "No podemos recibir por ahora", icono: Ban },
];
export const COLOR_RECEPCION_REFUGIO: Record<RecepcionRefugio, string> = {
  abierto: "var(--ap-acento)",
  limitado: "#d99a1e",
  sin_cupos: "#e8664a",
};

export const ESTADO_REFUGIO_LABEL: Record<EstadoRefugio, string> = {
  pendiente: "Por revisar",
  aprobado: "Verificado",
  rechazado: "Rechazado",
};
export const FILTROS_ESTADO_REFUGIO: readonly { valor: FiltroEstadoRefugio; label: string }[] = [
  { valor: "todos", label: "Todos" },
  { valor: "aprobado", label: "Verificados" },
  { valor: "pendiente", label: "Por revisar" },
  { valor: "rechazado", label: "Rechazados" },
];
export const FILTROS_REFUGIOS_ADMIN_VACIOS: FiltrosRefugiosAdmin = { texto: "", estado: "todos", region: null, incluirPrueba: false };
export const MAX_DESCRIPCION_REFUGIO = 600;
export const MAX_FOTOS_DETALLE_REFUGIO = 4;
export const MS_TOAST = 2600;
export const MS_GUARDAR_CUPOS = 700;   // espera a que deje de tocar + / − antes de guardar
export const MS_BUSCAR_CUENTAS = 300;

export const PASOS_REFUGIO: readonly PasoFormulario<CampoRefugio>[] = [
  { titulo: "Datos", campos: ["nombre", "region", "comuna", "telefono", "correo", "descripcion", "logo"] },
  { titulo: "Capacidad", campos: ["cuposTotales", "cuposOcupados", "especies"] },
  { titulo: "Administradores", campos: ["administradores"] },
];

export const imagenRefugioVacia = { ruta: null, archivo: null, vista: null } as const;

export const DATOS_REFUGIO_VACIOS: DatosRefugio = {
  nombre: "",
  region: "Metropolitana",
  comuna: "",
  telefono: "",
  correo: "",
  descripcion: "",
  logo: imagenRefugioVacia,
  portada: imagenRefugioVacia,
  cuposTotales: 20,
  cuposOcupados: 0,
  recibe: "abierto",
  especies: ["perro", "gato"],
  esPrueba: false,
  administradores: [],
};

export const PESTANAS_MI_REFUGIO: readonly { valor: PestanaMiRefugio; label: string }[] = [
  { valor: "publicada", label: "En adopción" },
  { valor: "en_proceso", label: "En proceso" },
  { valor: "adoptada", label: "Adoptados" },
];

export const TEXTOS_REFUGIOS_ADMIN = {
  titulo: "Refugios",
  bajada: "Organizaciones verificadas que publican animales en AuraPet",
  nuevo: "Nuevo refugio",
  kpiVerificados: "Verificados",
  kpiPorRevisar: "Por revisar",
  kpiAnimales: "Animales publicados",
  kpiOcupacion: "Ocupación promedio",
  revisar: "Revisar",
  enRefugios: (n: number) => `en ${n} ${n === 1 ? "refugio" : "refugios"}`,
  esperanVerificacion: (n: number) => (n === 1 ? "1 refugio espera verificación" : `${n} refugios esperan verificación`),
  revisarAhora: "Revisar ahora",
  buscar: "Buscar por nombre o comuna",
  region: "Región",
  todasRegiones: "Todas las regiones",
  incluirPrueba: "Incluir de prueba",
  prueba: "Prueba",
  columnas: ["Refugio", "Estado", "Recepción", "Cupos", "Especies", "Animales", "Administradores", ""],
  sinAdmins: "Sin asignar",
  mostrando: (n: number, total: number) => `Mostrando ${n} de ${total}`,
  acciones: "Acciones",
  verDetalle: "Ver detalle",
  editar: "Editar",
  verAnimales: "Ver sus animales",
  aprobar: "Aprobar refugio",
  rechazar: "Rechazar",
  volverAVerificar: "Marcar como verificado",
  vacioTitulo: "Aún no hay refugios",
  vacioTexto: "Crea el primero para que puedan publicar animales a su nombre.",
  vacioFiltro: "Ningún refugio coincide con estos filtros.",
  cargando: "Cargando refugios…",
  error: "No pudimos cargar los refugios.",
  errorAccion: "No se pudo actualizar el refugio.",
  capacidad: "Capacidad",
  cuposLibres: (n: number) => (n === 1 ? "1 cupo libre" : `${n} cupos libres`),
  administradores: "Administradores",
  animalesPublicados: "Animales publicados",
  sinAnimales: "Todavía no publica animales.",
  sinDescripcion: "Sin descripción.",
  checklist: "Checklist de verificación",
  itemsChecklist: ["Datos de contacto verificados", "Fotos del lugar revisadas", "Responsable identificado"],
  checklistAyuda: "Marca los tres para poder aprobarlo.",
} as const;

export const TEXTOS_MODAL_REFUGIO = {
  nuevo: "Nuevo refugio",
  editar: "Editar refugio",
  bajada: "Lo verán las personas en la página de refugios",
  pasoDe: (n: number, total: number) => `Paso ${n} de ${total}`,
  portada: "Arrastra una portada o haz clic",
  cambiarPortada: "Cambiar portada",
  logo: "Logo",
  nombre: "Nombre del refugio",
  region: "Región",
  comuna: "Comuna",
  telefono: "Teléfono",
  prefijo: "+56",
  correo: "Correo",
  descripcion: "Descripción",
  descripcionPlaceholder: "Cuéntales qué hacen, desde cuándo y qué animales reciben",
  prueba: "Refugio de prueba",
  pruebaAyuda: "Solo lo verán las cuentas de prueba",
  cuposTotales: "Cupos totales",
  cuposOcupados: "Cupos ocupados",
  ocupacion: (porcentaje: number, libres: number) => `${porcentaje}% ocupado · ${libres} ${libres === 1 ? "cupo libre" : "cupos libres"}`,
  recibe: "¿Recibe animales?",
  especies: "Especies que recibe",
  buscarCuenta: "Busca una cuenta por correo o nombre",
  sinResultados: "No encontramos cuentas con ese texto.",
  agregar: "Agregar",
  agregado: "Agregado",
  quitar: "Quitar",
  administradores: (n: number) => `Administradores (${n})`,
  sinAdministradores: "Todavía no tiene administradores. Puedes agregarlos después.",
  ayudaAdmins: "Los administradores pueden publicar animales a nombre del refugio y actualizar sus cupos.",
  avisoPrueba: (nombre: string) => `${nombre} es una cuenta de prueba: solo puede administrar refugios de prueba.`,
  avisoReal: (nombre: string) => `${nombre} es una cuenta real: solo puede administrar refugios reales.`,
  vistaPrevia: "Vista previa en vivo",
  asiSeVera: "Así se verá en /adopta/refugios",
  nombreEjemplo: "Nombre del refugio",
  comunaEjemplo: "Comuna",
  cancelar: "Cancelar",
  atras: "Atrás",
  siguiente: "Siguiente",
  crear: "Crear refugio",
  guardar: "Guardar cambios",
  guardando: "Guardando…",
  error: "No se pudo guardar el refugio.",
  errorNombre: "Escribe el nombre del refugio",
  errorComuna: "Escribe la comuna",
  errorRegion: "Elige la región",
  errorTelefono: "Escribe un celular válido (9 dígitos)",
  errorCorreo: "Escribe un correo válido",
  errorCupos: "Los ocupados no pueden superar los totales",
  errorEspecies: "Elige al menos una especie",
  errorAdminsMundo: "Hay administradores de otro tipo de cuenta (prueba/real)",
  errorImagen: "Usa una imagen JPG, PNG o WebP de hasta 5 MB",
} as const;

export const TEXTOS_MI_REFUGIO = {
  menu: "Mi refugio",
  titulo: "Mi refugio",
  verificado: "Verificado",
  verPublica: "Ver página pública",
  capacidad: "Capacidad",
  cuposOcupados: "cupos ocupados",
  cuposLibres: (n: number) => (n === 1 ? "cupo libre" : "cupos libres"),
  actualizado: (hace: string) => `Actualizado ${hace}`,
  restar: "Un cupo menos",
  sumar: "Un cupo más",
  recibesHoy: "¿Recibes animales hoy?",
  recibesAyuda: "Se muestra en la página de refugios para que sepan si pueden contactarte.",
  esteMes: "Este mes",
  publicados: "publicados",
  postulaciones: "postulaciones",
  adoptados: "adoptados",
  animales: "Animales del refugio",
  publicar: "Publicar animal",
  verPostulaciones: "Ver postulaciones",
  postulacionesChip: (n: number) => (n === 1 ? "1 postulación" : `${n} postulaciones`),
  vacioAnimales: "No hay animales en esta pestaña.",
  datos: "Datos del refugio",
  editar: "Editar",
  gestionaAuraPet: "Nombre, región y verificación los gestiona el equipo AuraPet",
  equipo: "Equipo",
  sumarAlguien: "¿Quieres sumar a alguien?",
  escribenos: "Escríbenos",
  cuposGuardados: "Cupos actualizados",
  recepcionGuardada: "Recepción actualizada",
  datosGuardados: "Datos del refugio actualizados",
  editarTitulo: "Editar datos del refugio",
  guardar: "Guardar",
  cancelar: "Cancelar",
  cargando: "Cargando tu refugio…",
  error: "No pudimos cargar tu refugio.",
  errorGuardar: "No se pudo guardar. Intenta de nuevo.",
  sinRefugio: "No administras ningún refugio.",
  porRevisar: "Tu refugio está en revisión: todavía no aparece en la página pública.",
  rechazado: "Tu refugio no fue aprobado. Escríbenos para revisarlo.",
  refugio: "Refugio",
} as const;
export const ESPECIE_ADOPCION_LABEL: Record<EspecieAdopcion, string> = { perro: "Perro", gato: "Gato", otro: "Otro" };
