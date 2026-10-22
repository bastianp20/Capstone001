import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type TipoSolicitud = "veterinario" | "centro" | "solicitud_centro";  // solicitud_centro = pidió unirse desde /solicitar-centro
export type UrgenciaCita = "baja" | "media" | "alta" | "critica";
export type EstadoCita = "pendiente" | "confirmada" | "en_curso" | "completada" | "cancelada";
export type Rol = "dueno" | "veterinario" | "centro" | "superadmin";
export type EspecieMascota = "perro" | "gato" | "ave" | "conejo" | "otro";
export type VistaHome = "landing" | "como-funciona" | "veterinarias" | "duenos" | "nosotros" | "contacto";
export type ModoLogin = 'ingresar' | 'crear' | 'recuperar';


export interface SolicitudPendiente {
  id: string; // "centro-3" o "veterinario-5": vienen de dos tablas distintas
  nombre: string;
  tipo: TipoSolicitud;
  fechaRegistro: string;
  detalle?: string;  // línea extra bajo el nombre (p. ej. especialidad y centro del veterinario)
}

export interface CitaResumen {
  id: number;
  mascota: string;
  dueno: string;
  veterinario: string;
  centro: string;
  fechaHora: string; // ya viene formateada para mostrar ("dd/mm · HH:mm"), a diferencia de Cita.fechaHora que es la fecha cruda en number
  estado: EstadoCita;
  urgencia: UrgenciaCita;
  motivo?: string;
  esPrueba?: boolean;                 // la cita es de un centro de pruebas
}

export interface RechazarModalProps {
  nombreSolicitud: string;            // detalle bajo el título, p. ej. "Karlota · 20/10 · 09:00"
  onCancelar: () => void;
  onConfirmar: (razon: string) => void;
  titulo?: string;                    // por defecto TEXTOS_RECHAZO.titulo
  descripcion?: string;               // por defecto TEXTOS_RECHAZO.descripcion
  ocupado?: boolean;                  // true mientras se guarda: bloquea el modal y muestra "Rechazando…"
}

export interface SpinnerProps {
  tamano?: number;                    // px, por defecto 16
}

export interface ContadorCaracteresProps {
  actual: number;
  maximo: number;
}

export interface KpiCardProps {
  icon: ReactNode;          // un ícono de lucide, p. ej. <iconos.usuarios size={18} />
  label: string;
  value: number | string;
  hint?: ReactNode;         // línea de detalle bajo el número
  cargando?: boolean;       // mientras llegan los datos se muestra "–"
  onClick?: () => void;     // si viene, la tarjeta se puede apretar
}

// Números reales del panel de superadmin (ver getResumenSuperadmin)
export interface ResumenSuperadmin {
  usuarios: { total: number; duenos: number; veterinarios: number; superadmins: number };
  centros: { activos: number; dePrueba: number };
  veterinarios: { total: number; verificados: number; pendientes: number };
  citasHoy: { total: number; urgentes: number };
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  telefono?: number; // ya que un numero telefonico siempre será un numero 
  avatarUrl?: string;
  creadoEn: number; // si nos da un valor de date lo más seguro es que sea decimal por ende podemos truncarlo y extraer los valores que necesitamos
  password: string; // esto es solo momentaneo 
}

// Mascota tal como la usa la app (viene de la tabla mascotas de Supabase).
export interface Mascota {
  id: number;
  duenoId: string | null;          // uuid del dueño (null si el dueño borró su cuenta)
  nombre: string;
  especie: EspecieMascota;
  raza: string | null;
  fechaNacimiento: string | null;  // "2021-03-15" (columna date); null si no se conoce
  sexo: "macho" | "hembra";
  esterilizado: boolean;
  fotoUrl: string | null;
  pesoKg: number | null;
  alergias: string | null;         // se muestra como advertencia en la tarjeta
}

export interface Centro {
  id: number;
  nombre: string;
  direccion: string;
  comuna: string;
  telefono: number;
  horarioApertura: number // y este lo mismo que con el horario de cierre. 
  horarioCierre: number // puede que nos de un valor tipo 19.40, si fuese el caso, podemos mapearlo y extraer los valores.
  diasAtencion: string[]; // ["lunes", "martes", ...]
  especialidades: string[];
}


export interface Veterinario {
  id: number;
  usuarioId: number // FK -> Usuario (rol veterinario)
  centroIds: number[]; // FK -> Centro (puede atender en varios)
  especialidad: string;
  numeroColegiado: string;
}

export interface Cita {
  id: number;
  mascotaId: number; // FK -> Mascota
  duenoId: number; // FK -> Usuario
  veterinarioId?: number; // FK -> Veterinario (puede no estar asignado aun)
  centroId: number; // FK -> Centro
  fechaHora: number // este tipo de dato tiene que estar en number para que luego podamos mapearlo y extraer los atributs, tales como la hora o la fecha :p
  motivo: string;
  estado: EstadoCita;
  urgencia: UrgenciaCita; // sugerida por el sistema de IA
  sintomasReportados?: string[];
  creadaEn: string;
}


export interface Diagnostico {
  id: number;
  citaId: number; // FK -> Cita
  mascotaId: number; // FK -> Mascota
  veterinarioId: number; // FK -> Veterinario
  fecha: number; // ISO date
  descripcion: string;
  tratamiento?: string;
  derivadoA?: {
    tipo: "veterinario" | "centro";
    id: number;
    motivo: string;
  };
}


export interface RegistroHistorialMedico {
  id: number;
  mascotaId: number; // FK -> Mascota
  fecha: number; // 
  tipo: "diagnostico" | "vacuna" | "cirugia" | "control" | "otro";
  descripcion: string;
  veterinarioId?: number;
  centroId?: number;
}

export interface PacienteVeterinario {
  id: number; // mascotaId
  nombre: string;
  especie: string;
  raza: string;
  dueno: string;
  ultimaVisita: string;
  totalVisitas: number;
  fechaNacimiento: string | null; // "2022-05-14" (para calcular la edad)
  pesoKg: number | null;
  alergias: string | null;        // se muestra como advertencia al recetar
}

export interface MedicamentoReceta {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
}

export interface NuevaReceta {
  mascotaId: number;
  medicamentos: MedicamentoReceta[];
  indicaciones: string;
  proximoControl?: string;            // "2026-10-26"
}
export interface RecetaModalProps {
  veterinarioId: number;
  pacienteInicialId?: number;     // si se abre desde "Recetar" en una cita, el paciente ya viene elegido
  nombreVeterinario?: string;     // para el subtítulo: "Dr. Camilo Rojas · Clínica VetSur · 13/10/2026"
  centro?: string;
  onCerrar: () => void;
  onGuardada?: () => void;        // avisa que se guardó (para recargar lo que corresponda)
}
export interface CitaProximaDueno {
  id: number;
  mascotaId: number;
  mascota: string;
  centro: string;
  dia: string;
  mes: string;
  hora: string;            // "10:30"
  puedeCancelar: boolean;  // solo pendiente o confirmada
  motivo: string;
  estado: EstadoCita;
  urgencia: UrgenciaCita;
  rechazo?: { motivo: string };   // solo si el veterinario la rechazó
}

export interface HistorialRecienteItem {
  id: number;
  mascota: string;
  descripcion: string;
  fecha: string;
}

// ---------- Sesión real (Supabase Auth + tabla perfiles) ----------
// Rol de la cuenta en la base de datos. "Admin de centro" no es un rol:
// es un cargo en la tabla admins_centro.
export type RolCuenta = "dueno" | "veterinario" | "superadmin" | "administrativo";

// La persona conectada. El id es el uuid de Supabase Auth (= perfiles.id).
export interface UsuarioActual {
  id: string;
  email: string;
  nombre: string;
  rol: RolCuenta;
  telefono: number | null;
  avatarUrl: string | null;
  esPrueba: boolean;          // cuenta del equipo de desarrollo: usa solo centros de prueba
}

export interface DatosRegistro {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  rol: "dueno" | "veterinario"; // nadie puede registrarse como superadmin
  veterinario?: DatosLaboralesVeterinario; // solo si rol = "veterinario"
}

export interface AuthContextValue {
  usuarioActual: UsuarioActual | null;
  cargando: boolean; // true mientras se recupera la sesión al abrir la app
  login: (email: string, password: string) => Promise<string | null>; // null = ok; si no, el mensaje de error
  registrar: (datos: DatosRegistro) => Promise<{ error?: string; requiereConfirmacion?: boolean }>;
  logout: () => Promise<void>;
  recargarPerfil: () => void; // vuelve a leer el perfil (después de editarlo)
  // Recuperar contraseña: manda el correo con el enlace (null = ok; si no, el error)
  recuperarPassword: (email: string) => Promise<string | null>;
  // Guarda la nueva contraseña de la sesión actual (la del enlace del correo)
  cambiarPassword: (nueva: string) => Promise<string | null>;
  enRecuperacion: boolean;     // se entró desde el enlace "restablecer contraseña"
  terminarRecuperacion: () => void;
}

export interface ModalPacientesProps {
  veterinarioId: number;
  onCerrar: () => void;
  onRecetar?: (mascotaId: number) => void;   // "Recetar" desde la ficha del paciente
}

// Pestañas del modal de agenda del veterinario
export type PestanaAgenda = "por_confirmar" | "agenda";

export interface ModalAgendaProps {
  veterinarioId: number;
  pestanaInicial?: PestanaAgenda;     // desde "Por confirmar" se abre directo en las solicitudes
  onCerrar: () => void;
  onCambio?: () => void;              // avisa que se confirmó/rechazó algo (para recargar el inicio)
}

export interface ConocenosModalProps {
  onCerrar:() => void; 

}

export interface NavbarProps {
  vistaActiva?: VistaHome;
  onNavegar?: (vista: VistaHome) => void;
  onIngresar?: () => void;
}

export interface ContactoScreenProps {
  onNavegar?: (vista: VistaHome) => void;
  onIngresar?: () => void;
}

export interface FooterProps {
  vistaActiva?: VistaHome;
  onNavegar?: (vista: VistaHome) => void;
}

export interface Contacto {
  id: number;
  nombre: string;
  correo: string;
  telefono?: number;        // opcional, no todos van a dejar número
  asunto: string;           // esto es tu "razon" — el motivo de la consulta, en palabras propias de cada persona
  mensaje: string;
  categoria: string;        // a qué tema real pertenece el mensaje (login, precios, notificaciones, etc).
                             // Dos personas casi nunca escriben el mismo "asunto", pero sí preguntan
                             // por el mismo tema de fondo — por eso agrupamos/contamos por categoria
                             // y no por el texto exacto del asunto.
  creadoEn: number;         // mismo formato que usas en Usuario/Cita (ej: 20251001)
  estado: "pendiente" | "respondido" | "cerrado"; // para que el superadmin sepa qué falta ver
}

export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
  cantidad: number; // cuántos mensajes de contactoMock caen en esta categoria (para mostrar la "moda")
}

// Servicios que se mostrarán en el home 
export interface Servicio {
  icono: LucideIcon;
  titulo: string;
  descripcion: string;
}

export interface ServiciosProps {
  titulo?: string;               // por defecto "¿Qué puedes hacer en AuraPet?"
  servicios?: Servicio[];        // si no se pasa, usa los mock del componente
  onIngresar?: () => void;       // por si agregas un botón "Agenda una cita"
}

export interface LoginScreenProps {
  onCerrar: () => void;
  onSolicitarCentro?: () => void; // abre el formulario de solicitud para centros
}

export interface ParaDuenosScreenProps {
  onNavegar?: (vista: VistaHome) => void;
  onIngresar?: () => void;
}

export interface CrearProfesionalModalProps {
  onClose: () => void;
}

// EDGE FUNCTIONS 
// ésto es lo que debe de ir en la carpeta de api con su metodo de post para crear un nuevo profesional
export interface DatosNuevoProfesional {
  nombre: string;
  correo: string;
  telefono: string;          // "56912345678" o "" si no hay
  password: string;           // la elige el superadmin (mín. 6 caracteres)
  numeroColegiado: string;
  especialidadId: number | null;
  especialidadOtra: string;   // "" si no tiene o está en el catálogo
  centroId: number | null;    // null = independiente o centro que aún no está en AuraPet
  centroMencionado: string;   // centro que aún no está en AuraPet ("" si no aplica)
  centroMencionadoComuna: string;
  esAdminCentro: boolean;
  esPrueba: boolean;
}

export interface DatosNuevoDueno {
  nombre: string;
  correo: string;
  telefono: string; // "56912345678" o ""
  esPrueba?: boolean; // cuenta de prueba (no aplica a superadmins)
}
export interface CrearDuenoModalProps {
  onClose: () => void;
}

// Crear superadmin: mismos datos que un dueño
export type DatosNuevoSuperadmin = DatosNuevoDueno;
export interface CrearSuperadminModalProps {
  onClose: () => void;
}

// Crear centro (solo superadmin). Un elemento por cada día que atiende.
export interface HorarioCentroNuevo {
  dia_semana: number;              // 1 = lunes ... 7 = domingo
  abre: string;                    // "09:00"
  cierra: string;                  // "19:00"
  inicio_colacion: string | null;  // null = atiende de corrido
  fin_colacion: string | null;
}
export interface DatosNuevoCentro {
  nombre: string;
  direccion: string;
  comuna: string;
  telefono: string;                // "56912345678" o ""
  esPrueba: boolean;
  horarios: HorarioCentroNuevo[];
  especialidadIds: number[];
}
export interface CrearCentroModalProps {
  onClose: () => void;
}

// Crear Mascota, el dueño puede hacerlo 
export interface DatosNuevaMascota {
  nombre: string;
  especie: EspecieMascota;
  sexo: "macho" | "hembra";
  raza: string;            // "" si no se sabe
  fechaNacimiento: string; // "2021-03-15" o "" si no se sabe
  pesoKg: string;          // "12.5" o ""
  esterilizado: boolean;
}

export interface CrearMascotaModalProps {
  duenoId: string;
  onClose: () => void;
  onCreada: () => void;
}

// Panel superadmin → "Centros y veterinarios": cada veterinario con sus centros
export interface CentroAsignado {
  id: number;
  nombre: string;
  esPrueba: boolean;
}
export interface VeterinarioAsignaciones {
  id: number;                 // id en la tabla veterinarios
  nombre: string;
  especialidad: string | null;
  numeroColegiado: string | null;
  estado: "pendiente" | "aprobado" | "rechazado";
  esPrueba: boolean;          // cuenta de prueba: solo se asigna a centros de prueba
  centros: CentroAsignado[];
  centroSolicitado: string | null;   // centro de AuraPet que pidió al registrarse (se asigna al aprobar)
  centroMencionado: string | null;   // centro que aún no está en AuraPet ("Nombre, comuna")
}

// =====================================================================
// ADMIN DE CENTRO
// "Admin de centro" es un cargo (tabla admins_centro), no un rol: lo puede
// tener un veterinario o una cuenta "administrativo".
// =====================================================================
export interface CentroAdministrado {
  id: number;
  nombre: string;
}

export interface HorarioCentro {
  diaSemana: number;               // 1 = lunes ... 7 = domingo
  abre: string;                    // "09:00"
  cierra: string;
  inicioColacion: string | null;
  finColacion: string | null;
}

export interface CentroDetalle {
  id: number;
  nombre: string;
  direccion: string;
  comuna: string;
  telefono: number | null;
  esPrueba: boolean;
  especialidades: string[];
  horarios: HorarioCentro[];
}

export interface MiembroEquipo {
  perfilId: string | null;
  nombre: string;
  tipo: "veterinario" | "admin";
  detalle: string;                 // especialidad del vet, o "Administrador"
}

export interface CitaCentro {
  id: number;
  fechaIso: string;                // timestamptz tal cual (para filtrar por día/mes)
  fechaHora: string;               // ya formateada: "10/09 · 10:30"
  mascota: string;
  dueno: string;
  veterinario: string;
  motivo: string;
  estado: EstadoCita;
  urgencia: UrgenciaCita;
}

export interface DatosEdicionCentro {
  nombre: string;
  direccion: string;
  comuna: string;
  telefono: string;                // "56912345678" o ""
  esPrueba?: boolean;              // solo el superadmin lo cambia (el admin de centro no)
}

export interface DatosNuevoAdministrativo {
  nombre: string;
  correo: string;
  telefono: string;                // "56912345678" o ""
  centroId: number;
  esPrueba: boolean;
}
export interface CrearAdministrativoModalProps {
  onClose: () => void;
}

export interface VeterinarioScreenProps {
  onAdministrarCentro?: (centroId: number) => void; // abre el panel de un centro que administra
}

export interface CentroAdminScreenProps {
  centroInicialId?: number;        // si viene, abre ese centro
  onVolver?: () => void;           // solo para veterinarios: volver a "Mi agenda"
}

// =====================================================================
// MODAL DE RECETA (componentes en components/receta/)
// =====================================================================

// Una columna de la tabla de medicamentos (ver COLUMNAS_MEDICAMENTO en constants.ts)
export interface ColumnaMedicamento {
  campo: keyof MedicamentoReceta;
  titulo: string;
  placeholder: string;
}

// Un botón de atajo para el próximo control: "En 7 días", etc.
export interface AtajoProximoControl {
  texto: string;
  dias: number;
}

export interface SelectorPacienteProps {
  pacientes: PacienteVeterinario[];
  pacienteId: number | null;
  onSeleccionar: (id: number | null) => void; // null = volver a elegir
  cargando?: boolean;
}

export interface TarjetaPacienteProps {
  paciente: PacienteVeterinario;
  onCambiar?: () => void;
}

export interface TablaMedicamentosProps {
  medicamentos: MedicamentoReceta[];
  onCambiar: (index: number, campo: keyof MedicamentoReceta, valor: string) => void;
  onAgregar: () => void;
  onEliminar: (index: number) => void;
}

export interface FilaMedicamentoProps {
  medicamento: MedicamentoReceta;
  numero: number;                 // para los aria-label: "Medicamento 2"
  puedeEliminar: boolean;         // la última fila que queda no se puede borrar
  onCambiar: (campo: keyof MedicamentoReceta, valor: string) => void;
  onEliminar: () => void;
}

export interface ProximoControlProps {
  valor: string;                  // "2026-10-20" o "" si no hay
  onCambiar: (fecha: string) => void;
}

// =====================================================================
// INICIO DEL VETERINARIO (components/veterinario/)
// =====================================================================

// Una cita de hoy, con lo que se muestra en "Próxima cita" y en la agenda
export interface CitaInicioVet {
  id: number;
  hora: string;                       // "10:30"
  motivo: string;
  sintomas: string[];
  estado: EstadoCita;
  urgenciaSugerida: UrgenciaCita | null;  // la que propone la IA
  urgencia: UrgenciaCita | null;          // la que confirmó el veterinario
  mascotaId: number;
  mascota: string;
  especie: string;
  raza: string | null;
  fechaNacimiento: string | null;
  alergias: string | null;
  condicionesCronicas: string | null;
  dueno: string;
  telefonoDueno: number | null;
}

// Pendientes de la columna derecha
export interface UrgenciaPorConfirmar {
  citaId: number;
  mascota: string;
  fechaHora: string;                  // "13/10 · 10:30"
  urgenciaSugerida: UrgenciaCita;
}
export interface ControlProximo {
  recetaId: number;
  mascota: string;
  fecha: string;                      // "2026-10-16"
}
export interface RecetaReciente {
  id: number;
  mascota: string;
  creadaEn: string;                   // timestamptz
}

// Todo lo que muestra la pantalla de inicio, en una sola consulta
export interface InicioVeterinarioDatos {
  citasHoy: CitaInicioVet[];
  porConfirmar: number;               // citas pendientes de hoy en adelante
  urgenciasPorConfirmar: UrgenciaPorConfirmar[];
  controlesProximos: ControlProximo[];
  recetasRecientes: RecetaReciente[];
  atencionesPorDia: number[];         // índice 0 = día 1 del mes
}

// Cambio que puede hacer el veterinario sobre su cita (función actualizar_mi_cita)
export interface CambioCita {
  estado?: EstadoCita;
  urgencia?: UrgenciaCita;
}

// Botón de "siguiente paso" según el estado actual (ver SIGUIENTE_PASO_CITA)
export interface PasoCita {
  estado: EstadoCita;
  texto: string;
}

export interface InicioVeterinarioProps {
  veterinarioId: number;              // -1 mientras carga
  nombre: string;
  onRecetar: (mascotaId: number) => void;
  onVerPorConfirmar?: () => void;     // abre la agenda en las solicitudes por confirmar
  recargaExterna?: number;            // cambia cuando otra pantalla (la agenda) modificó citas
}

export interface ProximaCitaProps {
  cita: CitaInicioVet | undefined;
  ocupado: boolean;                   // mientras se guarda un cambio
  onCambiar: (citaId: number, cambio: CambioCita) => void;
  onRecetar: (mascotaId: number) => void;
}

export interface AgendaHoyProps {
  citas: CitaInicioVet[];
  destacadaId?: number;               // la "próxima cita" se resalta
}

export interface PendientesVeterinarioProps {
  urgencias: UrgenciaPorConfirmar[];
  controles: ControlProximo[];
  recetas: RecetaReciente[];
}

export interface AtencionesMesProps {
  atencionesPorDia: number[];
}

// ---------- Componentes genéricos (components/ui/) ----------
export interface TarjetaPanelProps {
  titulo?: string;
  accion?: ReactNode;                 // algo a la derecha del título (botón, selector)
  className?: string;
  children: ReactNode;
}

export interface IndicadorProps {
  etiqueta: string;
  valor: ReactNode;
  tono?: "normal" | "alerta";         // alerta = número en rojo
  progreso?: number;                  // 0 a 1: muestra una barrita debajo
  onClick?: () => void;               // si viene, el indicador se puede apretar
}

export interface EstadoVacioProps {
  texto: string;
  icono?: ReactNode;
}

export interface BarraGrafico {
  etiqueta: string;                   // para el tooltip: "13 oct"
  valor: number;
  futuro?: boolean;                   // día que aún no llega: barra tenue sin altura
  destacado?: boolean;                // hoy
}

export interface GraficoBarrasProps {
  barras: BarraGrafico[];
  marcasEje: number[];                // índices (desde 1) que muestran su número abajo
  unidad: string;                     // "atenciones"
  unidadSingular: string;             // "atención" (cuando el valor es 1)
  altura?: number;                    // px
}

// =====================================================================
// PANEL DEL DUEÑO (components/dueno/)
// =====================================================================

export type TipoRegistro = "diagnostico" | "vacuna" | "cirugia" | "control" | "otro";

// Secciones que se ven en el panel; "Solicitar cita" y "Configuración" abren modales
export type SeccionDueno = "inicio" | "mascotas" | "historial";
export interface ItemMenuDueno {
  id: SeccionDueno | "solicitar" | "configuracion";
  texto: string;
  icono: LucideIcon;
}

// Historial médico completo
export interface RegistroMedicoDueno {
  id: number;
  mascotaId: number;
  mascota: string;
  fecha: string;                   // "20 dic 2025"
  tipo: TipoRegistro;
  descripcion: string;
  tratamiento: string | null;
  proximaDosis: string | null;     // "20 dic 2026"
}
export interface RecetaDueno {
  id: number;
  mascotaId: number;
  mascota: string;
  fecha: string;                   // "13/10/2026"
  indicaciones: string | null;
  proximoControl: string | null;   // "20 oct 2026"
  medicamentos: MedicamentoReceta[];
}
export interface HistorialDueno {
  registros: RegistroMedicoDueno[];
  recetas: RecetaDueno[];
}

// Para solicitar una cita
export interface CentroParaCita {
  id: number;
  nombre: string;
  comuna: string;
  esPrueba: boolean;
  horarios: HorarioCentro[];       // vacío = el centro no registró horarios
}
export interface VeterinarioParaCita {
  id: number;
  nombre: string;
  especialidad: string | null;
}
export interface DatosSolicitudCita {
  mascotaId: number;
  centroId: number;
  veterinarioId: number | null;    // null = sin preferencia
  fechaHora: string;               // ISO (timestamptz)
  motivo: string;
  sintomas: string[];
}

// ---------- Props ----------
export interface MenuDuenoProps {
  seccion: SeccionDueno;
  onElegir: (id: ItemMenuDueno["id"]) => void;
}

export interface MascotaCardProps {
  mascota: Mascota;
  onSolicitarCita?: (mascotaId: number) => void;
}

export interface GrillaMascotasProps {
  mascotas: Mascota[];
  onAgregar: () => void;
  onSolicitarCita?: (mascotaId: number) => void;
}

export interface ProximasCitasDuenoProps {
  citas: CitaProximaDueno[];
  onCancelar: (citaId: number) => void;
  cancelandoId: number | null;     // cita que se está cancelando (deshabilita su botón)
}

export interface HistorialRecienteProps {
  items: HistorialRecienteItem[];
}

export interface HistorialMedicoProps {
  mascotas: Mascota[];
  historial: HistorialDueno;
  cargando: boolean;
}

export interface TarjetaRecetaProps {
  receta: RecetaDueno;
}

export interface SolicitarCitaModalProps {
  mascotas: Mascota[];
  mascotaInicialId?: number;       // si se abre desde la tarjeta de una mascota
  onClose: () => void;
  onCreada: () => void;            // para recargar "Próximas citas"
}

// =====================================================================
// CUENTAS DE PRUEBA
// =====================================================================
export interface CasillaCuentaPruebaProps {
  marcada: boolean;
  onCambiar: (marcada: boolean) => void;
  titulo?: string;                 // por defecto "Cuenta de prueba"
  ayuda?: string;                  // por defecto TEXTO_CUENTA_PRUEBA
}

// =====================================================================
// EDITAR CUENTAS (superadmin → Usuarios)
// =====================================================================

// Una cuenta tal como la devuelve listar_usuarios()
export interface CuentaUsuario {
  id: string;
  nombre: string;
  email: string;
  rol: RolCuenta;
  telefono: number | null;
  es_prueba: boolean;
  desactivado_en: string | null;    // null = activa
  creado_en: string;
}

// Lo que se puede cambiar de una cuenta. Solo se manda lo que cambió.
export interface CambiosCuenta {
  nombre?: string;
  telefono?: number | null;
  activa?: boolean;
  esPrueba?: boolean;
}

// Una línea del resumen "Vas a cambiar..." antes de guardar una cuenta real
export interface CambioResumen {
  campo: string;
  antes: string;
  despues: string;
}

export interface EditarCuentaModalProps {
  cuenta: CuentaUsuario;
  esMiCuenta: boolean;              // no se permite desactivar la propia cuenta
  onClose: () => void;
  onGuardada: () => void;           // para recargar la lista
}

export interface DesbloqueoCuentaRealProps {
  onDesbloquear: () => void;        // se llama cuando el código escrito coincide
  titulo?: string;                  // por defecto "Esta es una cuenta real"
}

// =====================================================================
// FILTROS REUTILIZABLES (hooks/useFiltro.ts + components/ui/BarraFiltros.tsx)
// =====================================================================

// Un chip de filtro: su valor y el texto que se ve
export interface OpcionFiltro<F extends string> {
  valor: F;
  texto: string;
}

export interface OpcionesFiltro<T, F extends string> {
  items: T[];
  camposBusqueda: (item: T) => (string | null | undefined)[]; // textos donde busca el buscador
  filtros: Record<F, (item: T) => boolean>;                  // qué deja pasar cada chip
  filtroInicial: F;
}

export interface BarraFiltrosProps<F extends string> {
  busqueda: string;
  onBuscar: (texto: string) => void;
  placeholder: string;
  opciones: OpcionFiltro<F>[];
  filtro: F;
  onFiltro: (filtro: F) => void;
  cantidad?: (filtro: F) => number;   // si se pasa, muestra el número en cada chip
}

// =====================================================================
// SUPERADMIN → CENTROS
// =====================================================================
export type FiltroUsuarios = "todos" | RolCuenta | "prueba";
export type FiltroAsignaciones = "todos" | "sinCentro" | "pendientes" | "prueba";
export type FiltroCentros = "todos" | "aprobado" | "pendiente" | "rechazado" | "prueba" | "real";
export type EstadoVerificacion = "pendiente" | "aprobado" | "rechazado";

// Un centro en la lista del superadmin
export interface CentroListado {
  id: number;
  nombre: string;
  direccion: string;
  comuna: string;
  telefono: number | null;
  estado: EstadoVerificacion;
  esPrueba: boolean;
  veterinarios: number;              // cuántos veterinarios atienden ahí
  creadoEn: string;
}

export interface EditarCentroModalProps {
  centro: CentroListado;
  onClose: () => void;
  onGuardado: () => void;
}

// =====================================================================
// FICHA DEL PACIENTE (veterinario) — ver migración 19
// =====================================================================
export type SexoMascota = "macho" | "hembra";

// Datos clínicos que el veterinario tratante puede actualizar
export interface DatosClinicosPaciente {
  pesoKg: number | null;
  alergias: string | null;
  condicionesCronicas: string | null;
  esterilizado: boolean;
  microchip: string | null;
}

// Un registro del historial tal como lo muestra la ficha
export interface RegistroFicha {
  id: number;
  fecha: string;                      // "20 dic 2025"
  tipo: TipoRegistro;
  descripcion: string;
  tratamiento: string | null;
  proximaDosis: string | null;        // "2026-12-20" (columna date, para calcular si venció)
  veterinario: string | null;         // quién lo registró
  centro: string | null;
  esMio: boolean;                     // lo registró el veterinario conectado
}

export interface FichaPaciente {
  id: number;                         // mascotaId
  nombre: string;
  especie: string;
  raza: string;
  sexo: SexoMascota;
  edad: number | null;                // años (null = sin fecha de nacimiento)
  fechaNacimiento: string | null;
  dueno: string;
  telefonoDueno: number | null;
  datosClinicos: DatosClinicosPaciente;
  historial: RegistroFicha[];         // del más reciente al más antiguo
}

// Estado de una vacuna según su próxima dosis
export type EstadoVacuna = "al_dia" | "por_vencer" | "vencida";

export interface VacunaFicha {
  registroId: number;
  nombre: string;                     // descripción de la vacuna
  aplicada: string;                   // "20 dic 2025"
  proximaDosis: string;               // "20 dic 2026"
  estado: EstadoVacuna;
}

export interface NuevoRegistroMedico {
  mascotaId: number;
  tipo: TipoRegistro;
  fecha: string;                      // "2026-10-18"
  descripcion: string;
  tratamiento: string;                // "" = sin tratamiento
  proximaDosis: string;               // "" = sin próxima dosis
}

// Lo que manda el formulario de datos clínicos. Los textos vacíos borran el dato.
export interface CambiosDatosClinicos {
  pesoKg: number | null;              // null = no cambiar
  alergias: string;
  condicionesCronicas: string;
  esterilizado: boolean;
  microchip: string;
}

// Qué muestra el modal de la ficha
export type VistaFicha = "resumen" | "registro" | "datos" | "derivar";

export interface FichaPacienteModalProps {
  mascotaId: number;
  onCerrar: () => void;
  onRecetar?: (mascotaId: number) => void;
}

export interface DatoFichaProps {
  etiqueta: string;
  valor: ReactNode;                   // null/"" se muestra como "Sin registrar"
}

export interface AlertasClinicasProps {
  alergias: string | null;
  condicionesCronicas: string | null;
}

export interface ResumenPacienteProps {
  ficha: FichaPaciente;
}

export interface EstadoVacunasProps {
  vacunas: VacunaFicha[];
}

export interface HistorialPacienteProps {
  registros: RegistroFicha[];
}

export interface AvisoFichaIncompletaProps {
  faltanDatos: boolean;
  faltaHistorial: boolean;
  onCompletarDatos: () => void;
  onAgregarRegistro: () => void;
}

export interface FormRegistroMedicoProps {
  mascotaId: number;
  onGuardado: () => void;
  onCancelar: () => void;
}

export interface FormDatosClinicosProps {
  mascotaId: number;
  datos: DatosClinicosPaciente;
  onGuardado: () => void;
  onCancelar: () => void;
}

export type VarianteBoton = "primario" | "secundario" | "peligro";

export interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton;           // por defecto "primario"
  cargando?: boolean;                 // muestra Spinner y deshabilita
  icono?: ReactNode;                  // ícono a la izquierda del texto
}

// =====================================================================
// SOLICITAR UNIRSE COMO CENTRO (página pública) — ver migración 20
// =====================================================================
export type CargoResponsable = "dueno" | "director_medico" | "administrador" | "otro";

export interface DatosSolicitudCentro {
  // Paso 1: el centro
  nombreCentro: string;
  direccion: string;
  comuna: string;
  telefonoCentro: string;             // 9 dígitos, sin el +56
  especialidadIds: number[];
  sitioWeb: string;
  // Paso 2: el responsable
  nombreResponsable: string;
  cargo: CargoResponsable | "";       // "" = todavía no elige
  correo: string;
  telefonoResponsable: string;        // 9 dígitos, sin el +56
  mensaje: string;
  // Paso 3: revisar
  aceptaContacto: boolean;
}

export type CampoSolicitud = keyof DatosSolicitudCentro;
export type ErroresSolicitud = Partial<Record<CampoSolicitud, string>>;
export type PasoSolicitud = 0 | 1 | 2;  // Tu centro · Responsable · Revisar

export interface PasoWizard {
  titulo: string;
  campos: CampoSolicitud[];           // lo que se valida al apretar "Continuar"
}

export interface EspecialidadOpcion {
  id: number;
  nombre: string;
}

export interface OpcionChip<T extends string | number> {
  valor: T;
  texto: string;
}

export interface ItemConIcono {
  icono: LucideIcon;
  titulo: string;
  detalle?: string;
}

export interface PreguntaRespuesta {
  pregunta: string;
  respuesta: string;
}

// Lo que expone useWizardSolicitud a la vista
export interface WizardSolicitud {
  datos: DatosSolicitudCentro;
  paso: PasoSolicitud;
  errores: ErroresSolicitud;          // solo los visibles (campos tocados o paso intentado)
  actualizar: <C extends CampoSolicitud>(campo: C, valor: DatosSolicitudCentro[C]) => void;
  marcarTocado: (campo: CampoSolicitud) => void;
  avanzar: () => CampoSolicitud | null;   // devuelve el primer campo con error (para darle foco) o null
  retroceder: () => void;
  irAPaso: (paso: PasoSolicitud) => void;
}

export interface SolicitarCentroVistaProps {
  especialidades: EspecialidadOpcion[];
  enviando: boolean;
  error: string | null;               // error del servidor
  enviadoA: string | null;            // correo; si viene, se muestra el estado de éxito
  onEnviar: (datos: DatosSolicitudCentro) => void;
  onVolverInicio: () => void;
}

export interface PanelMarcaSolicitudProps {
  imagen: string;
  onVolverInicio: () => void;
}

export interface IndicadorPasosProps {
  pasos: PasoWizard[];
  actual: number;
  onIrAPaso: (indice: number) => void;   // solo deja volver a pasos ya completados
}

export interface CampoFormularioProps {
  campo: CampoSolicitud;
  etiqueta: string;
  valor: string;
  error?: string;
  opcional?: boolean;
  placeholder?: string;
  prefijo?: string;                   // p. ej. "+56", fijo a la izquierda del input
  tipo?: "text" | "email" | "tel" | "url";
  multilinea?: boolean;
  maxLength?: number;
  sugerencias?: string[];             // datalist (p. ej. comunas)
  inputMode?: "text" | "numeric" | "email" | "url" | "tel";
  onCambiar: (valor: string) => void;
  onSalir: () => void;
}

export interface SelectorChipsProps<T extends string | number> {
  etiqueta: string;
  opciones: OpcionChip<T>[];
  seleccion: T[];                     // en selección única lleva 0 o 1 elemento
  multiple?: boolean;
  opcional?: boolean;
  error?: string;
  id: string;
  onCambiar: (seleccion: T[]) => void;
}

export interface PasoFormularioProps {
  wizard: WizardSolicitud;
}

export interface PasoCentroProps extends PasoFormularioProps {
  especialidades: EspecialidadOpcion[];
}

export interface PasoRevisarProps extends PasoFormularioProps {
  especialidades: EspecialidadOpcion[];
  error: string | null;
}

export interface TarjetaResumenProps {
  titulo: string;
  filas: { etiqueta: string; valor: string }[];
  onEditar: () => void;
}

export interface PreguntasFrecuentesSolicitudProps {
  preguntas: PreguntaRespuesta[];
}

export interface EstadoExitoSolicitudProps {
  correo: string;
  onVolverInicio: () => void;
}

// Detalle de una solicitud de centro, para que el superadmin la revise
export interface SolicitudCentroDetalle {
  id: number;
  nombreCentro: string;
  direccion: string;
  comuna: string;
  telefonoCentro: number;
  especialidades: string[];
  sitioWeb: string | null;
  nombreResponsable: string;
  cargo: string;                      // ya traducido ("Director/a médico/a")
  correo: string;
  telefonoResponsable: number;
  mensaje: string | null;
  fecha: string;                      // "18/10/2026"
}

export interface DetalleSolicitudCentroModalProps {
  solicitudId: number;
  ocupado: boolean;                   // mientras se aprueba
  error: string | null;
  onAprobar: () => void;
  onRechazar: () => void;
  onCerrar: () => void;
}

// =====================================================================
// PANEL DEL SUPERADMIN
// =====================================================================
export type SeccionSuperAdmin = "resumen" | "usuarios" | "centros" | "asignaciones" | "aprobaciones" | "suscripciones" | "mensajes" | "eliminaciones" | "notas" | "citas";

export interface ItemMenuSuperAdmin {
  seccion: SeccionSuperAdmin;
  texto: string;
  icono: LucideIcon;
}

export type TipoCrearSuperAdmin = "profesional" | "dueno" | "administrativo" | "superadmin" | "centro";

export interface OpcionCrearSuperAdmin {
  tipo: TipoCrearSuperAdmin;
  texto: string;
  icono: LucideIcon;
}

export interface AvisoEstado {
  tipo: "ok" | "error" | "info";
  texto: string;
}

// ---- Componentes de UI reutilizables ----
export interface AvisoProps extends AvisoEstado {
  onCerrar?: () => void;
}

export interface EtiquetaProps {
  texto: string;
  fondo: string;
  color: string;
}

export interface TablaPanelProps {
  titulo?: ReactNode;
  accion?: ReactNode;                 // a la derecha del título (p. ej. "Ver todas")
  columnas: string;                   // grid-template-columns, p. ej. "2fr 1fr 1fr"
  encabezados: string[];
  cargando?: boolean;
  error?: string | null;
  vacio: string;                      // texto cuando no hay filas
  cantidad: number;                   // cuántas filas hay (para saber si mostrar "vacío")
  children: ReactNode;
}

export interface FilaTablaProps {
  columnas: string;
  atenuada?: boolean;                 // p. ej. mientras se guarda
  children: ReactNode;
}

export interface PaginacionProps {
  pagina: number;                     // empieza en 1
  porPagina: number;
  total: number;
  onCambiar: (pagina: number) => void;
}

// ---- Piezas del panel ----
export interface MenuLateralSuperAdminProps {
  seccion: SeccionSuperAdmin;
  pendientes: number;                 // contador junto a "Aprobaciones"
  onCambiar: (seccion: SeccionSuperAdmin) => void;
}

export interface BarraSuperiorSuperAdminProps {
  nombre: string;
  pendientes: number;
  onCrear: (tipo: TipoCrearSuperAdmin) => void;
  onNotificaciones: () => void;
  onConfiguracion: () => void;
}

export interface MenuCrearProps {
  onElegir: (tipo: TipoCrearSuperAdmin) => void;
}

export interface TablaSolicitudesProps {
  solicitudes: SolicitudPendiente[];
  cargando?: boolean;
  titulo?: ReactNode;
  accion?: ReactNode;
  onAprobar: (s: SolicitudPendiente) => void;
  onRechazar: (s: SolicitudPendiente) => void;
  onVerDetalle: (s: SolicitudPendiente) => void;
}

export interface TablaCitasProps {
  citas: CitaResumen[];
  cargando?: boolean;
  error?: string | null;
  vacio: string;
  titulo?: ReactNode;
  accion?: ReactNode;
}

// Lo que expone useSolicitudesSuperAdmin (aprobar/rechazar desde cualquier sección)
export interface SolicitudesSuperAdmin {
  pendientes: SolicitudPendiente[];
  cargando: boolean;
  version: number;                    // sube cada vez que se resuelve una solicitud
  aviso: AvisoEstado | null;
  cerrarAviso: () => void;
  aprobar: (s: SolicitudPendiente) => void;
  aRechazar: SolicitudPendiente | null;
  pedirRechazo: (s: SolicitudPendiente) => void;
  cancelarRechazo: () => void;
  confirmarRechazo: (razon: string) => void;
  enDetalle: SolicitudPendiente | null;
  abrirDetalle: (s: SolicitudPendiente) => void;
  cerrarDetalle: () => void;
  ocupado: boolean;
  errorDetalle: string | null;
}

export interface ResumenSuperAdminProps {
  solicitudes: SolicitudesSuperAdmin;
  recarga: number;
  onIrA: (seccion: SeccionSuperAdmin) => void;
}

export interface AprobacionesSuperAdminProps {
  solicitudes: SolicitudesSuperAdmin;
}

// ---- Historial de aprobaciones ----
export type DecisionSolicitud = "aprobado" | "rechazado";
export type FiltroHistorial = "todas" | DecisionSolicitud;
export type PestanaAprobaciones = "pendientes" | "historial";

export interface SolicitudHistorial {
  id: string;                         // "veterinario-4", "centro-2", "solicitud_centro-7"
  tipo: TipoSolicitud;
  nombre: string;
  decision: DecisionSolicitud;
  revisadoPor: string;
  fecha: string;                      // "18/10/2026"
  fechaISO: string;                   // para ordenar
  motivo: string | null;
}

// ---- Citas (getAllCitas) ----
export type RangoCitas = "proximas" | "hoy" | "pasadas" | "todas";

export interface FiltrosCitas {
  busqueda: string;
  estado: EstadoCita | null;
  urgencia: UrgenciaCita | null;
  rango: RangoCitas;
  pagina: number;                     // empieza en 1
  porPagina: number;
}

export interface PaginaCitas {
  citas: CitaResumen[];
  total: number;
}

// =====================================================================
// REGISTRO DE VETERINARIOS: dónde trabaja y especialidad (migración 23)
// =====================================================================
export type ModoCentroVeterinario = "independiente" | "centro_aurapet" | "centro_externo";

export interface DatosLaboralesVeterinario {
  modoCentro: ModoCentroVeterinario;
  centroId: number | null;            // si modoCentro = "centro_aurapet"
  centroNombre: string;               // si modoCentro = "centro_externo"
  centroComuna: string;
  especialidadId: number | null;      // del catálogo (además de medicina general)
  especialidadOtra: string;           // escrita a mano si no está en el catálogo
}

export interface CentroOpcion {
  id: number;
  nombre: string;
  comuna?: string;
}

export interface OpcionModoCentro {
  valor: ModoCentroVeterinario;
  titulo: string;
  detalle: string;
}

export interface SelectorCentroVeterinarioProps {
  datos: DatosLaboralesVeterinario;
  centros: CentroOpcion[];
  onCambiar: (cambios: Partial<DatosLaboralesVeterinario>) => void;
  ayudaCentroAuraPet?: string;        // p. ej. "Quedará asignado cuando aprobemos tu cuenta"
}

export interface SelectorEspecialidadProps {
  especialidades: EspecialidadOpcion[];
  especialidadId: number | null;
  especialidadOtra: string;
  onCambiar: (cambios: Partial<DatosLaboralesVeterinario>) => void;
}

// Lo que necesita la barra superior del panel del veterinario
export interface InfoVeterinario {
  id: number | null;                  // id en la tabla veterinarios (null si la cuenta aún no tiene ficha)
  centros: string[];                  // nombres de los centros donde atiende
  estado: EstadoVerificacion | null;  // "pendiente" mientras el superadmin no aprueba su cuenta
  centroSolicitado: string | null;    // centro de AuraPet que pidió (se asigna al aprobar)
  centroMencionado: string | null;    // centro que aún no está en AuraPet
}

// =====================================================================
// SUSCRIPCIÓN DE LOS CENTROS (migración 24)
// =====================================================================
export type PlanId = "inicial" | "profesional" | "gestion";
export type EstadoSuscripcion = "prueba" | "activa" | "vencida" | "cancelada";
export type EstadoHistorialSuscripcion = "completado" | "pendiente" | "rechazado";

export interface Plan {
  id: PlanId;
  nombre: string;
  precioMensual: number;              // CLP (0 = gratis)
  limiteVeterinarios: number | null;  // null = ilimitado
}

// Una fila del comparador: qué incluye cada plan (true / false / texto como "Ilimitados")
export interface FuncionPlan {
  texto: string;
  valores: Record<PlanId, boolean | string>;
}

export interface SuscripcionCentro {
  plan: Plan;
  estado: EstadoSuscripcion;
  inicio: string;                     // "2026-10-18"
  finPrueba: string | null;
  renovacion: string | null;
  veterinarios: number;               // uso real
  citasMes: number;
  planSolicitado: PlanId | null;      // solicitud de cambio en revisión
}

export interface HistorialSuscripcionItem {
  id: number;
  fecha: string;                      // "18/10/2026"
  accion: string;
  detalle: string | null;
  estado: EstadoHistorialSuscripcion;
}

export interface SeccionSuscripcionProps {
  centroId: number;
}

export interface HeroPlanProps {
  suscripcion: SuscripcionCentro;
  planMejora: Plan | null;            // a qué plan sugiere mejorar (null = ya está en el mejor)
  onMejorar: (plan: Plan) => void;
}

export interface UsoPlanProps {
  suscripcion: SuscripcionCentro;
  planMejora: Plan | null;
  onMejorar: (plan: Plan) => void;
}

export interface BarraUsoProps {
  etiqueta: string;
  usado: number;
  limite: number;
}

export interface ComparadorPlanesProps {
  planes: Plan[];
  planActual: PlanId;
  estadoActual: EstadoSuscripcion;
  planSolicitado: PlanId | null;
  onElegir: (plan: Plan) => void;
}

export interface TarjetaPlanProps {
  plan: Plan;
  esActual: boolean;
  esRecomendado: boolean;
  solicitado: boolean;                // hay una solicitud en revisión para este plan
  onElegir: () => void;
}

export interface CambioPlanModalProps {
  centroId: number;
  plan: Plan;
  onCerrar: () => void;
  onEnviado: () => void;              // para recargar la suscripción y el historial
}

export interface AcordeonProps {
  titulo?: string;
  items: PreguntaRespuesta[];
}

// =====================================================================
// DETALLE COMPLETO DE UN USUARIO (Superadmin → Usuarios → Ver detalles)
// =====================================================================
export interface CentroDeUsuario {
  id: number;
  nombre: string;
  comuna: string;
  esPrueba: boolean;
}

export interface MascotaDeUsuario {
  id: number;
  nombre: string;
  especie: string;                    // "Perro"
  raza: string | null;
  sexo: SexoMascota;
  edad: string | null;                // "3 años"
}

// Cita resumida para listas cortas (detalle de usuario y de centro)
export interface CitaDeUsuario {
  id: number;
  fecha: string;                      // "10/09 · 10:30"
  estado: EstadoCita;
  mascota: string;
  detalle: string;                    // línea secundaria: "Centro · Veterinario" o "Dueño · Veterinario"
}

export interface FichaProfesionalDeUsuario {
  estado: EstadoVerificacion;
  especialidad: string | null;
  numeroColegiado: string | null;
  revisadoPor: string | null;
  revisadoEn: string | null;          // "18/10/2026"
  motivoRechazo: string | null;
  centroSolicitado: string | null;
  centroMencionado: string | null;    // "Clínica X, Ñuñoa"
}

export interface DetalleUsuario {
  cuenta: {
    id: string;
    nombre: string;
    email: string;
    rol: RolCuenta;
    telefono: number | null;
    esPrueba: boolean;
    activa: boolean;
    registro: string;                 // "18/10/2026"
    ultimoAcceso: string | null;      // "18/10 · 19:20" (null = nunca ha entrado)
    correoConfirmado: boolean;
  };
  veterinario: FichaProfesionalDeUsuario | null;
  centrosAtiende: CentroDeUsuario[];
  centrosAdministra: CentroDeUsuario[];
  mascotas: MascotaDeUsuario[];
  citas: { total: number; proximas: number; completadas: number; canceladas: number };
  ultimasCitas: CitaDeUsuario[];
  recetasEmitidas: number;
}

export interface DetalleUsuarioModalProps {
  perfilId: string;
  onCerrar: () => void;
  onEditar: () => void;               // abre el modal de edición de la cuenta
}

export interface SeccionDetalleProps {
  titulo: string;
  icono?: ReactNode;
  children: ReactNode;
  ancha?: boolean;                    // ocupa las dos columnas
}

export interface ListaCentrosUsuarioProps {
  centros: CentroDeUsuario[];
  vacio: string;
}

export interface NumeroResumen {
  texto: string;
  valor: number;
}

export interface ResumenActividadProps {
  numeros: NumeroResumen[];
}

export interface ListaMascotasUsuarioProps {
  mascotas: MascotaDeUsuario[];
}

export interface ListaCitasUsuarioProps {
  citas: CitaDeUsuario[];
}

// Lo que devuelve tal cual la función detalle_usuario (jsonb, nombres de columnas)
export interface DetalleUsuarioCrudo {
  cuenta: {
    id: string; nombre: string; email: string; rol: RolCuenta; telefono: number | null;
    es_prueba: boolean; desactivado_en: string | null; creado_en: string;
    ultimo_acceso: string | null; correo_confirmado: boolean;
  };
  veterinario: {
    estado: EstadoVerificacion; especialidad: string | null; numero_colegiado: string | null;
    revisado_por: string | null; revisado_en: string | null; motivo_rechazo: string | null;
    centro_solicitado: string | null; centro_mencionado: string | null; centro_mencionado_comuna: string | null;
  } | null;
  centros_atiende: { id: number; nombre: string; comuna: string; es_prueba: boolean }[];
  centros_administra: { id: number; nombre: string; comuna: string; es_prueba: boolean }[];
  mascotas: { id: number; nombre: string; especie: string; raza: string | null; sexo: SexoMascota; fecha_nacimiento: string | null }[];
  citas: { total: number; proximas: number; completadas: number; canceladas: number };
  ultimas_citas: { id: number; fecha_hora: string; estado: EstadoCita; mascota: string; centro: string; veterinario: string | null }[];
  recetas_emitidas: number;
}

// =====================================================================
// DETALLE COMPLETO DE UN CENTRO (Superadmin → Centros → Ver detalles)
// =====================================================================
export interface HorarioDeCentro {
  dia: number;                        // 1 = lunes ... 7 = domingo
  texto: string;                      // "09:00–19:00 · colación 14:00–15:00"
}

// Una persona en una lista corta (administradores, veterinarios)
export interface PersonaDeCentro {
  id: string;
  nombre: string;
  detalle: string;                    // línea secundaria (correo, especialidad...)
  etiqueta?: EtiquetaProps;
}

export interface DetalleCentro {
  centro: {
    id: number;
    nombre: string;
    direccion: string;
    comuna: string;
    telefono: number | null;
    estado: EstadoVerificacion;
    esPrueba: boolean;
    creado: string;                   // "18/10/2026"
    revisadoPor: string | null;
    revisadoEn: string | null;
    motivoRechazo: string | null;
  };
  horarios: HorarioDeCentro[];
  especialidades: string[];
  suscripcion: {
    plan: string;
    precio: number;
    estado: EstadoSuscripcion;
    finPrueba: string | null;         // "23 oct 2026"
    renovacion: string | null;
    planSolicitado: string | null;
  } | null;
  administradores: PersonaDeCentro[];
  veterinarios: PersonaDeCentro[];
  citas: { total: number; hoy: number; proximas: number; completadas: number; canceladas: number; pacientes: number };
  ultimasCitas: CitaDeUsuario[];
  solicitudOrigen: {
    responsable: string;
    cargo: string;
    correo: string;
    telefono: number;
    sitioWeb: string | null;
    mensaje: string | null;
    fecha: string;
  } | null;
}

// Lo que devuelve tal cual la función detalle_centro (jsonb)
export interface DetalleCentroCrudo {
  centro: {
    id: number; nombre: string; direccion: string; comuna: string; telefono: number | null;
    estado: EstadoVerificacion; es_prueba: boolean; creado_en: string;
    revisado_por: string | null; revisado_en: string | null; motivo_rechazo: string | null;
  };
  horarios: { dia: number; abre: string; cierra: string; inicio_colacion: string | null; fin_colacion: string | null }[];
  especialidades: string[];
  suscripcion: {
    plan: string; precio: number; estado: EstadoSuscripcion;
    fin_prueba: string | null; renovacion: string | null; plan_solicitado: string | null;
  } | null;
  administradores: { id: string; nombre: string; email: string; rol: RolCuenta; desde: string }[];
  veterinarios: { id: number; nombre: string; especialidad: string | null; numero_colegiado: string | null; estado: EstadoVerificacion }[];
  citas: DetalleCentro["citas"];
  ultimas_citas: { id: number; fecha_hora: string; estado: EstadoCita; mascota: string; dueno: string | null; veterinario: string | null }[];
  solicitud_origen: {
    nombre_responsable: string; cargo: string; correo: string; telefono: number;
    sitio_web: string | null; mensaje: string | null; creado_en: string;
  } | null;
}

export interface DetalleCentroModalProps {
  centroId: number;
  onCerrar: () => void;
  onEditar: () => void;               // abre el modal de edición del centro
}

export interface HorarioCentroListaProps {
  horarios: HorarioDeCentro[];
}

export interface ListaPersonasCentroProps {
  personas: PersonaDeCentro[];
  vacio: string;
}

// =====================================================================
// SUSCRIPCIONES (vista del superadmin) — ver migración 28
// =====================================================================
export type FiltroSuscripciones = "todas" | "por_atender" | "prueba" | "activa" | "vencida";

export interface SuscripcionListada {
  centroId: number;
  centro: string;
  comuna: string;
  esPrueba: boolean;                  // centro de prueba (no el estado "prueba")
  plan: string;                       // nombre del plan
  estado: EstadoSuscripcion;          // estado efectivo (una prueba pasada ya sale "vencida")
  vence: string | null;               // fin de prueba o próxima renovación, "23 oct 2026"
  veterinarios: number;
  limite: number | null;              // null = ilimitado
  solicitud: {
    id: number;
    plan: string;                     // nombre del plan pedido
    mensaje: string | null;
    solicitante: string;
    fecha: string;                    // "18 oct 2026"
  } | null;
}

// =====================================================================
// DERIVACIONES — ver migración 29
// =====================================================================
export type EstadoDerivacion = "pendiente" | "realizada" | "cancelada";
export type TipoDestinoDerivacion = "veterinario" | "centro";
export type PestanaDerivaciones = "recibidas" | "enviadas";

export interface DestinoDerivacion {
  tipo: TipoDestinoDerivacion;
  id: number;
  nombre: string;
  detalle: string;                    // especialidad (veterinario) o comuna (centro)
}

export interface Derivacion {
  id: number;
  mascotaId: number;
  mascota: string;
  fecha: string;                      // "18/10/2026"
  origen: string;                     // quién derivó
  destino: string;
  motivo: string;
  estado: EstadoDerivacion;
  resultado: string | null;
  puedoResponder: boolean;            // soy el destino y está pendiente
  puedoCancelar: boolean;             // la hice yo y está pendiente
  direccion?: "recibida" | "enviada"; // solo en la vista del veterinario
  especie?: string;
  dueno?: string;
}

export interface NuevaDerivacion {
  mascotaId: number;
  destino: Pick<DestinoDerivacion, "tipo" | "id">;
  motivo: string;
}

export interface TarjetaDerivacionProps {
  derivacion: Derivacion;
  mostrarMascota?: boolean;           // en listas de varias mascotas
  onCambio?: () => void;              // tras responder/cancelar (para recargar)
  onVerFicha?: (mascotaId: number) => void;
}

export interface DerivacionesPacienteProps {
  mascotaId: number;
  recarga: number;
}

export interface FormDerivacionProps {
  mascotaId: number;
  onGuardado: () => void;
  onCancelar: () => void;
}

export interface DerivacionesModalProps {
  onCerrar: () => void;
  onRecetar?: (mascotaId: number) => void;
}

export interface DerivacionesDuenoProps {
  derivaciones: Derivacion[];
}

// =====================================================================
// CONTACTO (formulario público + bandeja del superadmin) — migración 30
// =====================================================================
export type EstadoContacto = "pendiente" | "respondido" | "cerrado";
export type FiltroMensajes = "todos" | EstadoContacto;

export interface DatosContacto {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
}

export interface MensajeContacto extends DatosContacto {
  id: number;
  estado: EstadoContacto;
  fecha: string;                      // "18/10/2026 14:05"
}

export interface OtraFormaContacto {
  titulo: string;
  descripcion: string;
  icono: LucideIcon;
  correo: string;
}

// =====================================================================
// PANEL DEL CENTRO (admin del centro)
// =====================================================================
export type SeccionCentroAdmin = "resumen" | "agenda" | "equipo" | "centro" | "suscripcion";

export interface ItemMenuCentroAdmin {
  seccion: SeccionCentroAdmin;
  texto: string;
  icono: LucideIcon;
}

export interface SeccionDeCentroProps {
  centroId: number;
}

export interface SeccionResumenCentroProps extends SeccionDeCentroProps {
  onIrA: (seccion: SeccionCentroAdmin) => void;
}

export interface TarjetaCentroProps {
  titulo: string;
  accion?: ReactNode;
  children: ReactNode;
}

export interface FormularioCentroProps {
  centro: CentroDetalle;
  onGuardado: () => void;
}

export interface MenuLateralCentroProps {
  seccion: SeccionCentroAdmin;
  onCambiar: (seccion: SeccionCentroAdmin) => void;
  onVolver?: () => void;
  onConfiguracion: () => void;
}

// Números del resumen (lib/centroAdmin.ts los calcula a partir de las citas)
export interface ResumenCitasCentro {
  hoy: number;
  porConfirmar: number;              // pendientes desde ahora en adelante
  mes: number;                       // del mes en curso, sin canceladas
  proximas: CitaCentro[];            // las siguientes (no canceladas), más cercana primero
}

export interface EtiquetaCitaProps {
  valor: EstadoCita | UrgenciaCita;   // clave de badgeStyles
  texto: string;
}

// ---- Configuración → Privacidad y datos (migración 31) ----
export interface SeccionPrivacidadProps {
  perfilId: string;
}

// =====================================================================
// ELIMINACIÓN DE CUENTA — ver migración 32
// =====================================================================
export type EstadoSolicitudEliminacion = "pendiente" | "aprobada" | "rechazada";

export interface SolicitudEliminacion {
  id: number;
  motivo: string | null;
  estado: EstadoSolicitudEliminacion;
  respuesta: string | null;
  fecha: string;                       // "19/10 · 14:05"
}

export interface SolicitudEliminacionListada extends SolicitudEliminacion {
  perfilId: string;
  nombre: string;
  correo: string;
  rol: RolCuenta;
}

export interface SolicitarEliminacionProps {
  perfilId: string;
}

// =====================================================================
// NOTAS PERSONALES — ver migración 33
// =====================================================================
export type ColorNota = "menta" | "arena" | "cielo" | "lavanda" | "coral";

export interface Nota {
  id: number;
  titulo: string;
  contenido: string;
  color: ColorNota;
  fijada: boolean;
  actualizada: string;                 // "19/10 · 14:05"
}

export interface DatosNota {
  titulo: string;
  contenido: string;
  color: ColorNota;
}

export interface TarjetaNotaProps {
  nota: Nota;
  ocupado: boolean;
  onEditar: () => void;
  onFijar: () => void;
  onBorrar: () => void;
}

export interface FormNotaProps {
  inicial?: DatosNota;                 // si viene, se está editando
  ocupado: boolean;
  onGuardar: (datos: DatosNota) => void;
  onCancelar: () => void;
}

export interface PanelNotasProps {
  descripcion?: string;
}

export interface NotasModalProps {
  onCerrar: () => void;
}

// =====================================================================
// FICHA MÉDICA EN PDF — ver migración 34 y lib/pdf/
// =====================================================================
export type TipoPdfFicha = "completa" | "resumen";

export interface RecetaFicha {
  id: number;
  fecha: string;                       // "20 oct 2026"
  indicaciones: string | null;
  proximoControl: string | null;       // "27 oct 2026"
  veterinario: string;
  colegiado: string | null;
  centro: string | null;
  medicamentos: MedicamentoReceta[];
}

export interface DerivacionFicha {
  fecha: string;                       // "20/10/2026"
  origen: string;
  destino: string;
  motivo: string;
  estado: EstadoDerivacion;
  resultado: string | null;
}

// Todo lo que lleva el PDF, ya con textos listos para imprimir
export interface FichaPdf {
  codigo: string;                      // "#000342"
  emitida: string;                     // "20 de octubre de 2026, 14:30 h"
  paciente: {
    nombre: string;
    especie: string;
    raza: string;
    sexo: string;
    nacimiento: string;                // "12 abr 2019 (7 años)" o "Sin registrar"
    peso: string;
    esterilizado: string;
    microchip: string;
  };
  tutor: { nombre: string; telefono: string };
  alergias: string | null;
  condicionesCronicas: string | null;
  vacunas: VacunaFicha[];
  historial: RegistroFicha[];
  recetas: RecetaFicha[];
  derivaciones: DerivacionFicha[];
}

export interface OpcionMascotaPdf {
  id: number;
  nombre: string;
}

export interface DescargaFichaPdfProps {
  mascotas: OpcionMascotaPdf[];        // si hay una sola, no se muestra el selector
  mascotaInicialId?: number | null;
}

export interface BotonRecetaPdfProps {
  mascotaId: number;
  recetaId: number;
  texto?: string;
}

// =====================================================================
// TIPOS QUE ESTABAN SUELTOS EN OTROS ARCHIVOS (ordenados el 20-10-2026)
// =====================================================================

// ---- Tema (lib/tema.ts, Configuración → Apariencia) ----
export type Tema = "claro" | "oscuro" | "auto";

export interface OpcionTema {
  valor: Tema;
  texto: string;
  icono: LucideIcon;
}

// ---- Configuración (Modal/ConfiguracionModal.tsx) ----
export interface ConfiguracionModalProps {
  onCerrar: () => void;
}

export type SeccionConfiguracion = "perfil" | "seguridad" | "apariencia" | "notificaciones" | "privacidad" | "ayuda";

export interface FilaConfiguracionProps {
  icono: ReactNode;
  titulo: string;
  descripcion: string;
  abierta?: boolean;
  proximamente?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

export interface SeccionPerfilProps {
  onGuardado: () => void;
}

export interface CampoClaveProps {
  placeholder: string;
  value: string;
  onChange: (valor: string) => void;
  autoComplete: string;
}

export interface SeccionSeguridadProps {
  onCerrarModal: () => void;
}

// ---- Agenda del veterinario (Api/getInfo.tsx → getAgendaVeterinario) ----
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

// ---- Crear centro (Modal/CrearCentroModal.tsx): un día del formulario de horarios ----
export interface DiaFormulario {
  dia: number;           // 1 = lunes ... 7 = domingo
  nombre: string;
  atiende: boolean;
  abre: string;
  cierra: string;
  conColacion: boolean;
  inicioColacion: string;
  finColacion: string;
}

// ---- Login: tipo de cuenta al registrarse ----
export type RolRegistro = "dueno" | "veterinario";

// ---- Landing ----
export interface TestimonioHome {
  texto: string;
  nombre: string;
  rol: string;
}

export interface PasoHome {
  numero: number;
  titulo: string;
  descripcion: string;
}

// ---- Derivaciones: qué respuesta se está escribiendo en la tarjeta ----
export type RespuestaDerivacion = "realizada" | "rechazo" | null;

// ---- PDF (lib/pdf/plantilla.ts) ----
export type RgbPdf = readonly [number, number, number];

// "Lienzo": el documento + la posición vertical (y) por la que vamos dibujando
export interface LienzoPdf {
  doc: import("jspdf").jsPDF;
  y: number;
  ancho: number;
  alto: number;
}

export interface OpcionesTextoPdf {
  x?: number;
  ancho?: number;
  tam?: number;
  negrita?: boolean;
  color?: RgbPdf;
}

// Lo que devuelve ficha_pdf (jsonb, migración 34) antes de pasarlo a textos
export interface FichaPdfCruda {
  mascota: {
    id: number; nombre: string; especie: string; raza: string | null; sexo: "macho" | "hembra";
    fecha_nacimiento: string | null; peso_kg: number | null; esterilizado: boolean; microchip: string | null;
    alergias: string | null; condiciones_cronicas: string | null;
  };
  tutor: { nombre: string | null; telefono: number | null };
  historial: {
    id: number; fecha: string; tipo: TipoRegistro; descripcion: string; tratamiento: string | null;
    proxima_dosis: string | null; veterinario: string | null; centro: string | null;
  }[];
  recetas: {
    id: number; fecha: string; indicaciones: string | null; proximo_control: string | null;
    veterinario: string | null; colegiado: string | null; centro: string | null; medicamentos: MedicamentoReceta[];
  }[];
  derivaciones: {
    fecha: string; origen: string | null; destino: string | null; motivo: string;
    estado: EstadoDerivacion; resultado: string | null;
  }[];
}
