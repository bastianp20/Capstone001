import type { BottomTabBarProps } from 'expo-router/js-tabs';
import type { ReactNode } from 'react';
import type { DimensionValue, StyleProp, TextInputProps, ViewStyle } from 'react-native';

// ─── Sesión (igual que en la web) ───────────────────────────────────────

export type RolCuenta = 'dueno' | 'veterinario' | 'superadmin' | 'administrativo';

export type ModoLogin = 'ingresar' | 'crear' | 'recuperar';

export interface UsuarioActual {
  id: string;
  email: string;
  nombre: string;
  rol: RolCuenta;
  telefono: number | null;
  avatarUrl: string | null;
  esPrueba: boolean;
}

/** En la app solo se registran dueños; los veterinarios se registran en la web. */
export interface DatosRegistro {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
}

export interface ResultadoRegistro {
  error?: string;
  requiereConfirmacion?: boolean;
}

export interface AuthContextValue {
  usuarioActual: UsuarioActual | null;
  cargando: boolean; // true mientras se recupera la sesión al abrir la app
  login: (email: string, password: string) => Promise<string | null>; // null = ok; si no, el mensaje de error
  registrar: (datos: DatosRegistro) => Promise<ResultadoRegistro>;
  recuperarPassword: (email: string) => Promise<string | null>;
  logout: () => Promise<void>;
  /** Aviso cuando se cerró la sesión sola (cuenta sin perfil, desactivada o que no es de dueño). */
  avisoSesion: string;
  limpiarAvisoSesion: () => void;
  /** Vuelve a leer el perfil después de editarlo. */
  recargarPerfil: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}

// ─── Datos de la base (mismos enums que Supabase) ───────────────────────

export type EspecieMascota = 'perro' | 'gato' | 'ave' | 'conejo' | 'otro';
export type SexoMascota = 'macho' | 'hembra';
export type EstadoCita = 'pendiente' | 'confirmada' | 'en_curso' | 'completada' | 'cancelada';
export type TipoRegistro = 'diagnostico' | 'vacuna' | 'cirugia' | 'control' | 'otro';
export type EstadoDerivacion = 'pendiente' | 'realizada' | 'cancelada';

export interface Mascota {
  id: number;
  nombre: string;
  especie: EspecieMascota;
  raza: string | null;
  fechaNacimiento: string | null; // "2021-03-15"
  sexo: SexoMascota;
  esterilizado: boolean;
  pesoKg: number | null;
  alergias: string | null;
  condicionesCronicas: string | null;
  microchip: string | null;
  fotoUrl: string | null;
}

export interface CitaDueno {
  id: number;
  mascotaId: number;
  mascota: string;
  fechaHora: string; // ISO en UTC, como viene de la base
  motivo: string;
  estado: EstadoCita;
  sintomas: string[];
  centroId: number | null; // null = veterinario independiente
  centro: string | null;
  direccion: string | null;
  veterinario: string | null; // null = aún sin asignar
  /** Cancelada por el veterinario (rechazo), no por el dueño. */
  rechazada: boolean;
  motivoCancelacion: string | null;
  puedeCancelar: boolean;
}

export interface RegistroMedico {
  id: number;
  mascotaId: number;
  mascota: string;
  fecha: string; // "2026-10-12"
  tipo: TipoRegistro;
  descripcion: string;
  tratamiento: string | null;
  proximaDosis: string | null;
  centro: string | null;
}

export interface MedicamentoReceta {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
}

export interface Receta {
  id: number;
  mascotaId: number;
  mascota: string;
  fecha: string; // "2026-10-12"
  indicaciones: string | null;
  proximoControl: string | null;
  medicamentos: MedicamentoReceta[];
}

export interface Derivacion {
  id: number;
  mascotaId: number;
  mascota: string;
  fecha: string; // "2026-10-12"
  origen: string | null;
  destino: string | null;
  motivo: string;
  estado: EstadoDerivacion;
  resultado: string | null;
}

export interface DatosDueno {
  mascotas: Mascota[];
  citas: CitaDueno[];
  registros: RegistroMedico[];
  recetas: Receta[];
  derivaciones: Derivacion[];
}

export interface DatosDuenoContextValue extends DatosDueno {
  cargando: boolean;
  error: string | null;
  /** Vuelve a pedir todo a la base (después de guardar algo o al tirar hacia abajo). */
  recargar: () => Promise<void>;
  recargando: boolean;
}

export interface DatosDuenoProviderProps {
  children: ReactNode;
}

export interface HorarioCentro {
  diaSemana: number; // 1 = lunes ... 7 = domingo
  abre: string; // "09:00"
  cierra: string;
  inicioColacion: string | null;
  finColacion: string | null;
}

export interface CentroParaCita {
  id: number;
  nombre: string;
  comuna: string;
  direccion: string;
  esPrueba: boolean;
  horarios: HorarioCentro[];
}

export interface VeterinarioParaCita {
  id: number;
  nombre: string;
  especialidad: string | null;
}

export interface DatosSolicitudCita {
  mascotaId: number;
  centroId: number | null; // null = veterinario independiente
  veterinarioId: number | null;
  fechaHora: string; // ISO
  motivo: string;
  sintomas: string[];
}

export interface DatosMascota {
  nombre: string;
  especie: EspecieMascota;
  sexo: SexoMascota;
  raza: string;
  fechaNacimiento: string; // "DD-MM-AAAA" mientras se escribe
  pesoKg: string;
  esterilizado: boolean;
  alergias: string;
  condicionesCronicas: string;
  microchip: string;
}

export interface CambiosPerfil {
  nombre: string;
  telefono: string;
}

export interface DatosContacto {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
}

/** Lo que devuelve la función ficha_pdf de la base (migración 34). */
export interface FichaPdfCruda {
  mascota: {
    id: number;
    nombre: string;
    especie: string;
    raza: string | null;
    sexo: SexoMascota;
    fecha_nacimiento: string | null;
    peso_kg: number | null;
    esterilizado: boolean;
    microchip: string | null;
    alergias: string | null;
    condiciones_cronicas: string | null;
  };
  tutor: { nombre: string | null; telefono: number | null };
  historial: {
    id: number;
    fecha: string;
    tipo: TipoRegistro;
    descripcion: string;
    tratamiento: string | null;
    proxima_dosis: string | null;
    veterinario: string | null;
    centro: string | null;
  }[];
  recetas: {
    id: number;
    fecha: string;
    indicaciones: string | null;
    proximo_control: string | null;
    veterinario: string | null;
    colegiado: string | null;
    centro: string | null;
    medicamentos: MedicamentoReceta[];
  }[];
  derivaciones: {
    fecha: string;
    origen: string | null;
    destino: string | null;
    motivo: string;
    estado: EstadoDerivacion;
    resultado: string | null;
  }[];
}

// ─── Datos del veterinario ──────────────────────────────────────────────

export type EstadoVerificacion = 'pendiente' | 'aprobado' | 'rechazado';

export interface InfoVeterinario {
  id: number | null; // null = la cuenta no tiene ficha de veterinario
  estado: EstadoVerificacion | null;
  centros: string[];
}

export interface CitaVeterinario {
  id: number;
  mascotaId: number;
  mascota: string;
  especie: EspecieMascota | null;
  raza: string | null;
  fechaNacimiento: string | null;
  alergias: string | null;
  fotoUrl: string | null;
  dueno: string;
  fechaHora: string; // ISO
  motivo: string;
  sintomas: string[];
  estado: EstadoCita;
  centro: string | null;
}

export interface PacienteVeterinario {
  id: number;
  nombre: string;
  especie: EspecieMascota | null;
  raza: string | null;
  fotoUrl: string | null;
  dueno: string;
  ultimaVisita: string; // ISO
  totalVisitas: number;
  alergias: string | null;
}

export interface DerivacionRecibida {
  id: number;
  mascotaId: number;
  mascota: string;
  dueno: string;
  fecha: string; // "2026-10-12"
  origen: string | null;
  destino: string | null;
  motivo: string;
  estado: EstadoDerivacion;
  resultado: string | null;
  recibida: boolean; // false = la envié yo
}

export interface RegistroFicha {
  id: number;
  fecha: string;
  tipo: TipoRegistro;
  descripcion: string;
  tratamiento: string | null;
  proximaDosis: string | null;
  veterinario: string | null;
  centro: string | null;
}

export interface FichaPaciente {
  mascota: Mascota;
  dueno: string;
  telefonoDueno: number | null;
  historial: RegistroFicha[];
}

export interface DatosVeterinario {
  info: InfoVeterinario;
  citas: CitaVeterinario[];
  pacientes: PacienteVeterinario[];
  derivaciones: DerivacionRecibida[];
}

// ─── Datos del administrador de centro ──────────────────────────────────

export type EstadoSuscripcion = 'prueba' | 'activa' | 'vencida' | 'cancelada';

export interface CentroAdministrado {
  id: number;
  nombre: string;
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

export interface CitaCentro {
  id: number;
  mascota: string;
  dueno: string;
  veterinario: string | null; // null = sin asignar
  fechaHora: string; // ISO
  motivo: string;
  estado: EstadoCita;
}

export interface MiembroEquipo {
  clave: string;
  nombre: string;
  tipo: 'veterinario' | 'admin';
  detalle: string;
}

export interface Plan {
  id: string;
  nombre: string;
  precioMensual: number;
  limiteVeterinarios: number | null; // null = sin límite
}

export interface SuscripcionCentro {
  plan: Plan;
  estado: EstadoSuscripcion;
  inicio: string;
  finPrueba: string | null;
  renovacion: string | null;
  veterinarios: number;
  citasMes: number;
  planSolicitado: string | null;
}

export interface DatosCentro {
  detalle: CentroDetalle;
  citas: CitaCentro[];
  equipo: MiembroEquipo[];
  suscripcion: SuscripcionCentro | null;
  planes: Plan[];
}

export interface DatosEdicionCentro {
  nombre: string;
  direccion: string;
  comuna: string;
  telefono: string;
}

// ─── Datos del superadmin ───────────────────────────────────────────────

export type TipoSolicitud = 'centro' | 'veterinario' | 'solicitud_centro';
export type EstadoContacto = 'pendiente' | 'respondido' | 'cerrado';
export type EstadoSolicitudEliminacion = 'pendiente' | 'aprobada' | 'rechazada';

export interface ResumenSuperadmin {
  usuarios: number;
  centrosActivos: number;
  citasMes: number;
  veterinarios: number;
}

export interface SolicitudPendiente {
  clave: string; // "centro-3", "veterinario-5", "solicitud_centro-2" (igual que la web)
  tipo: TipoSolicitud;
  nombre: string;
  detalle: string | null;
  creadoEn: string; // ISO
}

export interface MensajeContacto {
  id: number;
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
  estado: EstadoContacto;
  creadoEn: string;
}

export interface SolicitudEliminacion {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  motivo: string | null;
  estado: EstadoSolicitudEliminacion;
  respuesta: string | null;
  creadaEn: string;
}

export interface SolicitudPlan {
  solicitudId: number;
  centro: string;
  comuna: string;
  planActual: string;
  planSolicitado: string;
  mensaje: string | null;
  solicitadoPor: string | null;
  solicitadoEn: string | null;
}

export interface DatosSuperadmin {
  resumen: ResumenSuperadmin;
  solicitudes: SolicitudPendiente[];
  mensajes: MensajeContacto[];
  eliminaciones: SolicitudEliminacion[];
  solicitudesPlan: SolicitudPlan[];
}

/** Lo que exponen los contextos de datos de cada rol (veterinario, centro, superadmin). */
export interface ContextoDatos<T> {
  datos: T | null;
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  recargando: boolean;
}

export interface ContextoCentro extends ContextoDatos<DatosCentro> {
  centros: CentroAdministrado[];
  centroId: number | null;
  elegirCentro: (id: number) => void;
  /** Veterinario que administra: true mientras está en el panel del centro. */
  modoCentro: boolean;
  cambiarModoCentro: (activo: boolean) => void;
}

export interface ProveedorProps {
  children: ReactNode;
}

// ─── Datos ya preparados para mostrar ───────────────────────────────────

export type EstadoRecordatorio = 'al_dia' | 'pronto' | 'vencido';

export type TonoTarjeta = 'menta' | 'durazno' | 'lavanda' | 'crema';

export type NombreIcono =
  | 'inicio'
  | 'citas'
  | 'historial'
  | 'perfil'
  | 'campana'
  | 'pastilla'
  | 'jeringa'
  | 'flecha'
  | 'mas'
  | 'huella'
  | 'escudo'
  | 'estetoscopio'
  | 'reloj'
  | 'ubicacion'
  | 'correo'
  | 'candado'
  | 'ojo'
  | 'ojoTachado'
  | 'persona'
  | 'telefono'
  | 'salir'
  | 'buscar'
  | 'cerrar'
  | 'atras'
  | 'chevronDerecha'
  | 'descarga'
  | 'ayuda'
  | 'etiqueta'
  | 'ficha'
  | 'check'
  | 'calendarioMas'
  | 'cancelar'
  | 'editar'
  | 'enviar'
  | 'peso'
  | 'equipo'
  | 'aprobaciones'
  | 'mensaje'
  | 'hoy'
  | 'resumen'
  | 'usuarioX'
  | 'plan'
  | 'alerta'
  | 'iniciar'
  | 'completar'
  | 'derivacion'
  | 'centro';

export interface Recordatorio {
  id: string;
  titulo: string;
  detalle: string;
  icono: NombreIcono;
  tono: TonoTarjeta;
  estado: EstadoRecordatorio;
}

/** Resumen de una mascota para el inicio, calculado con sus datos reales. */
export interface ResumenMascota {
  descripcion: string; // "Labrador · 4 años · 28 kg"
  fichaPorcentaje: number;
  fichaResumen: string; // "Ficha completa" o "Falta: microchip"
  proximaCita: CitaDueno | null;
  recordatorios: Recordatorio[];
}

export type FiltroCitas = 'proximas' | 'pasadas' | 'canceladas';
export type FiltroAgendaVeterinario = 'hoy' | 'proximas' | 'pendientes' | 'pasadas';
export type FiltroPacientes = 'todos' | 'alergias';
export type FiltroDerivaciones = 'pendientes' | 'recibidas' | 'enviadas';
export type FiltroAgendaCentro = 'hoy' | 'proximas' | 'sinAsignar' | 'pasadas';
export type FiltroAprobaciones = 'todas' | 'centro' | 'veterinario' | 'solicitud_centro';
export type FiltroMensajes = EstadoContacto;

export interface GrupoCitas {
  titulo: string;
  citas: CitaDueno[];
}

export type TipoItemHistorial = 'consulta' | 'vacuna' | 'receta' | 'derivacion';
export type FiltroHistorial = 'todo' | TipoItemHistorial;

export interface ItemHistorial {
  clave: string; // "registro-3", "receta-5"...
  tipo: TipoItemHistorial;
  mascotaId: number;
  mascota: string;
  fecha: string; // "2026-10-12", para ordenar y agrupar
  titulo: string;
  subtitulo: string | null;
  detalle: string | null;
  etiqueta: string | null;
  receta: Receta | null;
}

export interface GrupoHistorial {
  titulo: string; // "Octubre 2026"
  items: ItemHistorial[];
}

export interface OpcionesConfirmar {
  titulo: string;
  mensaje: string;
  textoSi: string;
  textoNo: string;
}

export interface PestanaNavegacion {
  nombreRuta: string;
  titulo: string;
  icono: NombreIcono;
}

export interface BarraNavegacionProps extends BottomTabBarProps {
  pestanas: PestanaNavegacion[];
}

export interface PestanasRolProps {
  pestanas: PestanaNavegacion[];
}

export interface DiaDisponible {
  fecha: string; // "2026-10-28"
  diaSemana: string; // "MIÉ"
  numero: string; // "28"
  mes: string; // "OCT"
}

// ─── Props de componentes ───────────────────────────────────────────────

export interface IconoProps {
  nombre: NombreIcono;
  tamano?: number;
  color?: string;
  grosor?: number;
}

export interface EncabezadoInicioProps {
  nombreUsuario: string;
  nombreCompleto: string;
  mascotas: Mascota[];
  mascota: Mascota;
  resumen: ResumenMascota;
  onSeleccionarMascota: (id: number) => void;
  onAgregarMascota: () => void;
  onIrAPerfil: () => void;
  onVerCita: () => void;
}

export interface EncabezadoSinMascotasProps {
  nombreUsuario: string;
  nombreCompleto: string;
  onIrAPerfil: () => void;
}

export interface OndaEncabezadoProps {
  ancho: number;
}

export interface FotoMascotaProps {
  mascota: Mascota;
  diametro: number;
}

export interface SelectorMascotasProps {
  mascotas: Mascota[];
  idSeleccionada: number;
  onSeleccionar: (id: number) => void;
  onAgregar: () => void;
}

export interface TarjetaProximaCitaProps {
  cita: CitaDueno | null;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export interface TarjetaFichaProps {
  nombreMascota: string;
  porcentaje: number;
  resumen: string;
  onPress: () => void;
}

export interface AnilloProgresoProps {
  porcentaje: number;
  tamano: number;
  grosor: number;
  color: string;
  colorFondo: string;
}

export interface TarjetaRecordatorioProps {
  recordatorio: Recordatorio;
  onPress?: (recordatorio: Recordatorio) => void;
}

export interface TarjetaSintomasProps {
  nombreMascota: string;
  onPress: () => void;
}

export interface BotonPedirHoraProps {
  onPress: () => void;
}

// ─── Citas ──────────────────────────────────────────────────────────────

export interface TarjetaCitaProps {
  cita: CitaDueno;
  fotoMascota: string | null;
  /** detallada: bloque de fecha grande y acciones (esta semana). compacta: el resto. */
  variante: 'detallada' | 'compacta';
  cancelando: boolean;
  onCancelar: (cita: CitaDueno) => void;
}

export interface BloqueFechaCitaProps {
  fechaHora: string;
}

export interface AccionesCitaProps {
  cita: CitaDueno;
  cancelando: boolean;
  onCancelar: (cita: CitaDueno) => void;
}

export interface ListaCitasProps {
  grupos: GrupoCitas[];
  fotoDe: (mascotaId: number) => string | null;
  cancelandoId: number | null;
  onCancelar: (cita: CitaDueno) => void;
}

// ─── Historial ──────────────────────────────────────────────────────────

export interface EstiloItemHistorial {
  icono: NombreIcono;
  tono: TonoTarjeta | null; // null = tarjeta blanca
  colorPunto: string;
}

export interface LineaDeTiempoProps {
  grupos: GrupoHistorial[];
  mostrarMascota: boolean;
}

export interface ItemLineaDeTiempoProps {
  item: ItemHistorial;
  mostrarMascota: boolean;
  ultimo: boolean;
}

export interface DetalleRecetaProps {
  receta: Receta;
}

// ─── Perfil ─────────────────────────────────────────────────────────────

export interface CabeceraPerfilProps {
  nombre: string;
  correo: string;
}

export interface GrillaMascotasProps {
  mascotas: Mascota[];
  onAbrir: (mascota: Mascota) => void;
  onAgregar: () => void;
}

export interface TarjetaMascotaPerfilProps {
  mascota: Mascota;
  tono: TonoTarjeta;
  ancho: number;
  onPress: () => void;
}

export interface TarjetaAgregarMascotaProps {
  ancho: number;
  onPress: () => void;
}

export interface MenuPerfilProps {
  onDatosPersonales: () => void;
  onAyuda: () => void;
  opcionesExtra?: ReactNode;
}

// ─── Pedir hora ─────────────────────────────────────────────────────────

/** Dónde atenderse: el id de un centro, 'independiente' o null si aún no elige. */
export type DestinoCita = number | 'independiente' | null;

export interface SelectorDestinoProps {
  centros: CentroParaCita[];
  destino: DestinoCita;
  onElegir: (destino: DestinoCita) => void;
}

export interface GrillaDiasProps {
  dias: DiaDisponible[];
  seleccionado: string | null;
  onElegir: (fecha: string) => void;
}

export interface GrillaHorasProps {
  horas: string[];
  seleccionada: string | null;
  onElegir: (hora: string) => void;
}

export interface ResultadoSolicitudProps {
  titulo: string;
  detalle: string;
  textoBoton: string;
  onPress: () => void;
}

// ─── Formularios de mascota y cuenta ────────────────────────────────────

export interface FormularioMascotaProps {
  datos: DatosMascota;
  onCambiar: <K extends keyof DatosMascota>(campo: K, valor: DatosMascota[K]) => void;
  errores: Partial<Record<keyof DatosMascota, string>>;
}

// ─── Veterinario ────────────────────────────────────────────────────────

export interface GrupoPorDia<T> {
  titulo: string;
  items: T[];
}

export interface AccionesCitaVeterinarioProps {
  cita: CitaVeterinario;
  ocupado: boolean;
  onConfirmar: (cita: CitaVeterinario) => void;
  onRechazar: (cita: CitaVeterinario) => void;
  onIniciar: (cita: CitaVeterinario) => void;
  onTerminar: (cita: CitaVeterinario) => void;
}

export interface TarjetaSiguientePacienteProps {
  cita: CitaVeterinario;
  ocupado: boolean;
  onVerFicha: () => void;
  onIniciar: () => void;
  onTerminar: () => void;
}

export interface AgendaDelDiaProps {
  citas: CitaVeterinario[];
  onAbrir: (cita: CitaVeterinario) => void;
}

export interface TarjetaPacienteProps {
  paciente: PacienteVeterinario;
  onPress: () => void;
}

export interface DatoFichaProps {
  etiqueta: string;
  valor: string;
}

export interface TarjetaDerivacionProps {
  derivacion: DerivacionRecibida;
  ocupado: boolean;
  onRealizada: (d: DerivacionRecibida) => void;
  onRechazar: (d: DerivacionRecibida) => void;
}

// ─── Administrador de centro ────────────────────────────────────────────

export interface IndicadorPastelProps {
  tono: TonoTarjeta;
  etiqueta: string;
  valor: string | number;
  /** Texto chico bajo el número: "veterinarios". */
  detalle?: string;
  onPress?: () => void;
}

export interface TarjetaCitasSemanaProps {
  citasHoy: number;
  porDia: number[]; // lunes a domingo
  indiceHoy: number;
}

export interface TarjetaSuscripcionProps {
  suscripcion: SuscripcionCentro | null;
  /** Sin esto no se muestra el enlace "Ver planes" (por ejemplo, en la misma pantalla de planes). */
  onVerPlanes?: () => void;
}

export interface ListaAhoraCentroProps {
  citas: CitaCentro[];
}

export interface TarjetaHorarioHoyProps {
  texto: string;
}

export interface FilaMiembroProps {
  miembro: MiembroEquipo;
  ultima: boolean;
}

export interface TablaHorariosProps {
  horarios: HorarioCentro[];
}

export interface TarjetaPlanProps {
  plan: Plan;
  esActual: boolean;
  esSolicitado: boolean;
  puedeSolicitar: boolean;
  onSolicitar: (plan: Plan) => void;
}

// ─── Superadmin ─────────────────────────────────────────────────────────

export interface TarjetaSolicitudProps {
  solicitud: SolicitudPendiente;
  ocupado: boolean;
  onAprobar: (s: SolicitudPendiente) => void;
  onRechazar: (s: SolicitudPendiente) => void;
}

export interface TarjetaMensajeProps {
  mensaje: MensajeContacto;
  ocupado: boolean;
  onResponder: (m: MensajeContacto) => void;
  onCambiarEstado: (m: MensajeContacto, estado: EstadoContacto) => void;
}

export interface TarjetaEliminacionProps {
  solicitud: SolicitudEliminacion;
  ocupado: boolean;
  onAprobar: (s: SolicitudEliminacion) => void;
  onRechazar: (s: SolicitudEliminacion) => void;
}

export interface TarjetaSolicitudPlanProps {
  solicitud: SolicitudPlan;
  ocupado: boolean;
  onActivar: (s: SolicitudPlan) => void;
  onRechazar: (s: SolicitudPlan) => void;
}

// ─── Login ──────────────────────────────────────────────────────────────

export interface EncabezadoLoginProps {
  /** Alto de la zona verde, sin contar la barra de estado. */
  alto: number;
}

export interface CampoTextoProps extends Omit<TextInputProps, 'style'> {
  etiqueta: string;
  icono: NombreIcono;
  /** Borde rojo y mensaje debajo del campo. */
  error?: string;
  /** Texto gris debajo del campo cuando no hay error. */
  ayuda?: string;
  /** Botón o ícono a la derecha (por ejemplo, el ojo de la contraseña). */
  accesorioDerecho?: ReactNode;
}

export interface CampoPasswordProps extends Omit<CampoTextoProps, 'icono' | 'secureTextEntry' | 'accesorioDerecho'> {
  visible: boolean;
  onCambiarVisible: () => void;
  /** Impide copiar y pegar (la confirmación se escribe a mano, como en la web). */
  bloquearPegar?: boolean;
}

export interface BotonPrincipalProps {
  texto: string;
  textoCargando?: string;
  cargando?: boolean;
  deshabilitado?: boolean;
  onPress: () => void;
}

export interface BotonSecundarioProps {
  texto: string;
  icono?: NombreIcono;
  onPress: () => void;
}

export interface MensajeFormularioProps {
  tipo: 'error' | 'aviso';
  texto: string;
}

export interface EnlaceTextoProps {
  texto: string;
  onPress: () => void;
  alineacion?: 'izquierda' | 'centro' | 'derecha';
}

export interface FormularioLogin {
  nombre: string;
  email: string;
  password: string;
  confirmacion: string;
  telefono: string;
}

export interface FormularioIngresarProps {
  formulario: FormularioLogin;
  onCambiar: (campo: keyof FormularioLogin, valor: string) => void;
  mostrarPassword: boolean;
  onCambiarMostrarPassword: () => void;
  enviando: boolean;
  error: string;
  aviso: string;
  onIngresar: () => void;
  onOlvidePassword: () => void;
}

export interface FormularioCrearCuentaProps {
  formulario: FormularioLogin;
  onCambiar: (campo: keyof FormularioLogin, valor: string) => void;
  mostrarPassword: boolean;
  onCambiarMostrarPassword: () => void;
  enviando: boolean;
  error: string;
  onCrear: () => void;
}

export interface FormularioRecuperarProps {
  email: string;
  onCambiarEmail: (valor: string) => void;
  enviando: boolean;
  error: string;
  aviso: string;
  onEnviar: () => void;
  onVolver: () => void;
}

export interface PieLoginProps {
  modo: ModoLogin;
  onCambiarModo: (modo: ModoLogin) => void;
  onSolicitarCentro: () => void;
}

export interface TituloLoginProps {
  titulo: string;
  subtitulo: string;
}

// ─── Componentes reutilizables (components/ui) ──────────────────────────

export interface PosicionDecorativa {
  top: DimensionValue;
  left?: DimensionValue;
  right?: DimensionValue;
  tamano: number;
  rotacion: number;
  /** Si no se indica, usa el color que recibe HuellasDecorativas. */
  color?: string;
}

export interface HuellasDecorativasProps {
  huellas: PosicionDecorativa[];
  color: string;
}

export interface EncabezadoVerdeProps {
  children: ReactNode;
  huellas: PosicionDecorativa[];
  style?: StyleProp<ViewStyle>;
}

export interface CirculoIconoProps {
  icono: NombreIcono;
  tamano: number;
  colorIcono: string;
  colorFondo: string;
  /** Por defecto, un poco menos de la mitad del círculo. */
  tamanoIcono?: number;
  grosor?: number;
}

export interface EtiquetaProps {
  texto: string;
  colorFondo: string;
  colorTexto: string;
  icono?: NombreIcono;
  /** Punto de color antes del texto (para estados). */
  conPunto?: boolean;
}

export interface TarjetaPastelProps {
  tono: TonoTarjeta;
  children: ReactNode;
  /** Si se pasa, la tarjeta se puede presionar. */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export interface OpcionPildora<V extends string> {
  valor: V;
  texto: string;
  /** Número a la derecha del texto (por ejemplo, cuántos hay en ese filtro). */
  cantidad?: number;
}

export interface SelectorPildorasProps<V extends string> {
  opciones: OpcionPildora<V>[];
  seleccionado: V;
  onSeleccionar: (valor: V) => void;
  /** sobrePrimario: encima del verde (inicio). claro: sobre fondo claro (filtros). */
  variante?: 'sobrePrimario' | 'claro';
  /** Algo extra al final de la fila, como el botón "+". */
  accesorioFinal?: ReactNode;
}

export interface EncabezadoPaginaProps {
  titulo: string;
  /** Línea chica bajo el título (fecha, centro, rol). */
  subtitulo?: string;
  /** Muestra la flecha para volver (pantallas que no son pestañas). */
  onVolver?: () => void;
  /** Botón a la derecha del título (por ejemplo, "+" o "Ficha PDF"). */
  accion?: ReactNode;
  /** Contenido debajo del título, dentro del verde (por ejemplo, el selector de mascotas). */
  children?: ReactNode;
  /** Título centrado y más espacio abajo (Perfil, para el avatar). */
  centrado?: boolean;
}

export interface BotonIconoProps {
  icono: NombreIcono;
  etiqueta: string; // para lectores de pantalla
  onPress: () => void;
  variante?: 'blanco' | 'translucido';
  tamano?: number;
}

export interface BotonPequenoProps {
  texto: string;
  onPress: () => void;
  icono?: NombreIcono;
  variante?: 'blanco' | 'peligro' | 'sobrePrimario' | 'primario';
  cargando?: boolean;
  deshabilitado?: boolean;
}

export interface EstadoVacioProps {
  icono: NombreIcono;
  titulo: string;
  detalle?: string;
  textoAccion?: string;
  onAccion?: () => void;
}

export interface EstadoCargaProps {
  texto?: string;
}

export interface PantallaListaProps {
  encabezado: ReactNode;
  children: ReactNode;
  recargando?: boolean;
  onRecargar?: () => void;
}

export interface PantallaFormularioProps {
  titulo: string;
  children: ReactNode;
  /** Se muestra fijo abajo (por ejemplo, el botón Guardar). */
  pie?: ReactNode;
}

export interface TituloSeccionProps {
  texto: string;
  accion?: ReactNode;
}

export interface FilaOpcionProps {
  icono: NombreIcono;
  tono: TonoTarjeta;
  texto: string;
  valor?: string;
  onPress: () => void;
  ultima?: boolean;
}

export interface AvatarInicialesProps {
  nombre: string;
  tamano: number;
}

export interface AvatarMascotaProps {
  nombre: string;
  fotoUrl: string | null;
  tamano: number;
  tono?: TonoTarjeta;
}

export interface ChipsMultiplesProps {
  opciones: readonly string[];
  seleccionadas: string[];
  onAlternar: (opcion: string) => void;
}

export interface TarjetaOpcionProps {
  icono: NombreIcono;
  titulo: string;
  detalle?: string;
  seleccionada: boolean;
  onPress: () => void;
}

export interface GrupoCampoProps {
  titulo: string;
  ayuda?: string;
  children: ReactNode;
}

export interface FilaInterruptorProps {
  texto: string;
  valor: boolean;
  onCambiar: (valor: boolean) => void;
}

export interface IndicadorNumeroProps {
  etiqueta: string;
  valor: string | number;
  icono?: NombreIcono;
  colorValor?: string;
  /** 0 a 1: muestra una barra de progreso debajo del número. */
  progreso?: number;
}

export interface BarraProgresoProps {
  progreso: number; // 0 a 1
  color?: string;
}

export interface MiniGraficoBarrasProps {
  valores: number[];
  etiquetas: string[];
  indiceDestacado?: number;
  alto?: number;
}

export interface TarjetaAccionProps {
  icono: NombreIcono;
  tono: TonoTarjeta;
  titulo: string;
  detalle?: string;
  cantidad?: number;
  onPress: () => void;
}

export interface ModalTextoProps {
  visible: boolean;
  titulo: string;
  detalle?: string;
  placeholder: string;
  textoConfirmar: string;
  /** Si es true, no deja confirmar con el texto vacío. */
  obligatorio?: boolean;
  peligro?: boolean;
  cargando?: boolean;
  error?: string;
  onConfirmar: (texto: string) => void;
  onCerrar: () => void;
}

export interface TarjetaCitaGestionProps {
  mascota: string;
  fotoMascota?: string | null;
  descripcionMascota?: string | null;
  dueno: string;
  fechaHora: string;
  /** Muestra solo la hora (agenda de un día) o fecha y hora. */
  soloHora?: boolean;
  motivo: string;
  estado: EstadoCita;
  sintomas?: string[];
  /** Línea extra (por ejemplo, el veterinario asignado en el centro). */
  extra?: string | null;
  alerta?: string | null;
  tono?: TonoTarjeta | null;
  acciones?: ReactNode;
  onPress?: () => void;
}

export interface PerfilCuentaProps {
  /** Contenido propio de cada rol, entre el nombre y el menú (por ejemplo, las mascotas del dueño). */
  children?: ReactNode;
  /** Filas extra del menú (por ejemplo, "Administrar mi centro"). */
  opcionesExtra?: ReactNode;
  rolTexto?: string;
}

// ─── Filtros (igual que useFiltro de la web) ────────────────────────────

export interface OpcionesFiltro<T, F extends string> {
  items: T[];
  camposBusqueda: (item: T) => (string | null | undefined)[]; // textos donde busca el buscador
  filtros: Record<F, (item: T) => boolean>; // qué deja pasar cada chip
  filtroInicial: F;
}

export interface CampoBusquedaProps {
  valor: string;
  onCambiar: (texto: string) => void;
  placeholder: string;
}

export interface BarraFiltrosProps<F extends string> {
  busqueda: string;
  onBuscar: (texto: string) => void;
  placeholder: string;
  opciones: OpcionPildora<F>[];
  filtro: F;
  onFiltrar: (filtro: F) => void;
}
