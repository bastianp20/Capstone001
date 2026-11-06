import type { BottomTabBarProps } from 'expo-router/js-tabs';
import type { ComponentRef, ReactNode } from 'react';

import type { Paleta, TonosTarjeta } from '@/constants/constants';

export type { Paleta, TonosTarjeta };
import type { DimensionValue, ImageStyle, StyleProp, TextInputProps, View, ViewStyle } from 'react-native';

// ─── Sesión (igual que en la web) ───────────────────────────────────────

export type RolCuenta = 'dueno' | 'veterinario' | 'superadmin' | 'administrativo';

export type ModoLogin = 'ingresar' | 'crear' | 'recuperar';

export interface UsuarioActual {
  id: string;
  email: string;
  nombre: string;
  rol: RolCuenta;
  telefono: number | null;
  avatarUrl: string | null; // URL pública de la foto (o null)
  avatarRuta: string | null; // ruta en el bucket "avatares" (para reemplazarla o quitarla)
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
  centroId: number | null;
  reagendada: boolean; // el veterinario le cambió la hora (migración 52)
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
  especialidadIds: number[];
  horarios: HorarioCentro[];
  tieneUci: boolean;
  urgencias247: boolean;
  urgenciasRevisadas: boolean;
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

export type TipoSolicitud = 'centro' | 'veterinario' | 'solicitud_centro' | 'refugio';
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
  /** Refugio que postuló sin cuenta: al aprobar se invita a este correo (edge function "aprobar-refugio"). */
  invitarA?: string | null;
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
  moderacion: ResumenModeracion;
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
  | 'centro'
  | 'camara'
  | 'imagen'
  | 'papelera'
  | 'relojArena'
  | 'corazon'
  | 'gota'
  | 'tijeras'
  | 'hueso'
  | 'flechaDerecha'
  | 'nubeTachada'
  | 'compartir'
  | 'balanza'
  | 'perro'
  | 'gato'
  | 'filtro'
  | 'bandera'
  | 'casa'
  | 'chispas'
  | 'chat'
  | 'flechaArriba'
  | 'gatoMalvado'
  | 'sol'
  | 'celular';

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
export type FiltroAprobaciones = 'todas' | 'centro' | 'veterinario' | 'solicitud_centro' | 'refugio';
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
  /** Pinta el interior con el mismo color (por ejemplo, el corazón de "Guardado"). */
  relleno?: boolean;
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
  fotoUrl: string | null;
  onCambiarFoto: () => void;
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
  /** Sin esto no aparece "Eliminar mi cuenta" (el superadmin no se elimina desde aquí). */
  onEliminarCuenta?: () => void;
  /** "Adopción" (los roles que no tienen la pestaña Adopta). */
  onAdopcion?: () => void;
  onMisPublicaciones: () => void;
  /** Refugios que administra la cuenta: una fila "Mi refugio" por cada uno. */
  misRefugios?: OpcionRefugio[];
  onMiRefugio?: (id: number) => void;
}

// ─── Pedir hora ─────────────────────────────────────────────────────────

/** Dónde atenderse: el id de un centro, 'independiente' o null si aún no elige. */
export type DestinoCita = number | 'independiente' | null;

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
  onAbrirAtencion: (cita: CitaVeterinario) => void;
  /** Reagendar o cancelar (solo citas confirmadas que aún no pasan). */
  onModificar?: () => void;
}

export interface TarjetaSiguientePacienteProps {
  cita: CitaVeterinario;
  ocupado: boolean;
  onVerFicha: () => void;
  onIniciar: () => void;
  onAbrirAtencion: () => void;
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
  /** 'coral' para el llamado principal de un paso (Continuar); 'peligro' para eliminar. */
  tono?: 'primario' | 'coral' | 'peligro';
  /** Flecha a la derecha del texto (pasos que siguen). */
  conFlecha?: boolean;
}

export interface BotonSecundarioProps {
  texto: string;
  icono?: NombreIcono;
  onPress: () => void;
  /** 'verde': borde y texto verdes (por ejemplo, "Cancelar solicitud"). */
  tono?: 'neutro' | 'verde';
  cargando?: boolean;
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
  variante?: 'blanco' | 'peligro' | 'sobrePrimario' | 'primario' | 'coral';
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
  /** Qué hace la flecha de volver (por defecto, volver a la pantalla anterior; en un formulario por pasos, el paso anterior). */
  onVolver?: () => void;
  subtitulo?: string;
  /** A la derecha del título (por ejemplo, "En consulta · 18 min"). */
  accion?: ReactNode;
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
  /** Mensaje rojo debajo (reemplaza a la ayuda). */
  error?: string;
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

// =====================================================================
// Fase 1 de la app (29-10-2026): pedir hora por pasos, foto de perfil,
// eliminar la cuenta (migración 49)
// =====================================================================

// ---------- Personas con foto ----------
export interface PersonaConFoto {
  nombre: string;
  fotoUrl: string | null;
}

export interface AvatarPersonaProps extends PersonaConFoto {
  tamano: number;
  /** Borde blanco (sobre fondos de color o cuando se superponen). */
  conBorde?: boolean;
}

export interface FilaAvataresProps {
  personas: PersonaConFoto[];
  tamano?: number;
  maximo?: number;
}

// ---------- Pedir hora ----------
export interface EspecialidadOpcion {
  id: number;
  nombre: string;
}

/** Un veterinario que se puede agendar, en un centro o independiente (profesionales_para_cita). */
export interface ProfesionalParaCita {
  veterinarioId: number;
  nombre: string;
  centroId: number | null; // null = independiente
  especialidadIds: number[];
  especialidades: string | null; // "Cirugía, Dermatología"
  fotoUrl: string | null;
}

export type ModoDestinoCita = 'centros' | 'independientes';
export type PasoPedirHora = 0 | 1 | 2;

/** Una tarjeta de "¿Dónde?": un centro, o un veterinario independiente. */
export interface OpcionDestinoCita {
  clave: string;
  destino: Exclude<DestinoCita, null>;
  veterinarioId: number | null; // independiente: ya queda elegido
  titulo: string;
  detalle: string;
  logo: PersonaConFoto; // centro → iniciales; independiente → su foto
  personas: PersonaConFoto[]; // los veterinarios del centro que cumplen
  chips: string[];
}

export interface IndicadorPasosProps {
  pasos: readonly string[];
  actual: number;
}

export interface ChipIconoProps {
  texto: string;
  icono: NombreIcono;
  activo: boolean;
  onPress: () => void;
}

export interface FiltroEspecialidadesProps {
  especialidades: EspecialidadOpcion[];
  seleccion: number[];
  onAlternar: (id: number) => void;
  onQuitar: () => void;
  /** Por defecto, los textos de "Pedir hora" ("¿Qué necesita tu mascota?"). */
  titulo?: string;
  ayuda?: string;
}

export interface ControlSegmentadoProps<V extends string> {
  opciones: readonly { valor: V; texto: string }[];
  valor: V;
  onCambiar: (valor: V) => void;
}

export interface TarjetaDestinoCitaProps {
  opcion: OpcionDestinoCita;
  seleccionada: boolean;
  onPress: () => void;
}

export interface MiniMascotaCitaProps {
  mascota: Mascota;
  onCambiar: () => void;
}

export interface PasoMascotaCitaProps {
  mascotas: Mascota[];
  mascotaId: number | null;
  onMascota: (id: number) => void;
  motivo: string;
  onMotivo: (texto: string) => void;
  sintomas: string[];
  onSintoma: (sintoma: string) => void;
}

export interface PasoDondeCitaProps {
  mascota: Mascota | null;
  onCambiarMascota: () => void;
  filtro: FiltroEspecialidadesProps;
  modo: ModoDestinoCita;
  onModo: (modo: ModoDestinoCita) => void;
  opciones: OpcionDestinoCita[];
  elegida: string | null; // clave de la opción
  onElegir: (opcion: OpcionDestinoCita) => void;
  resumen: string;
  cargando: boolean;
  error: boolean;
  onReintentar: () => void;
}

export interface PasoDiaHoraCitaProps {
  lugar: string;
  opcionesVeterinario: { valor: string; texto: string }[];
  veterinario: string;
  onVeterinario: (valor: string) => void;
  ayudaVeterinario?: string;
  dias: DiaDisponible[];
  fecha: string | null;
  onFecha: (fecha: string) => void;
  ayudaDia?: string;
  horas: string[];
  hora: string | null;
  onHora: (hora: string) => void;
}

// ---------- Foto de perfil ----------
export interface HojaInferiorProps {
  visible: boolean;
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
}

export interface OpcionHojaProps {
  icono: NombreIcono;
  texto: string;
  tono: TonoTarjeta | 'peligro';
  onPress: () => void;
  deshabilitada?: boolean;
}

export interface HojaFotoPerfilProps {
  visible: boolean;
  nombre: string;
  fotoUrl: string | null;
  ocupado: boolean;
  error: string;
  onTomar: () => void;
  onElegir: () => void;
  onQuitar: () => void;
  onCerrar: () => void;
}

// ---------- Eliminar la cuenta ----------
export interface SolicitudEliminacionPropia {
  estado: EstadoSolicitudEliminacion;
  creadaEn: string;
  respuesta: string | null;
}

export interface ItemConIcono {
  icono: NombreIcono;
  texto: string;
}

export interface TarjetaListaIconosProps {
  titulo: string;
  items: readonly ItemConIcono[];
}

export interface TarjetaAvisoProps {
  texto: string;
  titulo?: string;
  icono?: NombreIcono;
}

export interface CasillaProps {
  texto: string;
  marcada: boolean;
  onCambiar: (marcada: boolean) => void;
}

export type EstadoPasoLinea = 'hecho' | 'actual' | 'pendiente';

export interface PasoLinea {
  texto: string;
  estado: EstadoPasoLinea;
}

export interface LineaEstadosProps {
  pasos: PasoLinea[];
}

export interface FormularioEliminarCuentaProps {
  motivos: string[];
  onMotivo: (motivo: string) => void;
  comentario: string;
  onComentario: (texto: string) => void;
  entiende: boolean;
  onEntiende: (valor: boolean) => void;
  rechazoAnterior: string | null;
}

export interface SolicitudEliminacionEnviadaProps {
  correo: string;
  creadaEn: string;
}

// =====================================================================
// Fase 2 de la app (01-11-2026): el veterinario atiende desde el celular
// (registro, receta, derivación, mis especialidades; migración 50)
// =====================================================================

// ---------- Borradores (se guardan en el teléfono hasta enviarlos) ----------
export interface DatosRegistroAtencion {
  tipo: TipoRegistro;
  fecha: string; // "29-10-2026" (como se escribe)
  descripcion: string;
  tratamiento: string;
  proximaDosis: string; // "dd-mm-aaaa" o vacío (solo vacunas)
  pesoKg: number | null; // null = no cambia
}

export interface DatosRecetaAtencion {
  medicamentos: MedicamentoReceta[];
  indicaciones: string;
  proximoControl: string; // "dd-mm-aaaa" o vacío
}

export interface DatosDerivacionAtencion {
  destino: string | null; // clave "veterinario-12" / "centro-3"
  motivo: string;
}

/** Lo que va hecho en la atención de una cita (se muestra en las tarjetas). */
export interface ProgresoAtencion {
  inicio: string; // ISO: cuándo se abrió la atención en el teléfono
  registro: boolean;
  medicamentos: number; // de la receta enviada
  derivada: boolean;
}

// ---------- Datos ----------
export type TipoDestinoDerivacion = 'veterinario' | 'centro';

export interface DestinoDerivacion {
  clave: string;
  tipo: TipoDestinoDerivacion;
  id: number;
  nombre: string;
  detalle: string; // especialidades (veterinario) o comuna (centro)
  especialidadIds: number[];
  fotoUrl: string | null;
  lugar: string | null; // centros donde atiende; null = independiente
}

export interface NuevoRegistroAtencion {
  citaId: number;
  mascotaId: number;
  tipo: TipoRegistro;
  fecha: string; // "2026-10-29"
  descripcion: string;
  tratamiento: string;
  proximaDosis: string | null;
}

export interface NuevaRecetaAtencion {
  citaId: number;
  mascotaId: number;
  medicamentos: MedicamentoReceta[];
  indicaciones: string;
  proximoControl: string | null; // "2026-11-12"
}

export interface MisEspecialidades {
  ids: number[];
  otra: string;
}

export type CanalReceta = 'whatsapp' | 'correo' | 'guardar';

// ---------- Props ----------
export interface TarjetaPacienteAtencionProps {
  nombre: string;
  descripcion: string;
  dueno: string;
  fotoUrl: string | null;
  alergias: string | null;
}

export interface MotivoConsultaProps {
  motivo: string;
  sintomas: string[];
}

export interface TarjetaAccionAtencionProps {
  icono: NombreIcono;
  tono: TonoTarjeta;
  titulo: string;
  detalle: string;
  hecho?: boolean;
  onPress: () => void;
}

export interface PildoraEnConsultaProps {
  minutos: number;
}

export interface AvisoSinConexionProps {
  visible: boolean;
  reintentando: boolean;
  onReintentar: () => void;
}

export interface EstadoBorradorProps {
  guardadoEn: string | null; // ISO
}

export interface ContadorPesoProps {
  valor: number | null;
  onCambiar: (valor: number) => void;
}

export interface TarjetaMedicamentoProps {
  medicamento: MedicamentoReceta;
  onEditar: () => void;
  onQuitar: () => void;
}

export interface HojaMedicamentoProps {
  visible: boolean;
  inicial: MedicamentoReceta | null;
  onGuardar: (medicamento: MedicamentoReceta) => void;
  onCerrar: () => void;
}

export interface BotonAgregarProps {
  texto: string;
  onPress: () => void;
}

export interface RecetaListaProps {
  mascota: string;
  dueno: string;
  ocupado: boolean;
  error: string;
  onCompartir: (canal: CanalReceta) => void;
  onVolver: () => void;
}

export interface BotonCanalProps {
  canal: CanalReceta;
  onPress: () => void;
  deshabilitado?: boolean;
}

export interface TarjetaDestinoDerivacionProps {
  destino: DestinoDerivacion;
  seleccionado: boolean;
  onPress: () => void;
}

export interface TarjetaEspecialidadProps {
  nombre: string;
  icono: NombreIcono;
  tono: TonoTarjeta;
  marcada: boolean;
  onPress: () => void;
}

// ─── Adopción (Fase 3, igual que /adopta en la web) ─────────────────────

export type EspecieAdopcion = 'perro' | 'gato' | 'otro';
export type FiltroEspecieAdopcion = 'todos' | EspecieAdopcion;
export type SexoAdopcion = 'macho' | 'hembra';
export type TamanoAdopcion = 'pequeno' | 'mediano' | 'grande';
export type EtapaAdopcion = 'cachorro' | 'adulto' | 'senior';
export type RasgoAdopcion = 'energia' | 'sociablePerros' | 'sociableGatos' | 'sociableNinos';
export type RasgosAdopcion = Record<RasgoAdopcion, number | null>;
export type VistaAdopta = 'animales' | 'refugios';

export interface ChequeoAdopcion {
  veterinario: string;
  centro: string | null;
  /** "AAAA-MM-DD" */
  fecha: string;
  resumen: string;
  solidario: boolean;
}

export interface AnimalAdopcion {
  id: number;
  nombre: string;
  especie: EspecieAdopcion;
  raza: string;
  sexo: SexoAdopcion;
  tamano: TamanoAdopcion;
  edad: string;
  etapa: EtapaAdopcion;
  comuna: string;
  personalidad: string[];
  frase: string | null;
  chequeo: ChequeoAdopcion | null;
  enProceso: boolean;
  fotoUrl: string | null;
  refugioId: number | null;
  refugio: string | null;
}

export interface PublicadorAdopcion {
  nombre: string;
  /** centro · veterinario · equipo · refugio · particular (lo decide la base) */
  tipo: string;
  adopciones: number;
}

export interface FichaAdopcion extends AnimalAdopcion {
  historia: string | null;
  fotos: string[];
  rasgos: RasgosAdopcion;
  vacunasAlDia: boolean;
  esterilizado: boolean;
  conMicrochip: boolean;
  pesoKg: number | null;
  alergias: string | null;
  solicitaChequeo: boolean;
  adoptado: boolean;
  publicador: PublicadorAdopcion;
  esMia: boolean;
  yaPostule: boolean;
}

export interface ResumenAdopciones {
  esperando: number;
  revisados: number;
  conFamilia: number;
}

export type EstadoBotonAdoptar = 'disponible' | 'mia' | 'postulado' | 'en_proceso' | 'adoptado';

export interface FiltrosAdopcion {
  especie: FiltroEspecieAdopcion;
  soloRevisados: boolean;
  soloGuardados: boolean;
  tamano: TamanoAdopcion | null;
  etapa: EtapaAdopcion | null;
  sexo: SexoAdopcion | null;
  comuna: string | null;
  /** "Ver sus animales" desde un refugio */
  refugioId: number | null;
}

/** Filtros de la hoja "Más filtros" (los demás están a la vista). */
export type FiltroHojaAdopcion = 'soloRevisados' | 'soloGuardados' | 'tamano' | 'etapa' | 'sexo' | 'comuna';

export interface OpcionConIcono<V extends string> {
  valor: V;
  texto: string;
  icono?: NombreIcono;
}

// Postular ("Quiero adoptarlo")
export type ViviendaAdopcion = 'casa' | 'departamento' | 'parcela';
export type TenenciaAdopcion = 'propia' | 'arrendada' | 'familiar';
export type PasoPostulacion = 0 | 1 | 2 | 3;

export interface DatosPostulacionAdopcion {
  vivienda: ViviendaAdopcion | null;
  tienePatio: boolean | null;
  tenencia: TenenciaAdopcion | null;
  permitenMascotas: boolean | null;
  hayNinos: boolean | null;
  edadesNinos: string;
  otrasMascotas: boolean | null;
  cualesMascotas: string;
  todosDeAcuerdo: boolean | null;
  experiencia: string;
  motivo: string;
  aceptaCompromiso: boolean;
}
export type CampoPostulacion = keyof DatosPostulacionAdopcion;
export type ErroresDe<C extends string> = Partial<Record<C, string>>;

// Reportar
export type MotivoReporte = 'dinero' | 'estafa' | 'riesgo' | 'inapropiado' | 'adoptado' | 'otro';
export interface OpcionMotivoReporte {
  valor: MotivoReporte;
  texto: string;
  icono: NombreIcono;
  color: string;
  fondo: string;
}

// Dar en adopción
export interface FotoNuevaAdopcion {
  uri: string;
  tipo: string;
}
export type PasoPublicar = 0 | 1 | 2 | 3;

export interface DatosPublicarAdopcion {
  fotos: FotoNuevaAdopcion[];
  nombre: string;
  especie: EspecieMascota | null;
  sexo: SexoAdopcion | null;
  anios: string;
  meses: string;
  tamano: TamanoAdopcion | null;
  comuna: string;
  solicitaChequeo: boolean;
  personalidad: string[];
  rasgos: RasgosAdopcion;
  frase: string;
  raza: string;
  pesoKg: string;
  vacunasAlDia: boolean;
  esterilizado: boolean;
  conMicrochip: boolean;
  alergias: string;
  historia: string;
  /** null = a mi nombre */
  refugioId: number | null;
}
export type CampoPublicar = keyof DatosPublicarAdopcion;

export interface OpcionRefugio {
  id: number;
  nombre: string;
}

// Mis publicaciones
export type EstadoPublicacion = 'publicada' | 'en_proceso' | 'adoptada' | 'retirada';
export type FiltroPublicaciones = 'activos' | 'en_proceso' | 'adoptados' | 'retirados';
export type HitoCaminoCasa = 'publicada' | 'revisada' | 'postulaciones' | 'elegida' | 'adoptada';

export interface AvisoModeracion {
  tipo: 'oculta' | 'advertencia';
  mensaje: string | null;
}

export interface PublicacionPropia {
  id: number;
  nombre: string;
  especie: EspecieAdopcion;
  raza: string;
  edad: string;
  comuna: string;
  fotoUrl: string | null;
  estado: EstadoPublicacion;
  creadaEn: string;
  revisadaPor: string | null;
  postulaciones: number;
  nuevas: number;
  elegido: string | null;
  refugio: string | null;
  moderacion: AvisoModeracion | null;
}

export type EstadoPostulacion = 'pendiente' | 'aceptada' | 'rechazada' | 'retirada';

export interface PostulacionRecibida {
  id: number;
  nombre: string;
  correo: string | null;
  telefono: number | null;
  vivienda: ViviendaAdopcion;
  tienePatio: boolean;
  tenencia: TenenciaAdopcion;
  permitenMascotas: boolean | null;
  hayNinos: boolean;
  edadesNinos: string | null;
  otrasMascotas: boolean;
  cualesMascotas: string | null;
  todosDeAcuerdo: boolean;
  experiencia: string | null;
  motivo: string;
  estado: EstadoPostulacion;
  creadaEn: string;
}

export interface RazonAfinidad {
  tipo: 'ok' | 'alerta';
  texto: string;
}

export interface AfinidadPostulacion {
  porcentaje: number;
  razones: RazonAfinidad[];
}

export interface PostulanteConAfinidad {
  postulacion: PostulacionRecibida;
  afinidad: AfinidadPostulacion;
}

// Refugios
export type RecepcionRefugio = 'abierto' | 'limitado' | 'sin_cupos';
export type FiltroRefugios = 'todos' | 'abiertos' | 'perros' | 'gatos';

export interface Refugio {
  id: number;
  nombre: string;
  comuna: string;
  region: string;
  descripcion: string | null;
  logoUrl: string | null;
  portadaUrl: string | null;
  telefono: number | null;
  correo: string | null;
  cuposTotales: number;
  cuposOcupados: number;
  recibe: RecepcionRefugio;
  especies: string[];
  enAdopcion: number;
}

export interface ResumenRefugios {
  refugios: number;
  animales: number;
  aliados: number;
}

/** A quién contactar desde una hoja (refugio o postulante). */
export interface ContactoPersona {
  nombre: string;
  telefono: number | null;
  correo: string | null;
  mensajeWhatsapp: string;
  asuntoCorreo: string;
}

// ─── Props de adopción ───

export interface ChipsOpcionProps<V extends string> {
  opciones: readonly OpcionConIcono<V>[];
  valor: V | null;
  onCambiar: (valor: V | null) => void;
  /** Tocar la opción elegida la quita (filtros). Por defecto, no. */
  permitirQuitar?: boolean;
}

export interface PreguntaOpcionesProps<V extends string> extends ChipsOpcionProps<V> {
  titulo: string;
  error?: string;
}

export interface PreguntaSiNoProps {
  titulo: string;
  valor: boolean | null;
  onCambiar: (valor: boolean) => void;
  error?: string;
}

export interface FilaChipsIconoProps<V extends string> {
  opciones: readonly OpcionConIcono<V>[];
  valor: V;
  onCambiar: (valor: V) => void;
}

export interface HojaContactoProps {
  visible: boolean;
  contacto: ContactoPersona | null;
  onCerrar: () => void;
}

export interface HojaElegirFotoProps {
  visible: boolean;
  titulo: string;
  onTomar: () => void;
  onElegir: () => void;
  onCerrar: () => void;
}

export interface BotonGuardarProps {
  guardado: boolean;
  onPress: () => void;
  tamano?: number;
}

export interface SelloRevisadoProps {
  solidario?: boolean;
  compacto?: boolean;
}

export interface TarjetaAnimalAdopcionProps {
  animal: AnimalAdopcion;
  guardado: boolean;
  onGuardar: () => void;
  onPress: () => void;
}

export interface CifrasAdopcionProps {
  cifras: readonly { valor: number; texto: string }[];
}

export interface TarjetaDarEnAdopcionProps {
  onPublicar: () => void;
  onMisPublicaciones: () => void;
}

export interface FiltroRefugioActivoProps {
  nombre: string;
  onQuitar: () => void;
}

export interface HojaFiltrosAdopcionProps {
  visible: boolean;
  filtros: FiltrosAdopcion;
  comunas: string[];
  resultados: number;
  onCambiar: <K extends FiltroHojaAdopcion>(campo: K, valor: FiltrosAdopcion[K]) => void;
  onLimpiar: () => void;
  onCerrar: () => void;
}

export interface TarjetaRefugioProps {
  refugio: Refugio;
  onVerAnimales: () => void;
  onContactar: () => void;
}

export interface GaleriaFotosAdopcionProps {
  fotos: string[];
  nombre: string;
  onVolver: () => void;
  acciones: ReactNode;
}

export interface CabeceraFichaAdopcionProps {
  ficha: FichaAdopcion;
}

export interface BarrasRasgosProps {
  rasgos: RasgosAdopcion;
}

export interface SaludAdopcionProps {
  ficha: FichaAdopcion;
}

export interface TarjetaChequeoAdopcionProps {
  chequeo: ChequeoAdopcion | null;
  solicitado: boolean;
}

export interface TarjetaPublicadorProps {
  publicador: PublicadorAdopcion;
}

export interface PieFichaAdopcionProps {
  estado: EstadoBotonAdoptar;
  sexo: SexoAdopcion;
  onAdoptar: () => void;
  onVerPostulaciones: () => void;
}

export interface PasoPostulacionProps {
  datos: DatosPostulacionAdopcion;
  errores: ErroresDe<CampoPostulacion>;
  onCambiar: <K extends CampoPostulacion>(campo: K, valor: DatosPostulacionAdopcion[K]) => void;
}

export interface PasoConfirmacionPostulacionProps extends PasoPostulacionProps {
  nombreAnimal: string;
}

export interface GrillaMotivosReporteProps {
  valor: MotivoReporte | null;
  onCambiar: (motivo: MotivoReporte) => void;
}

export interface PasoPublicarProps {
  datos: DatosPublicarAdopcion;
  errores: ErroresDe<CampoPublicar>;
  onCambiar: <K extends CampoPublicar>(campo: K, valor: DatosPublicarAdopcion[K]) => void;
}

export interface PasoDatosPublicarProps extends PasoPublicarProps {
  misRefugios: OpcionRefugio[];
  onAgregarFoto: () => void;
  onQuitarFoto: (indice: number) => void;
}

export interface SelectorFotosAdopcionProps {
  fotos: FotoNuevaAdopcion[];
  onAgregar: () => void;
  onQuitar: (indice: number) => void;
  error?: string;
}

export interface SelectorNivelProps {
  titulo: string;
  valor: number | null;
  onCambiar: (valor: number | null) => void;
}

export interface VistaPreviaPublicacionProps {
  datos: DatosPublicarAdopcion;
  nombreRefugio: string | null;
}

export interface TarjetaPublicacionPropiaProps {
  publicacion: PublicacionPropia;
  ocupado: boolean;
  onPress: () => void;
  onRetirar: () => void;
  onRepublicar: () => void;
}

export interface CaminoACasaProps {
  publicacion: PublicacionPropia;
}

export interface AvisoModeracionProps {
  aviso: AvisoModeracion;
}

export interface TarjetaPostulanteProps {
  postulante: PostulanteConAfinidad;
  onPress: () => void;
}

export interface AfinidadAnilloProps {
  porcentaje: number;
  tamano: number;
}

export interface HojaPostulanteProps {
  postulante: PostulanteConAfinidad | null;
  nombreAnimal: string;
  puedeElegir: boolean;
  puedeConcretar: boolean;
  ocupado: boolean;
  error: string;
  onElegir: () => void;
  onRechazar: () => void;
  onConcretar: () => void;
  onContactar: () => void;
  onCerrar: () => void;
}

export interface HojaConcretarAdopcionProps {
  visible: boolean;
  nombreAnimal: string;
  persona: string;
  testimonio: string;
  onTestimonio: (texto: string) => void;
  traspasar: boolean;
  onTraspasar: (valor: boolean) => void;
  ocupado: boolean;
  error: string;
  onConfirmar: () => void;
  onCerrar: () => void;
}

export interface BotonFiltrosProps {
  cantidad: number;
  onPress: () => void;
}

export interface GrillaAnimalesAdopcionProps {
  animales: AnimalAdopcion[];
  estaGuardado: (id: number) => boolean;
  onGuardar: (id: number) => void;
  onAbrir: (id: number) => void;
}

export interface TarjetaSumateRefugioProps {
  onPress: () => void;
}

export interface AdoptaScreenProps {
  /** Desde el perfil de otros roles se abre con flecha para volver (el dueño la tiene como pestaña). */
  conVolver?: boolean;
}

/** Lo que comparten una postulación por enviar y una recibida (para resumirlas igual). */
export interface RespuestasHogar {
  vivienda: ViviendaAdopcion | null;
  tienePatio: boolean | null;
  tenencia: TenenciaAdopcion | null;
  permitenMascotas: boolean | null;
  hayNinos: boolean | null;
  edadesNinos: string | null;
  otrasMascotas: boolean | null;
  cualesMascotas: string | null;
  todosDeAcuerdo: boolean | null;
}

export interface PasoPersonalidadPublicarProps extends PasoPublicarProps {
  onAlternarPersonalidad: (rasgo: string) => void;
}

/** Un mosaico de la sección Salud de la ficha. */
export interface ItemSaludAdopcion {
  icono: NombreIcono;
  tono: TonoTarjeta;
  etiqueta: string;
  valor: string;
  /** Ocupa toda la fila (alergias). */
  ancho?: boolean;
}

// ─── Fase 4: moderación (superadmin) y Mi refugio ────────────────────────

export type EstadoCasoModeracion = 'pendiente' | 'resuelto' | 'descartado';
export type DecisionModeracion = 'ocultar' | 'advertir' | 'descartar';

export interface ResumenModeracion {
  porRevisar: number;
  urgentes: number;
}

export interface ReporteDeCaso {
  motivo: MotivoReporte;
  comentario: string | null;
  creadaEn: string;
}

/** Una publicación reportada (todos sus reportes juntos). */
export interface CasoModeracion {
  adopcionId: number;
  nombre: string;
  especie: EspecieAdopcion;
  comuna: string;
  fotoUrl: string | null;
  publicadaEn: string;
  publicador: string;
  esPrueba: boolean;
  reportes: number;
  motivoPrincipal: MotivoReporte;
  urgente: boolean;
  publicaciones: number;
  reportesPrevios: number;
  decision: DecisionModeracion | null;
  detalle: ReporteDeCaso[];
}

export interface DecisionPendiente {
  caso: CasoModeracion;
  decision: Exclude<DecisionModeracion, 'descartar'>;
}

export interface TarjetaCasoModeracionProps {
  caso: CasoModeracion;
  ocupado: boolean;
  onVer: () => void;
  onDecidir: (decision: DecisionModeracion) => void;
}

export interface MesRefugio {
  mes: string;
  total: number;
}

export interface DetalleMiRefugio {
  id: number;
  nombre: string;
  comuna: string;
  region: string;
  portadaUrl: string | null;
  cuposTotales: number;
  cuposOcupados: number;
  recibe: RecepcionRefugio;
  cuposActualizadosEn: string | null;
  publicadosMes: number;
  postulacionesMes: number;
  adoptadosMes: number;
}

export interface ContadorNumeroProps {
  valor: number | null;
  onCambiar: (valor: number) => void;
  /** Cuánto suma o resta cada toque (1 por defecto). */
  paso?: number;
  minimo?: number;
  maximo?: number;
  /** Cómo se muestra el número; sin valor se muestra textoVacio. */
  formato?: (valor: number) => string;
  textoVacio?: string;
}

export interface TarjetaCuposRefugioProps {
  ocupados: number;
  totales: number;
  actualizadoEn: string | null;
  guardando: boolean;
  onCambiar: (ocupados: number) => void;
}

export interface FilaMisRefugiosProps {
  refugios: OpcionRefugio[];
  onAbrir: (id: number) => void;
}

// ─── Adopción solidaria (veterinario) ───────────────────────────────────

export type PestanaSolidaria = 'esperando' | 'todos' | 'mias';
export type EstadoGeneralAtencion = 'sano' | 'en_tratamiento' | 'en_observacion';
export type ProcedimientoAtencion = 'vacunas' | 'desparasitacion' | 'esterilizacion' | 'microchip' | 'examen_general';
/** Lo que el veterinario marca en "Su ficha" (el examen general va siempre). */
export type ProcedimientoFicha = Exclude<ProcedimientoAtencion, 'examen_general'>;

export interface AnimalParaVeterinario {
  id: number;
  nombre: string;
  especie: EspecieAdopcion;
  raza: string;
  edad: string;
  comuna: string;
  fotoUrl: string | null;
  enProceso: boolean;
  solicitaAtencion: boolean;
  revisada: boolean;
  yaAtendi: boolean;
  diasEsperando: number;
  publicador: string;
  refugio: string | null;
  enMiComuna: boolean;
}

export interface AtencionPropia {
  id: number;
  adopcionId: number;
  nombre: string;
  especie: EspecieAdopcion;
  fotoUrl: string | null;
  /** "AAAA-MM-DD" */
  fecha: string;
  resumen: string;
  solidario: boolean;
  centro: string | null;
}

export interface ResumenSolidario {
  solidarias: number;
  adoptados: number;
  aliado: boolean;
}

export interface CentroAtencion {
  id: number;
  nombre: string;
}

export interface DatosAtencionSolidaria {
  solidario: boolean;
  monto: string;
  /** null = a domicilio */
  centroId: number | null;
  resumen: string;
  estadoGeneral: EstadoGeneralAtencion | null;
  procedimientos: ProcedimientoFicha[];
  pesoKg: number | null;
}

export interface AtencionGuardada {
  nombreAnimal: string;
  fotoUrl: string | null;
  solidario: boolean;
  /** Atenciones gratis del veterinario, ya contando esta */
  solidarias: number;
}

export interface TarjetaImpactoSolidarioProps {
  resumen: ResumenSolidario;
}

export interface TarjetaUrgenteSolidariaProps {
  animal: AnimalParaVeterinario;
  onPress: () => void;
}

export interface TarjetaAnimalSolidarioProps {
  animal: AnimalParaVeterinario;
  onAtender: () => void;
  onVer: () => void;
}

export interface TarjetaAtencionPropiaProps {
  atencion: AtencionPropia;
  onPress: () => void;
}

export interface TarjetaTipoAtencionProps {
  icono: NombreIcono;
  titulo: string;
  detalle?: string;
  seleccionada: boolean;
  onPress: () => void;
}

export interface FilaFichaAtencionProps {
  texto: string;
  /** Ya estaba en su ficha: queda marcado y no se puede quitar */
  yaEnFicha: boolean;
  marcado: boolean;
  onCambiar: (marcado: boolean) => void;
}

export interface AtencionSolidariaGuardadaProps {
  guardada: AtencionGuardada;
  nombreVeterinario: string;
  onOtro: () => void;
  onMisAtenciones: () => void;
}

export interface TarjetaAliadoSolidarioProps {
  activo: boolean;
  solidarias: number;
  ocupado: boolean;
  onCambiar: (activo: boolean) => void;
}

export interface FotoAnimalProps {
  fotoUrl: string | null;
  especie: EspecieAdopcion;
  estilo: StyleProp<ImageStyle>;
}


// =====================================================================
// Horario de atención, agenda completa, centros (UCI) y urgencias
// (migraciones 52 a 56; mismo modelo que la web)
// =====================================================================

// ─── Horario de atención del veterinario ───
export interface TramoHorario {
  centroId: number | null; // null = atención independiente
  diaSemana: number;
  desde: string;
  hasta: string;
}

export interface LugarAtencion {
  centroId: number | null;
  nombre: string | null;
  horarioCentro: { diaSemana: number; abre: string; cierra: string }[];
}

export interface HorarioAtencion {
  independiente: boolean;
  urgencias247: boolean;
  aDomicilio: boolean;
  comunas: string[];
  duracion: number;
  lugares: LugarAtencion[];
  tramos: TramoHorario[];
}

export interface DiaHorarioForm {
  activo: boolean;
  desde: string;
  hasta: string;
}

export type HorarioPorLugar = Record<string, DiaHorarioForm[]>;

export interface EstadoHorarioAtencion {
  form: HorarioPorLugar;
  duracion: number;
  urgencias247: boolean;
  aDomicilio: boolean;
  comunas: string[];
  mostrarTelefono: boolean;
}

export interface DatosHorarioAtencion {
  tramos: TramoHorario[];
  duracion: number;
  urgencias247: boolean;
  aDomicilio: boolean;
  comunas: string[];
}

export interface TelefonoEnUrgencias {
  mostrar: boolean;
  tieneTelefono: boolean;
}

export type PasoPerfilVeterinario = 'foto' | 'telefono' | 'especialidades' | 'colegiado' | 'horario' | 'zona';
export type ProgresoPerfilVeterinario = Partial<Record<PasoPerfilVeterinario, boolean>>;
export type PasoPerfilCentro = 'telefono' | 'horario' | 'especialidades' | 'equipo' | 'urgencias';
export type ProgresoPerfilCentro = Record<PasoPerfilCentro, boolean>;

export interface PasoProgreso {
  id: string;
  texto: string;
  icono: NombreIcono;
}

export interface TarjetaProgresoProps {
  titulo: string;
  textoPorcentaje: string;
  porcentaje: number;
  pendientes: PasoProgreso[];
  onElegir: (id: string) => void;
}

export interface DiasLugarHorarioProps {
  lugar: LugarAtencion;
  dias: DiaHorarioForm[];
  onCambiarDia: (indice: number, cambio: Partial<DiaHorarioForm>) => void;
  onUsarHorarioCentro: () => void;
}

export interface CampoHoraProps {
  etiqueta: string;
  valor: string;
  onCambiar: (valor: string) => void;
  deshabilitado?: boolean;
}

export interface CampoComunasProps {
  comunas: string[];
  onCambiar: (comunas: string[]) => void;
}

// ─── Bloqueos y cambios de hora (migración 52) ───
export interface BloqueoHorario {
  id: number;
  desde: string;
  hasta: string;
  motivo: string;
}

export type AccionCambioCita = 'reagendar' | 'cancelar';
export type MotivoCambioHora = 'Imprevisto personal' | 'Urgencia médica' | 'Capacitación' | 'Otro';

export interface DatosAvisoCambio {
  mensaje: string;
  avisarCentro: boolean;
}

export interface DatosReagendarCita extends DatosAvisoCambio {
  citaId: number;
  nuevaFecha: string;
}

export interface DatosCancelarCitaVeterinario extends DatosAvisoCambio {
  citaId: number;
  motivo: string;
}

export interface DatosBloquearHorario extends DatosAvisoCambio {
  desde: string;
  hasta: string;
  motivo: string;
  cancelarCitas: boolean;
}

/** Lo que llega a "Bloquear horario" desde la hora libre que se tocó. */
export interface ParametrosBloqueo {
  fecha: string;
  desde: string;
  hasta: string;
}

export interface AvisarCambioProps {
  dueno: string;
  centros: string[];
  avisarCentro: boolean;
  onAvisarCentro: (valor: boolean) => void;
  mensaje: string;
  onMensaje: (valor: string) => void;
}

// ─── Agenda con todas las horas ───
export type TipoCeldaAgenda = 'libre' | 'tomada' | 'bloqueada' | 'pasada';

export interface CeldaAgenda {
  fecha: string;
  hora: string;
  inicio: string;
  fin: string;
  tipo: TipoCeldaAgenda;
  cita: CitaVeterinario | null;
  bloqueo: BloqueoHorario | null;
  fueraDeHorario: boolean;
}

export interface DatosSemanaAgenda {
  tramos: TramoHorario[];
  duracion: number;
  citas: CitaVeterinario[];
  bloqueos: BloqueoHorario[];
  ahora: Date;
}

export interface HoraLibre {
  fecha: string;
  hora: string;
  inicio: string;
}

export interface DiaAgendaChip {
  fecha: string;
  diaCorto: string; // "LUN"
  numero: string;   // "6"
  esHoy: boolean;
  conCitas: number;
}

export type VistaAgendaVeterinario = 'semana' | 'lista';

export interface NavegacionSemanaProps {
  titulo: string;
  onAnterior: () => void;
  onSiguiente: () => void;
}

export interface FilaHoraAgendaProps {
  celda: CeldaAgenda;
  onPress: (celda: CeldaAgenda) => void;
}

export interface SelectorDiaAgendaProps {
  dias: DiaAgendaChip[];
  elegido: string;
  onElegir: (fecha: string) => void;
}

export interface SelectorHoraLibreProps {
  horas: HoraLibre[];
  elegida: string | null;
  onElegir: (hora: HoraLibre) => void;
}

// ─── Avisos de cambios de hora ───
export type TipoAvisoCita = 'cita_reagendada' | 'cita_cancelada' | 'cita_confirmada' | 'cita_rechazada';

export interface AvisoCita {
  id: number;
  tipo: TipoAvisoCita;
  titulo: string;
  mensaje: string;
  fechaAnterior: string | null;
  fechaNueva: string | null;
}

export interface AvisosCitasProps {
  centroId?: number;
}

// ─── UCI y urgencias de centros ───
export type EstadoUci = 'disponible' | 'pocos_cupos' | 'sin_cupos' | 'no_operativa';
export type MotivoUci = 'faltan_profesionales' | 'falta_instrumental' | 'otro';

export interface EstadoUciCentro {
  centroId: number;
  estado: EstadoUci;
  motivo: MotivoUci | null;
  detalle: string | null;
  actualizadoEn: string;
}

export interface DatosEstadoUci {
  estado: EstadoUci;
  motivo: MotivoUci | null;
  detalle: string;
}

export interface PanelEstadoUciProps {
  centroId: number;
  /** En el Resumen: sin la explicación larga. */
  compacto?: boolean;
}

export interface ProgresoPerfilCentroProps {
  centroId: number;
}

export interface TarjetaUrgenciasCentroProps {
  centro: CentroDetalle;
  onGuardado: () => void;
}

export interface EtiquetaEstadoUciProps {
  estado: EstadoUciCentro;
  ahora: Date;
}

export interface FilaDiaHorarioCentroProps {
  dia: DiaHorarioCentroForm;
  onCambiar: (cambio: Partial<DiaHorarioCentroForm>) => void;
}

export interface DiaHorarioCentroForm {
  dia: number;
  nombre: string;
  atiende: boolean;
  abre: string;
  cierra: string;
  conColacion: boolean;
  inicioColacion: string;
  finColacion: string;
}

// ─── Urgencias sin cuenta ───
export interface CentroUrgencia {
  id: number;
  nombre: string;
  direccion: string;
  comuna: string;
  telefono: number | null;
  urgencias247: boolean;
  tieneUci: boolean;
  estadoUci: EstadoUciCentro | null;
  horarios: HorarioCentro[];
}

export interface CentroUrgenciaVista extends CentroUrgencia {
  abiertoAhora: boolean;
  uciVigente: boolean;
  prioridad: number;
}

export interface VeterinarioUrgencia {
  id: number;
  nombre: string;
  telefono: number;
  avatarUrl: string | null;
  aDomicilio: boolean;
  comunas: string[];
}

export interface ListaUrgencias {
  centros: CentroUrgencia[];
  veterinarios: VeterinarioUrgencia[];
}

export interface FiltrosUrgencias {
  comuna: string | null;
  soloAbiertos: boolean;
  soloUciDisponible: boolean;
}

export interface TarjetaCentroUrgenciaProps {
  centro: CentroUrgenciaVista;
  ahora: Date;
}

export interface TarjetaVetUrgenciaProps {
  veterinario: VeterinarioUrgencia;
}

export interface FiltrosUrgenciasProps {
  comunas: string[];
  filtros: FiltrosUrgencias;
  onCambiar: (cambio: Partial<FiltrosUrgencias>) => void;
}

// ─── Teclado (useScrollConTeclado) ───
/** Posición vertical y alto de una vista en la ventana. */
export interface CajaEnVentana {
  y: number;
  alto: number;
}

/** Cualquier vista que se pueda medir en la ventana (un campo, el ScrollView, el contenedor). */
export type VistaMedible = Pick<ComponentRef<typeof View>, 'measureInWindow'>;

// ─── Tema (Perfil → Apariencia) ───
export type PreferenciaTema = 'claro' | 'oscuro' | 'auto';

export interface OpcionApariencia {
  valor: PreferenciaTema;
  texto: string;
  ayuda: string;
  icono: NombreIcono;
}

export interface HojaAparienciaProps {
  visible: boolean;
  onCerrar: () => void;
}

export interface ContextoTema {
  preferencia: PreferenciaTema;
  cambiarPreferencia: (p: PreferenciaTema) => void;
  esOscuro: boolean;
  colores: Paleta;
  tonos: TonosTarjeta;
}
