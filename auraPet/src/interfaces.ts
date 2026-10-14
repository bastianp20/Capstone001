import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type TipoSolicitud = "veterinario" | "centro";
export type UrgenciaCita = "baja" | "media" | "alta" | "critica";
export type EstadoCita = "pendiente" | "confirmada" | "en_curso" | "completada" | "cancelada";
export type Rol = "dueno" | "veterinario" | "centro" | "superadmin";
export type EspecieMascota = "perro" | "gato" | "ave" | "conejo" | "otro";
export type VistaHome = "landing" | "como-funciona" | "veterinarias" | "duenos" | "nosotros" | "contacto";
export type ModoLogin = 'ingresar' | 'crear';


export interface SolicitudPendiente {
  id: string; // "centro-3" o "veterinario-5": vienen de dos tablas distintas
  nombre: string;
  tipo: TipoSolicitud;
  fechaRegistro: string;
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
}

export interface RechazarModalProps {
  nombreSolicitud: string;
  onCancelar: () => void;
  onConfirmar: (razon: string) => void;
}

export interface KpiCardProps {
  icon: ReactNode;          // un ícono de lucide, p. ej. <iconos.usuarios size={18} />
  label: string;
  value: number | string;
  hint?: ReactNode;         // línea de detalle bajo el número
  cargando?: boolean;       // mientras llegan los datos se muestra "–"
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
  veterinarioId: number;
  fecha: number; // YYYYMMDD, se genera al guardar — mismo formato que el resto del mock
  medicamentos: MedicamentoReceta[];
  indicaciones: string;
  proximoControl?: string;
}
export interface RecetaModalProps {
  veterinarioId: number;
  pacienteInicialId?: number;     // si se abre desde "Recetar" en una cita, el paciente ya viene elegido
  nombreVeterinario?: string;     // para el subtítulo: "Dr. Camilo Rojas · Clínica VetSur · 13/10/2026"
  centro?: string;
  onCerrar: () => void;
  // El guardado real (Supabase) se define después; por ahora el padre
  // decide qué hacer con la receta ya armada (loguearla, mostrarla, etc.).
  onGuardar: (receta: NuevaReceta) => void;
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
}

export interface AuthContextValue {
  usuarioActual: UsuarioActual | null;
  cargando: boolean; // true mientras se recupera la sesión al abrir la app
  login: (email: string, password: string) => Promise<string | null>; // null = ok; si no, el mensaje de error
  registrar: (datos: DatosRegistro) => Promise<{ error?: string; requiereConfirmacion?: boolean }>;
  logout: () => Promise<void>;
  recargarPerfil: () => void; // vuelve a leer el perfil (después de editarlo)
}

export interface ModalPacientesProps {
  veterinarioId: number;
  onCerrar: () => void;
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
  numeroColegiado: string;
  especialidadId: number | null;
  centroId: number;
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
}
