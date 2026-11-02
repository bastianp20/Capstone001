import type {
  EstadoGeneralAtencion,
  PestanaSolidaria,
  ProcedimientoFicha,
  RolCuenta,
  EstiloItemHistorial,
  TipoItemHistorial,
  DatosMascota,
  EspecieMascota,
  EstadoCita,
  EstadoDerivacion,
  FiltroCitas,
  DatosEdicionCentro,
  EstadoSuscripcion,
  FiltroAgendaCentro,
  FiltroAgendaVeterinario,
  FiltroAprobaciones,
  FiltroMensajes,
  FiltroDerivaciones,
  FiltroHistorial,
  FiltroPacientes,
  TipoSolicitud,
  EstadoSolicitudEliminacion,
  FormularioLogin,
  OpcionPildora,
  PestanaNavegacion,
  PosicionDecorativa,
  SexoMascota,
  TipoRegistro,
  TonoTarjeta,
  ItemConIcono,
  ModoDestinoCita,
  NombreIcono,
  CanalReceta,
  DatosDerivacionAtencion,
  DatosRecetaAtencion,
  TipoDestinoDerivacion,
  DatosPostulacionAdopcion,
  DatosPublicarAdopcion,
  DecisionModeracion,
  EstadoCasoModeracion,
  EspecieAdopcion,
  EtapaAdopcion,
  EstadoBotonAdoptar,
  EstadoPostulacion,
  EstadoPublicacion,
  FiltroEspecieAdopcion,
  FiltroPublicaciones,
  FiltroRefugios,
  FiltrosAdopcion,
  HitoCaminoCasa,
  OpcionConIcono,
  OpcionMotivoReporte,
  RasgoAdopcion,
  RasgosAdopcion,
  RecepcionRefugio,
  SexoAdopcion,
  TamanoAdopcion,
  TenenciaAdopcion,
  ViviendaAdopcion,
  VistaAdopta,
} from '@/interfaces';

// ─── Paleta AuraPet (app móvil) ─────────────────────────────────────────

export const COLORES = {
  primario: '#0F8F80',
  primarioOscuro: '#0B7266',
  primarioSuave: '#DDF3EE',
  fondo: '#F7FAF9',
  blanco: '#FFFFFF',
  texto: '#1A1F27',
  textoSecundario: '#6B7280',
  textoSobrePrimario: '#FFFFFF',
  textoSobrePrimarioSuave: 'rgba(255,255,255,0.82)',
  translucidoClaro: 'rgba(255,255,255,0.18)',
  borde: '#E7ECEB',
  huellas: '#E3ECEA',
  sombra: '#0B3B35',
  estados: {
    confirmada: { fondo: '#E3F6EA', texto: '#1E8A4C' },
    pendiente: { fondo: '#FFF1D6', texto: '#B7791F' },
    en_curso: { fondo: '#E3EEFB', texto: '#2F6FB5' },
    completada: { fondo: '#EDEFF2', texto: '#4B5563' },
    cancelada: { fondo: '#FDE7E7', texto: '#B54747' },
  } satisfies Record<EstadoCita, { fondo: string; texto: string }>,
  acento: '#FFB48A',
  error: '#C2413B',
  errorSuave: '#FDECEC',
  bordeCampo: '#DCE4E2',
  placeholder: '#A3AAB3',
  huellaSobrePrimario: 'rgba(255,255,255,0.12)',
  coral: '#FF7A59',
  coralOscuro: '#F2633F',
  peligro: '#D64545',
  peligroSuave: '#FCE8E8',
  aviso: '#FFF4CC',
  avisoTexto: '#7A5A00',
  segmentoActivo: '#1A1F27',
  velo: 'rgba(15, 23, 32, 0.45)',
} as const;

export const TONOS_TARJETA: Record<TonoTarjeta, { fondo: string; icono: string; iconoFondo: string }> = {
  menta: { fondo: '#DDF3EE', icono: '#0F8F80', iconoFondo: '#C3EAE1' },
  durazno: { fondo: '#FFE6D5', icono: '#D9693A', iconoFondo: '#FFD2B8' },
  lavanda: { fondo: '#E9E4FB', icono: '#6D5BD0', iconoFondo: '#D8D0F7' },
  crema: { fondo: '#FFF4D1', icono: '#A87B12', iconoFondo: '#FDE7A6' },
};

export const FUENTES = {
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const RADIOS = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 28,
} as const;

export const MARGEN_PANTALLA = 20;
export const ALTURA_BARRA_NAVEGACION = 68;
export const SEPARACION_BARRA_NAVEGACION = 12;

// ─── Navegación ─────────────────────────────────────────────────────────

/** Dónde empieza el panel de cada rol (el dueño usa las pestañas de la raíz: "/", "/citas"…). */
export const RUTAS_PANEL_ROL: Record<RolCuenta, readonly string[]> = {
  dueno: [],
  veterinario: ['/veterinario', '/centro'],
  administrativo: ['/centro'],
  superadmin: ['/admin'],
};
/** Pantallas que no son el panel de ningún rol (login, cuenta y las compartidas como Adopción). */
export const RUTAS_FUERA_DE_PANEL = ['/login', '/cuenta', '/adopcion', '/refugio'] as const;

export const PESTANAS: PestanaNavegacion[] = [
  { nombreRuta: 'index', titulo: 'Inicio', icono: 'inicio' },
  { nombreRuta: 'citas', titulo: 'Citas', icono: 'citas' },
  { nombreRuta: 'adopta', titulo: 'Adopta', icono: 'corazon' },
  { nombreRuta: 'historial', titulo: 'Historial', icono: 'historial' },
  { nombreRuta: 'perfil', titulo: 'Perfil', icono: 'perfil' },
];

export const PESTANAS_VETERINARIO: PestanaNavegacion[] = [
  { nombreRuta: 'index', titulo: 'Hoy', icono: 'hoy' },
  { nombreRuta: 'agenda', titulo: 'Agenda', icono: 'citas' },
  { nombreRuta: 'pacientes', titulo: 'Pacientes', icono: 'equipo' },
  { nombreRuta: 'perfil', titulo: 'Perfil', icono: 'perfil' },
];

export const PESTANAS_CENTRO: PestanaNavegacion[] = [
  { nombreRuta: 'index', titulo: 'Resumen', icono: 'resumen' },
  { nombreRuta: 'agenda', titulo: 'Agenda', icono: 'citas' },
  { nombreRuta: 'equipo', titulo: 'Equipo', icono: 'equipo' },
  { nombreRuta: 'mi-centro', titulo: 'Mi centro', icono: 'centro' },
];

export const PESTANAS_SUPERADMIN: PestanaNavegacion[] = [
  { nombreRuta: 'index', titulo: 'Resumen', icono: 'resumen' },
  { nombreRuta: 'aprobaciones', titulo: 'Aprobaciones', icono: 'aprobaciones' },
  { nombreRuta: 'mensajes', titulo: 'Mensajes', icono: 'mensaje' },
  { nombreRuta: 'perfil', titulo: 'Perfil', icono: 'perfil' },
];

// ─── Textos ─────────────────────────────────────────────────────────────

export const TEXTOS_INICIO = {
  saludo: 'Hola',
  proximaCita: 'Próxima cita',
  sinCita: 'Sin citas agendadas',
  sinCitaDetalle: 'Pide una hora cuando quieras',
  fichaDe: 'Ficha de',
  fichaCompleta: 'Ficha completa',
  fichaFalta: (campos: string[]) => `Falta: ${campos.join(', ')}`,
  sinMascotasTitulo: 'Agrega a tu primera mascota',
  sinMascotasDetalle: 'Registra a tu mascota para pedir horas y ver su historial.',
  sintomasPregunta: (nombre: string) => `¿${nombre} se siente mal?`,
  sintomasDetalle: 'Pide una hora y cuéntale al veterinario sus síntomas',
  pedirHora: 'Pedir hora',
  agregarMascota: 'Agregar mascota',
  irAPerfil: 'Ir a mi perfil',
} as const;

export const ETIQUETAS_ESTADO_CITA: Record<EstadoCita, string> = {
  pendiente: 'Por confirmar',
  confirmada: 'Confirmada',
  en_curso: 'En curso',
  completada: 'Atendida',
  cancelada: 'Cancelada',
};

export const MESES_CORTOS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
export const DIAS_CORTOS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
export const DIAS_LARGOS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
/** Iniciales para gráficos semanales, de lunes a domingo (dia_semana 1 a 7). */
export const DIAS_SEMANA_INICIAL = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
export const MESES_LARGOS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

// ─── Decoración ─────────────────────────────────────────────────────────

/** Huellitas del fondo de la pantalla de inicio, medidas desde el inicio de la zona de tarjetas. */
export const HUELLAS_FONDO_INICIO: PosicionDecorativa[] = [
  { top: 2, left: 22, tamano: 20, rotacion: -20 },
  { top: 372, left: 26, tamano: 22, rotacion: 12 },
  { top: 392, right: 30, tamano: 18, rotacion: -18 },
];

/** Huellitas blancas translúcidas sobre el encabezado verde. */
export const HUELLAS_ENCABEZADO_INICIO: PosicionDecorativa[] = [
  { top: 70, right: -14, tamano: 70, rotacion: 24, color: 'rgba(255,255,255,0.08)' },
  { top: 118, left: 34, tamano: 38, rotacion: -18, color: 'rgba(255,255,255,0.10)' },
];

export const HUELLAS_ENCABEZADO_PAGINA: PosicionDecorativa[] = [
  { top: 18, right: 70, tamano: 30, rotacion: 20, color: 'rgba(255,255,255,0.14)' },
  { top: 52, right: 8, tamano: 46, rotacion: -16, color: 'rgba(255,255,255,0.10)' },
];

export const HUELLAS_ENCABEZADO_LOGIN: PosicionDecorativa[] = [
  { top: '44%', right: 28, tamano: 34, rotacion: 18, color: 'rgba(255,255,255,0.22)' },
  { top: '30%', left: -14, tamano: 60, rotacion: -22, color: 'rgba(255,255,255,0.08)' },
];

// ─── Login (mismos textos que la web) ───────────────────────────────────

/** Dirección de la página web, para enlaces que abren el navegador. */
export const URL_WEB_AURAPET = process.env.EXPO_PUBLIC_URL_WEB ?? 'http://localhost:5173';
export const RUTA_WEB_SOLICITAR_CENTRO = '/solicitar-centro';
export const RUTA_WEB_NUEVA_PASSWORD = '/nueva-contrasena'; // a dónde lleva la invitación de un refugio

export const LARGO_MINIMO_PASSWORD = 6;
export const ALTO_ENCABEZADO_LOGIN = 250;

export const FORMULARIO_LOGIN_VACIO: FormularioLogin = {
  nombre: '',
  email: '',
  password: '',
  confirmacion: '',
  telefono: '',
};

export const TEXTOS_LOGIN = {
  marca: 'AuraPet',
  ingresar: {
    titulo: 'Bienvenido de vuelta',
    subtitulo: 'Inicia sesión para ver a tus mascotas',
    boton: 'Iniciar sesión',
    enviando: 'Ingresando…',
  },
  crear: {
    titulo: 'Crea tu cuenta',
    subtitulo: 'Cuenta de dueño de mascota',
    boton: 'Crear cuenta',
    enviando: 'Creando cuenta…',
    revisaCorreo: (correo: string) =>
      `Te enviamos un correo a ${correo}. Confírmalo y luego ingresa con tu contraseña.`,
  },
  campos: {
    nombre: 'Nombre completo',
    email: 'Correo electrónico',
    password: 'Contraseña',
    telefono: 'Teléfono (opcional)',
    placeholderNombre: 'Camila Rojas',
    placeholderEmail: 'tu@correo.cl',
    placeholderPassword: '••••••••',
    placeholderTelefono: '+56 9 1234 5678',
    ayudaPassword: `Mínimo 6 caracteres.`,
    mostrarPassword: 'Mostrar contraseña',
    ocultarPassword: 'Ocultar contraseña',
  },
  pie: {
    sinCuenta: '¿No tienes cuenta?',
    registrate: 'Regístrate',
    conCuenta: '¿Ya tienes cuenta?',
    ingresa: 'Inicia sesión',
    centro: '¿Eres un centro veterinario?',
    solicita: 'Solicita unirte',
  },
  validacion: {
    faltanDatos: 'Completa todos los campos obligatorios.',
    emailInvalido: 'El email no es válido.',
    passwordCorta: 'La contraseña debe tener al menos 6 caracteres.',
  },
  cerrarSesion: 'Cerrar sesión',
} as const;

export const TEXTOS_CONFIRMAR_PASSWORD = {
  etiqueta: 'Confirmar contraseña',
  placeholder: 'Repite la contraseña',
  noCoinciden: 'Las contraseñas no coinciden.',
  ayuda: 'Escríbela de nuevo (no se puede pegar).',
} as const;

export const TEXTOS_RECUPERAR_PASSWORD = {
  enlace: '¿Olvidaste tu contraseña?',
  titulo: 'Recupera tu contraseña',
  subtitulo: 'Te enviaremos un enlace para crear una nueva',
  enviar: 'Enviar enlace',
  enviando: 'Enviando…',
  enviado: (correo: string) =>
    `Si ${correo} tiene una cuenta, te llegará un correo con el enlace. Revisa también spam.`,
  volver: '← Volver a ingresar',
} as const;

/** Mensajes de Supabase (en inglés) → mensajes para el usuario. Igual que en la web. */
export const ERRORES_AUTH: { contiene: string; mensaje: string }[] = [
  { contiene: 'invalid login credentials', mensaje: 'Email o contraseña incorrectos.' },
  { contiene: 'email not confirmed', mensaje: 'Debes confirmar tu correo antes de ingresar. Revisa tu bandeja de entrada.' },
  { contiene: 'user already registered', mensaje: 'Ya existe una cuenta con ese email.' },
  { contiene: 'password should be at least', mensaje: 'La contraseña debe tener al menos 6 caracteres.' },
  { contiene: 'rate limit', mensaje: 'Hubo demasiados intentos. Espera unos minutos y vuelve a intentarlo.' },
  { contiene: 'unable to validate email', mensaje: 'El email no es válido.' },
  { contiene: 'invalid format', mensaje: 'El email no es válido.' },
  { contiene: 'network request failed', mensaje: 'No hay conexión a internet. Revísala e inténtalo de nuevo.' },
  { contiene: 'failed to fetch', mensaje: 'No hay conexión a internet. Revísala e inténtalo de nuevo.' },
];
export const ERROR_AUTH_GENERICO = 'No pudimos completar la operación. Inténtalo de nuevo.';

export const AVISOS_SESION = {
  sinPerfil: 'No pudimos cargar tu cuenta o está desactivada. Escríbenos si crees que es un error.',
} as const;

// ─── Datos de la base (mismos valores que la web) ───────────────────────

export const ESPECIES_MASCOTA: OpcionPildora<EspecieMascota>[] = [
  { valor: 'perro', texto: 'Perro' },
  { valor: 'gato', texto: 'Gato' },
  { valor: 'ave', texto: 'Ave' },
  { valor: 'conejo', texto: 'Conejo' },
  { valor: 'otro', texto: 'Otro' },
];

export const ESPECIE_LABEL: Record<EspecieMascota, string> = {
  perro: 'Perro',
  gato: 'Gato',
  ave: 'Ave',
  conejo: 'Conejo',
  otro: 'Otra especie',
};

export const SEXOS_MASCOTA: OpcionPildora<SexoMascota>[] = [
  { valor: 'macho', texto: 'Macho' },
  { valor: 'hembra', texto: 'Hembra' },
];

export const TIPO_REGISTRO_LABEL: Record<TipoRegistro, string> = {
  diagnostico: 'Diagnóstico',
  vacuna: 'Vacuna',
  cirugia: 'Cirugía',
  control: 'Control',
  otro: 'Atención',
};

export const ESTADO_DERIVACION_LABEL: Record<EstadoDerivacion, string> = {
  pendiente: 'Pendiente',
  realizada: 'Realizada',
  cancelada: 'Cancelada',
};

export const TEXTO_ATENCION_INDEPENDIENTE = 'Atención independiente';
export const ESPECIALIDAD_POR_DEFECTO = 'Medicina general';
export const MOTIVO_RECHAZO_SIN_DETALLE = 'El veterinario no indicó un motivo.';
export const TEXTO_SIN_REGISTRAR = 'Sin registrar';

/** Síntomas frecuentes: chips que el dueño puede marcar al pedir hora (igual que la web). */
export const SINTOMAS_FRECUENTES = ['Vómitos', 'Diarrea', 'No come', 'Decaimiento', 'Tos', 'Cojera', 'Picazón', 'Fiebre'];

// ─── Reglas de negocio ──────────────────────────────────────────────────

export const PASO_HORA_CITA_MIN = 15; // las horas de cita van de 15 en 15 minutos, como en la web
export const DIAS_PARA_AGENDAR = 21; // cuántos días hacia adelante se muestran al pedir hora
/** Horario que se ofrece cuando el centro no registró horarios o es un veterinario independiente. */
export const HORARIO_SIN_REGISTRO = { abre: '09:00', cierra: '19:00' };
export const DIAS_AVISO_VACUNA = 30; // "vence pronto" si le toca dentro de estos días (igual que la web)
export const MESES_CONTROL_RECOMENDADO = 12; // después de esto, el último control se marca como pendiente
export const DIAS_SEMANA_CITAS = 7; // "Esta semana" en la pestaña Citas

// ─── Pestaña Citas ──────────────────────────────────────────────────────

export const TEXTOS_CITAS = {
  titulo: 'Mis citas',
  buscar: 'Buscar por motivo, veterinario o centro',
  estaSemana: 'Esta semana',
  masAdelante: 'Más adelante',
  pasadas: 'Pasadas',
  canceladas: 'Canceladas',
  comoLlegar: 'Cómo llegar',
  cancelar: 'Cancelar cita',
  sinVeterinario: 'Veterinario por asignar',
  rechazo: 'Motivo:',
  vacioTitulo: {
    proximas: 'No tienes citas próximas',
    pasadas: 'Aún no tienes citas pasadas',
    canceladas: 'No tienes citas canceladas',
  } satisfies Record<FiltroCitas, string>,
  vacioDetalle: 'Cuando pidas una hora, aparecerá aquí.',
  sinResultados: 'Ninguna cita coincide con tu búsqueda.',
  confirmarCancelarTitulo: '¿Cancelar esta cita?',
  confirmarCancelarTexto: (motivo: string, fecha: string) => `${motivo} · ${fecha}. Esta acción no se puede deshacer.`,
  confirmarCancelarSi: 'Sí, cancelar',
  confirmarCancelarNo: 'Volver',
  errorCancelar: 'No se pudo cancelar la cita.',
} as const;

export const FILTROS_CITAS: OpcionPildora<FiltroCitas>[] = [
  { valor: 'proximas', texto: 'Próximas' },
  { valor: 'pasadas', texto: 'Pasadas' },
  { valor: 'canceladas', texto: 'Canceladas' },
];

// ─── Pestaña Historial ──────────────────────────────────────────────────

export const TEXTOS_HISTORIAL = {
  titulo: 'Historial médico',
  todas: 'Todas',
  fichaPdf: 'Ficha PDF',
  generandoPdf: 'Generando…',
  elegirMascotaPdf: 'Elige una mascota para descargar su ficha.',
  errorPdf: 'No pudimos generar la ficha. Inténtalo de nuevo.',
  verReceta: 'Ver receta',
  ocultarReceta: 'Ocultar receta',
  proximaDosis: (fecha: string) => `Próxima dosis: ${fecha}`,
  proximoControl: (fecha: string) => `Próximo control: ${fecha}`,
  derivadoA: (destino: string) => `Derivado a ${destino}`,
  derivadoPor: (origen: string) => `Lo derivó ${origen}`,
  receta: 'Receta',
  medicamentos: (n: number) => (n === 1 ? '1 medicamento' : `${n} medicamentos`),
  vacioTitulo: 'Todavía no hay registros',
  vacioDetalle: 'Después de cada atención, el veterinario deja aquí el diagnóstico, las vacunas y las recetas.',
} as const;

export const FILTROS_HISTORIAL: OpcionPildora<FiltroHistorial>[] = [
  { valor: 'todo', texto: 'Todo' },
  { valor: 'consulta', texto: 'Consultas' },
  { valor: 'vacuna', texto: 'Vacunas' },
  { valor: 'receta', texto: 'Recetas' },
  { valor: 'derivacion', texto: 'Derivaciones' },
];

/** Ícono y color de cada tipo de registro en la línea de tiempo. */
export const ESTILO_ITEM_HISTORIAL: Record<TipoItemHistorial, EstiloItemHistorial> = {
  consulta: { icono: 'estetoscopio', tono: null, colorPunto: '#0F8F80' },
  vacuna: { icono: 'jeringa', tono: 'lavanda', colorPunto: '#8B7BE0' },
  receta: { icono: 'pastilla', tono: 'durazno', colorPunto: '#F0936B' },
  derivacion: { icono: 'etiqueta', tono: 'crema', colorPunto: '#D9B44A' },
};

/** Valor de la píldora "Todas" en el selector de mascotas del historial. */
export const TODAS_LAS_MASCOTAS = 'todas';

// ─── Pestaña Perfil ─────────────────────────────────────────────────────

export const TEXTOS_PERFIL = {
  titulo: 'Perfil',
  misMascotas: 'Mis mascotas',
  agregarMascota: 'Agregar mascota',
  datosPersonales: 'Datos personales',
  ayuda: 'Ayuda y contacto',
  versionApp: 'AuraPet v1.0',
  eliminarCuenta: 'Eliminar mi cuenta',
  adopcion: 'Adopción',
  misPublicaciones: 'Mis publicaciones en adopción',
  miRefugio: 'Mi refugio',
} as const;

/** Colores que se van turnando en las tarjetas de mascotas del perfil. */
export const TONOS_MASCOTAS: TonoTarjeta[] = ['durazno', 'crema', 'menta', 'lavanda'];
export const COLUMNAS_MASCOTAS_PERFIL = 3;
export const SEPARACION_GRILLA_MASCOTAS = 10;

// ─── Pedir hora ─────────────────────────────────────────────────────────

/** Valor de "Sin preferencia" en el selector de veterinario. */
export const SIN_PREFERENCIA_VETERINARIO = 'ninguno';

export const TEXTOS_PEDIR_HORA = {
  titulo: 'Pedir hora',
  mascota: '¿Para quién es la hora?',
  independiente: 'Veterinario independiente',
  veterinario: 'Veterinario',
  sinPreferencia: 'Sin preferencia',
  sinIndependientes: 'No hay veterinarios independientes disponibles.',
  dia: 'Día',
  hora: 'Hora',
  centroCerrado: 'El centro no atiende ese día.',
  sinHoras: 'No quedan horas para ese día.',
  horarioDelDia: (abre: string, cierra: string, colacion: string | null) =>
    `Atiende de ${abre} a ${cierra}${colacion ? ` (colación ${colacion})` : ''}.`,
  sinHorarioRegistrado: 'Este centro no registró horarios: elige una hora y el veterinario la confirmará.',
  motivo: 'Motivo de la consulta',
  motivoPlaceholder: 'Ej: vómitos desde ayer, control anual…',
  sintomas: 'Síntomas (opcional)',
  enviar: 'Solicitar hora',
  enviando: 'Enviando…',
  faltaVeterinario: 'Elige el veterinario independiente que te atenderá.',
  error: 'No se pudo solicitar la hora.',
  listoTitulo: '¡Hora solicitada!',
  listoDetalle: (donde: string) =>
    `Enviamos tu solicitud a ${donde}. Queda como "por confirmar" hasta que el veterinario la acepte.`,
  verMisCitas: 'Ver mis citas',
  sinMascotas: 'Primero registra a tu mascota para poder pedir una hora.',
  cargando: 'Cargando centros…',
  errorCarga: 'No pudimos cargar los centros. Revisa tu conexión.',
  // Pasos (29-10)
  continuar: 'Continuar',
  cambiar: 'Cambiar',
  queNecesita: '¿Qué necesita tu mascota?',
  queNecesitaAyuda: 'Elige una o más y te mostramos quién puede atenderla',
  quitarFiltro: 'Quitar filtro',
  resumenLugares: (n: number, especialidades: string[]) =>
    especialidades.length
      ? `${n} ${n === 1 ? 'lugar' : 'lugares'} con ${unirConY(especialidades)}`
      : `${n} ${n === 1 ? 'lugar disponible' : 'lugares disponibles'}`,
  resumenProfesionales: (n: number, especialidades: string[]) =>
    especialidades.length
      ? `${n} ${n === 1 ? 'profesional' : 'profesionales'} con ${unirConY(especialidades)}`
      : `${n} ${n === 1 ? 'profesional independiente' : 'profesionales independientes'}`,
  sinCoincidencias: 'Nadie tiene todas esas especialidades. Prueba quitando alguna.',
  sinCentros: 'Todavía no hay centros disponibles.',
  independienteSinCentro: 'Atiende sin centro · a domicilio o en su consulta',
  dondeAtender: (lugar: string) => `Atención en ${lugar}`,
  faltaMascota: 'Elige la mascota y escribe el motivo de la consulta.',
  faltaDestino: 'Elige dónde quieres atenderte.',
  faltaDiaHora: 'Elige el día y la hora.',
  faltaVeterinarioFiltro: 'Elige al profesional con la especialidad que buscas.',
  conEspecialidad: 'Solo aparecen quienes tienen la especialidad que buscas.',
} as const;

/** "Cirugía y Cardiología", "Cirugía, Dermatología y Cardiología". */
function unirConY(lista: string[]): string {
  return lista.length <= 1 ? (lista[0] ?? '') : `${lista.slice(0, -1).join(', ')} y ${lista[lista.length - 1]}`;
}

export const PASOS_PEDIR_HORA = ['Mascota', 'Dónde', 'Día y hora'] as const;

export const MODOS_DESTINO_CITA: readonly { valor: ModoDestinoCita; texto: string }[] = [
  { valor: 'centros', texto: 'Centros' },
  { valor: 'independientes', texto: 'Independientes' },
];

/** Medicina general la tienen todos: no sirve para filtrar. */
export const NOMBRE_MEDICINA_GENERAL = 'medicina general';
export const MAX_CHIPS_DESTINO = 3;
export const MAX_AVATARES_FILA = 4;

/** Ícono de cada especialidad según su nombre (la primera regla que calza; si ninguna, estetoscopio). */
export const ICONOS_ESPECIALIDAD: readonly { patron: RegExp; icono: NombreIcono }[] = [
  { patron: /derma/i, icono: 'gota' },
  { patron: /cirug/i, icono: 'tijeras' },
  { patron: /cardio/i, icono: 'corazon' },
  { patron: /trauma|orto/i, icono: 'hueso' },
  { patron: /oftal/i, icono: 'ojo' },
  { patron: /ex[oó]tic/i, icono: 'huella' },
  { patron: /vacun|inmun/i, icono: 'jeringa' },
];

// ─── Foto de perfil ─────────────────────────────────────────────────────

export const BUCKET_AVATARES = 'avatares';
export const CALIDAD_FOTO_PERFIL = 0.7; // compresión al elegirla (0 a 1)

export const TEXTOS_FOTO_PERFIL = {
  titulo: 'Foto de perfil',
  cambiar: 'Cambiar foto de perfil',
  tomar: 'Tomar foto',
  elegir: 'Elegir de la galería',
  quitar: 'Quitar foto',
  ayuda: 'Es opcional. Si no subes una, usamos tus iniciales.',
  cancelar: 'Cancelar',
  guardando: 'Guardando foto…',
  sinPermisoCamara: 'Necesitamos permiso para usar la cámara. Puedes darlo en los ajustes del teléfono.',
  sinPermisoGaleria: 'Necesitamos permiso para ver tus fotos. Puedes darlo en los ajustes del teléfono.',
  error: 'No se pudo guardar la foto. Intenta de nuevo.',
} as const;

// ─── Eliminar la cuenta ─────────────────────────────────────────────────

export const MAX_COMENTARIO_ELIMINACION = 400;

export const MOTIVOS_ELIMINACION = ['Ya no tengo mascotas', 'No la uso', 'Prefiero otra app', 'Problemas con la app', 'Otro'] as const;

// Lo que de verdad pasa al aprobarla (migraciones 32 y 49): la cuenta se desactiva, no se borra el historial.
export const QUE_PASA_ELIMINAR: readonly ItemConIcono[] = [
  { icono: 'candado', texto: 'Tu cuenta se desactiva y ya no podrás ingresar' },
  { icono: 'citas', texto: 'Tus citas futuras se cancelan' },
  { icono: 'persona', texto: 'Dejas de aparecer para veterinarios y centros' },
];

export const TEXTOS_ELIMINAR_CUENTA = {
  titulo: 'Eliminar mi cuenta',
  lamentamos: 'Lamentamos que te vayas. Revisaremos tu solicitud y te avisaremos por correo.',
  quePasa: 'Qué pasa',
  queSeConserva: 'Qué se conserva',
  conserva: 'Las atenciones ya realizadas quedan en el registro de los veterinarios que atendieron a tus mascotas.',
  porQue: '¿Por qué te vas? (opcional)',
  comentario: '¿Algo que quieras contarnos?',
  entiendo: 'Entiendo que esta acción no se puede deshacer',
  mejorMeQuedo: 'Mejor me quedo',
  solicitar: 'Solicitar eliminación',
  solicitando: 'Enviando…',
  rechazada: 'Tu solicitud anterior no fue aprobada.',
  error: 'No se pudo enviar la solicitud.',
  // Enviada
  recibimos: 'Recibimos tu solicitud',
  revisaremos: (correo: string) => `La revisaremos en las próximas 48 horas y te escribiremos a ${correo}.`,
  pasoEnviada: (cuando: string) => `Solicitud enviada · ${cuando}`,
  pasoRevision: 'En revisión',
  pasoEliminada: 'Cuenta eliminada',
  mientrasTanto: 'Mientras tanto puedes seguir usando AuraPet con normalidad.',
  cancelarSolicitud: 'Cancelar solicitud',
  cancelando: 'Cancelando…',
  volverPerfil: 'Volver al perfil',
  errorCancelar: 'No se pudo cancelar la solicitud.',
  cargando: 'Cargando…',
} as const;

export const CONFIRMAR_CANCELAR_ELIMINACION = {
  titulo: '¿Cancelar la solicitud?',
  mensaje: 'Tu cuenta seguirá activa como siempre.',
  textoSi: 'Sí, cancelar',
  textoNo: 'No',
};

// ─── Formulario de mascota ──────────────────────────────────────────────

export const DATOS_MASCOTA_VACIOS: DatosMascota = {
  nombre: '',
  especie: 'perro',
  sexo: 'macho',
  raza: '',
  fechaNacimiento: '',
  pesoKg: '',
  esterilizado: false,
  alergias: '',
  condicionesCronicas: '',
  microchip: '',
};

export const TEXTOS_MASCOTA = {
  tituloNueva: 'Nueva mascota',
  tituloEditar: 'Editar mascota',
  nombre: 'Nombre',
  nombrePlaceholder: 'Firulais',
  especie: 'Especie',
  sexo: 'Sexo',
  raza: 'Raza (opcional)',
  razaPlaceholder: 'Labrador, mestizo…',
  nacimiento: 'Fecha de nacimiento (opcional)',
  nacimientoPlaceholder: 'DD-MM-AAAA',
  peso: 'Peso en kg (opcional)',
  pesoPlaceholder: '12,5',
  esterilizado: 'Está esterilizado/a',
  alergias: 'Alergias (opcional)',
  alergiasPlaceholder: 'Penicilina, pollo…',
  condiciones: 'Condiciones crónicas (opcional)',
  condicionesPlaceholder: 'Displasia, diabetes…',
  microchip: 'N° de microchip (opcional)',
  microchipPlaceholder: '15 dígitos',
  guardar: 'Guardar',
  guardando: 'Guardando…',
  faltaNombre: 'Escribe el nombre de tu mascota.',
  fechaInvalida: 'Escribe la fecha como DD-MM-AAAA y que no sea futura.',
  pesoInvalido: 'El peso debe ser un número mayor a 0.',
  errorCrear: 'No se pudo registrar la mascota.',
  errorEditar: 'No se pudieron guardar los cambios.',
  noEncontrada: 'No encontramos esta mascota.',
  volver: 'Volver',
} as const;

/** Campos que cuentan para "Ficha completa" en el inicio. */
export const CAMPOS_FICHA_MASCOTA = [
  { campo: 'raza', texto: 'raza' },
  { campo: 'fechaNacimiento', texto: 'fecha de nacimiento' },
  { campo: 'pesoKg', texto: 'peso' },
  { campo: 'microchip', texto: 'microchip' },
  { campo: 'alergias', texto: 'alergias' },
] as const;

// ─── Datos personales y contacto ────────────────────────────────────────

export const TEXTOS_DATOS_PERSONALES = {
  titulo: 'Datos personales',
  nombre: 'Nombre completo',
  telefono: 'Teléfono (opcional)',
  telefonoPlaceholder: '+56 9 1234 5678',
  correo: 'Correo electrónico',
  correoAyuda: 'El correo no se puede cambiar desde la app.',
  guardar: 'Guardar cambios',
  guardando: 'Guardando…',
  guardado: 'Tus datos quedaron guardados.',
  faltaNombre: 'Escribe tu nombre.',
  telefonoInvalido: 'El teléfono debe tener 9 dígitos (sin el +56).',
  error: 'No se pudieron guardar tus datos.',
} as const;

export const LARGO_TELEFONO_CL = 9; // sin el +56, como en la web
export const PREFIJO_TELEFONO_CL = '56';

export const ASUNTOS_CONTACTO = ['Soporte técnico', 'Para dueños', 'Para veterinarias', 'Otro'] as const;

export const MAX_CARACTERES_CONTACTO = 1000;

export const TEXTOS_CONTACTO = {
  titulo: 'Ayuda y contacto',
  intro: 'Cuéntanos qué necesitas y el equipo de AuraPet te responderá a tu correo.',
  asunto: 'Asunto',
  mensaje: 'Mensaje',
  mensajePlaceholder: 'Escribe tu consulta…',
  enviar: 'Enviar mensaje',
  enviando: 'Enviando…',
  enviado: 'Recibimos tu mensaje. Te responderemos pronto a tu correo.',
  faltaMensaje: 'Escribe tu mensaje.',
  error: 'No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos.',
  enviadoTitulo: '¡Mensaje enviado!',
  volver: 'Volver al perfil',
} as const;

// ─── Estados de carga ───────────────────────────────────────────────────

export const TEXTOS_CARGA = {
  cargando: 'Cargando…',
  error: 'No pudimos cargar la información.',
  reintentar: 'Reintentar',
} as const;

// ─── Ficha en PDF ───────────────────────────────────────────────────────

export const TEXTOS_FICHA_PDF = {
  titulo: 'Ficha clínica',
  emitida: 'Emitida el',
  paciente: 'Paciente',
  tutor: 'Tutor',
  especie: 'Especie',
  raza: 'Raza',
  sexo: 'Sexo',
  nacimiento: 'Nacimiento',
  peso: 'Peso',
  esterilizado: 'Esterilizado',
  microchip: 'Microchip',
  telefono: 'Teléfono',
  alergias: 'Alergias',
  condiciones: 'Condiciones crónicas',
  historial: 'Historial médico',
  recetas: 'Recetas',
  derivaciones: 'Derivaciones',
  sinRegistros: 'Sin registros.',
  fecha: 'Fecha',
  tipo: 'Tipo',
  descripcion: 'Descripción',
  atendio: 'Atendió',
  indicaciones: 'Indicaciones',
  proximoControl: 'Próximo control',
  proximaDosis: 'Próxima dosis',
  pie: 'Documento generado por AuraPet a partir de los registros de los veterinarios.',
  receta: 'Receta veterinaria',
  medicamento: 'Medicamento',
  dosis: 'Dosis',
  frecuencia: 'Frecuencia',
  duracion: 'Duración',
  nombreReceta: (mascota: string) => `Receta de ${mascota}`,
  nombreArchivo: (mascota: string) => `Ficha ${mascota}`,
} as const;

export const SEXO_LABEL = { macho: 'Macho', hembra: 'Hembra' } as const;

// ─── Acceso por rol ─────────────────────────────────────────────────────

export const TEXTOS_SIN_CENTRO = {
  titulo: 'Aún no administras un centro',
  detalle: 'Cuando el equipo de AuraPet te asigne a un centro, aquí verás su agenda y su equipo.',
} as const;

// ─── Veterinario ────────────────────────────────────────────────────────

export const TEXTOS_VETERINARIO = {
  rol: 'Veterinario',
  independiente: 'Atención independiente',
  citasHoy: 'Citas hoy',
  atendidas: 'Atendidas',
  porConfirmar: 'Por confirmar',
  pendientes: 'Pendientes',
  siguientePaciente: 'Siguiente paciente',
  sinSiguiente: 'No te quedan pacientes confirmados para hoy.',
  verFicha: 'Ver ficha',
  iniciarAtencion: 'Iniciar atención',
  confirmar: 'Confirmar',
  rechazar: 'Rechazar',
  verTodas: (n: number) => `Ver las ${n} en Agenda`,
  agendaDeHoy: 'Agenda de hoy',
  sinCitasHoy: 'No tienes citas para hoy.',
  derivaciones: 'Derivaciones recibidas',
  derivacionesDetalle: 'Pacientes que te derivaron otros colegas',
  alergia: (a: string) => `Alergia: ${a}`,
  cuentaEnRevision: 'Tu cuenta está en revisión. El equipo de AuraPet la aprobará pronto; mientras tanto no recibirás citas.',
  cuentaRechazada: 'Tu cuenta no fue aprobada. Escríbenos desde Ayuda y contacto si crees que es un error.',
  sinFicha: 'Esta cuenta no tiene ficha de veterinario',
  sinFichaDetalle: 'Pide al equipo de AuraPet que revise tu registro.',
  rechazarTitulo: 'Rechazar la solicitud',
  rechazarDetalle: (mascota: string) => `El dueño de ${mascota} verá este motivo.`,
  rechazarPlaceholder: 'Ej: no tengo horas ese día, por favor pide otra.',
  errorAccion: 'No se pudo actualizar la cita.',
  administrarCentro: (centro: string) => `Administrar ${centro}`,
  verDerivaciones: 'Derivaciones',
  abrirAtencion: 'Abrir atención',
  misEspecialidades: 'Mis especialidades',
  adopcionSolidaria: 'Adopción solidaria',
} as const;

export const TEXTOS_AGENDA_VETERINARIO = {
  titulo: 'Mi agenda',
  buscar: 'Buscar por mascota, dueño o motivo',
  vacio: 'No hay citas en este filtro',
  vacioDetalle: 'Las solicitudes de los dueños aparecerán aquí.',
  sinResultados: 'Ninguna cita coincide con tu búsqueda.',
} as const;

export const FILTROS_AGENDA_VETERINARIO: OpcionPildora<FiltroAgendaVeterinario>[] = [
  { valor: 'hoy', texto: 'Hoy' },
  { valor: 'proximas', texto: 'Próximas' },
  { valor: 'pendientes', texto: 'Por confirmar' },
  { valor: 'pasadas', texto: 'Pasadas' },
];

export const TEXTOS_PACIENTES = {
  titulo: 'Pacientes',
  buscar: 'Buscar por mascota o dueño',
  vacio: 'Todavía no tienes pacientes',
  vacioDetalle: 'Una mascota pasa a ser tu paciente cuando confirmas su primera cita.',
  sinResultados: 'Ningún paciente coincide con tu búsqueda.',
  visitas: (n: number) => (n === 1 ? '1 visita' : `${n} visitas`),
  ultimaVisita: (cuando: string) => `Última visita: ${cuando.toLowerCase()}`,
} as const;

export const FILTROS_PACIENTES: OpcionPildora<FiltroPacientes>[] = [
  { valor: 'todos', texto: 'Todos' },
  { valor: 'alergias', texto: 'Con alergias' },
];

export const TEXTOS_FICHA_PACIENTE = {
  datos: 'Datos clínicos',
  dueno: 'Dueño',
  llamar: 'Llamar',
  historial: 'Historial',
  sinHistorial: 'Este paciente todavía no tiene registros.',
  fichaPdf: 'Ficha PDF',
  peso: 'Peso',
  sexo: 'Sexo',
  esterilizado: 'Esterilizado',
  microchip: 'Microchip',
  nacimiento: 'Nacimiento',
  condiciones: 'Condiciones crónicas',
  si: 'Sí',
  no: 'No',
} as const;

export const TEXTOS_DERIVACIONES = {
  titulo: 'Derivaciones',
  de: (origen: string) => `De ${origen}`,
  a: (destino: string) => `A ${destino}`,
  realizada: 'Marcar realizada',
  rechazar: 'Rechazar',
  cancelar: 'Cancelar derivación',
  resultadoTitulo: 'Resultado de la derivación',
  resultadoDetalle: 'Cuenta qué se hizo; quedará en el historial del paciente.',
  resultadoPlaceholder: 'Ej: radiografía sin hallazgos, se recomienda control en 1 mes.',
  confirmarRechazoTitulo: '¿Rechazar esta derivación?',
  confirmarCancelarTitulo: '¿Cancelar esta derivación?',
  confirmarTexto: (mascota: string) => `Derivación de ${mascota}.`,
  si: 'Sí',
  no: 'Volver',
  vacio: 'No hay derivaciones en este filtro',
  error: 'No se pudo actualizar la derivación.',
} as const;

export const FILTROS_DERIVACIONES: OpcionPildora<FiltroDerivaciones>[] = [
  { valor: 'pendientes', texto: 'Por responder' },
  { valor: 'recibidas', texto: 'Recibidas' },
  { valor: 'enviadas', texto: 'Enviadas' },
];

// ─── Administrador de centro ────────────────────────────────────────────

export const DIAS_SEMANA_LARGOS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']; // 1 = lunes

export const TEXTOS_CENTRO = {
  resumen: 'Resumen de hoy',
  rolAdministrativo: 'Administrador de centro',
  citasHoy: 'Citas de hoy',
  porConfirmar: 'Por confirmar',
  equipo: 'Equipo',
  veterinarios: (n: number) => (n === 1 ? 'veterinario' : 'veterinarios'),
  suscripcion: 'Suscripción',
  renueva: (cuando: string) => `Renueva ${cuando.toLowerCase()}`,
  pruebaTermina: (cuando: string) => `La prueba termina ${cuando.toLowerCase()}`,
  vencida: 'La suscripción venció. Pide un plan para seguir sumando veterinarios.',
  usoVeterinarios: (usados: number, limite: number | null) =>
    limite === null ? `${usados} veterinarios (sin límite)` : `${usados} de ${limite} veterinarios del plan`,
  verPlanes: 'Ver planes',
  sinSuscripcion: 'Este centro todavía no tiene un plan.',
  ahora: 'Ahora en el centro',
  sinCitasProximas: 'No hay citas próximas.',
  sinVeterinario: 'Sin veterinario asignado',
  horarioHoy: 'Horario de hoy',
  cerradoHoy: 'Hoy el centro no atiende.',
  sinHorarios: 'El centro no tiene horarios registrados.',
  textoHorario: (abre: string, cierra: string, colacion: string | null) =>
    `${abre} a ${cierra}${colacion ? ` · colación ${colacion}` : ''}`,
  sinCentros: 'No administras ningún centro.',
} as const;

export const ESTADO_SUSCRIPCION_LABEL: Record<EstadoSuscripcion, string> = {
  prueba: 'En prueba',
  activa: 'Activa',
  vencida: 'Vencida',
  cancelada: 'Cancelada',
};

export const TEXTOS_AGENDA_CENTRO = {
  titulo: 'Agenda del centro',
  buscar: 'Buscar por mascota, dueño o veterinario',
  vacio: 'No hay citas en este filtro',
  sinResultados: 'Ninguna cita coincide con tu búsqueda.',
  veterinario: (nombre: string) => `Atiende: ${nombre}`,
} as const;

export const FILTROS_AGENDA_CENTRO: OpcionPildora<FiltroAgendaCentro>[] = [
  { valor: 'hoy', texto: 'Hoy' },
  { valor: 'proximas', texto: 'Próximas' },
  { valor: 'sinAsignar', texto: 'Sin asignar' },
  { valor: 'pasadas', texto: 'Pasadas' },
];

export const TEXTOS_EQUIPO = {
  titulo: 'Equipo',
  veterinario: 'Veterinario',
  admin: 'Administrador',
  vacio: 'El centro todavía no tiene equipo',
  vacioDetalle: 'Los veterinarios se suman desde el panel del superadmin.',
} as const;

export const TEXTOS_MI_CENTRO = {
  titulo: 'Mi centro',
  datos: 'Datos del centro',
  direccion: 'Dirección',
  telefono: 'Teléfono',
  especialidades: 'Especialidades',
  horarios: 'Horarios de atención',
  cerrado: 'Cerrado',
  editar: 'Editar datos del centro',
  planes: 'Plan y suscripción',
  volverAgenda: 'Volver a mi agenda',
  dePrueba: 'Centro de prueba',
} as const;

export const TEXTOS_EDITAR_CENTRO = {
  titulo: 'Editar centro',
  nombre: 'Nombre del centro',
  direccion: 'Dirección',
  comuna: 'Comuna',
  telefono: 'Teléfono (opcional)',
  guardar: 'Guardar cambios',
  guardando: 'Guardando…',
  faltanDatos: 'Completa el nombre, la dirección y la comuna.',
  error: 'No se pudieron guardar los cambios.',
} as const;

export const DATOS_CENTRO_VACIOS: DatosEdicionCentro = { nombre: '', direccion: '', comuna: '', telefono: '' };

export const TEXTOS_PLANES = {
  titulo: 'Planes',
  actual: 'Tu plan',
  solicitado: 'Solicitado',
  solicitar: 'Solicitar este plan',
  porMes: '/mes',
  gratis: 'Gratis',
  limite: (n: number | null) => (n === null ? 'Veterinarios sin límite' : `Hasta ${n} veterinarios`),
  modalTitulo: (plan: string) => `Solicitar ${plan}`,
  modalDetalle: 'El equipo de AuraPet activará el plan y te contactará. Puedes dejar un mensaje (opcional).',
  modalPlaceholder: 'Ej: queremos sumar dos veterinarios desde noviembre.',
  enviar: 'Enviar solicitud',
  enviada: 'Listo: enviamos tu solicitud. El equipo de AuraPet la revisará pronto.',
  error: 'No se pudo enviar la solicitud.',
  pendiente: 'Ya tienes una solicitud de cambio de plan esperando respuesta.',
} as const;

// ─── Superadmin ─────────────────────────────────────────────────────────

export const TEXTOS_SUPERADMIN = {
  titulo: 'Panel AuraPet',
  saludo: (nombre: string) => `Hola, ${nombre} · Superadmin`,
  rol: 'Superadmin',
  usuarios: 'Usuarios',
  centrosActivos: 'Centros activos',
  citasMes: 'Citas este mes',
  veterinarios: 'Veterinarios',
  atencion: 'Requiere tu atención',
  aprobaciones: 'Aprobaciones pendientes',
  aprobacionesDetalle: 'Centros, veterinarios y refugios por revisar',
  moderacion: 'Publicaciones reportadas',
  moderacionDetalle: (urgentes: number) => (urgentes ? `${urgentes} ${urgentes === 1 ? 'urgente' : 'urgentes'} · revisa y decide` : 'Revisa y decide'),
  mensajes: 'Mensajes sin responder',
  mensajesDetalle: 'Formulario de contacto',
  eliminaciones: 'Solicitudes de eliminación',
  eliminacionesDetalle: 'Cuentas que pidieron darse de baja',
  planes: 'Cambios de plan solicitados',
  planesDetalle: 'Centros que quieren otro plan',
  porAprobar: 'Por aprobar',
  verTodas: 'Ver todas las aprobaciones',
  todoAlDia: 'No hay nada pendiente. ¡Todo al día!',
} as const;

export const TIPO_SOLICITUD_LABEL: Record<TipoSolicitud, string> = {
  centro: 'Centro',
  veterinario: 'Veterinario',
  solicitud_centro: 'Solicitud de centro',
  refugio: 'Refugio',
};

export const ICONO_TIPO_SOLICITUD = { centro: 'centro', veterinario: 'estetoscopio', solicitud_centro: 'correo', refugio: 'casa' } as const;

export const TEXTOS_APROBACIONES = {
  titulo: 'Aprobaciones',
  buscar: 'Buscar por nombre',
  aprobar: 'Aprobar',
  rechazar: 'Rechazar',
  solicitado: (cuando: string) => `Solicitado ${cuando.toLowerCase()}`,
  confirmarAprobarTitulo: '¿Aprobar esta solicitud?',
  confirmarAprobarTexto: (nombre: string) => `${nombre} quedará activo en AuraPet.`,
  si: 'Sí, aprobar',
  no: 'Volver',
  rechazarTitulo: 'Rechazar la solicitud',
  rechazarDetalle: (nombre: string) => `Cuéntale a ${nombre} por qué no se aprobó.`,
  rechazarPlaceholder: 'Ej: no pudimos verificar el número de colegiado.',
  vacio: 'No hay solicitudes pendientes',
  sinResultados: 'Ninguna solicitud coincide con tu búsqueda.',
  error: 'No se pudo resolver la solicitud.',
  aprobarInvitar: 'Aprobar e invitar',
  sinCuenta: (correo: string) => `Postuló sin cuenta: se invitará a ${correo}`,
  confirmarInvitarTexto: (nombre: string, correo: string) =>
    `${nombre} quedará activo y le enviaremos una invitación a ${correo} para que cree su contraseña (si ya tiene cuenta, se la vinculamos).`,
  confirmarRechazarRefugioTitulo: '¿Rechazar este refugio?',
  confirmarRechazarRefugioTexto: (nombre: string) => `${nombre} no aparecerá en AuraPet. Puede volver a postular más adelante.`,
  siRechazar: 'Sí, rechazar',
  invitado: (correo: string) => `Refugio aprobado. Enviamos la invitación a ${correo}.`,
  vinculado: (correo: string) => `Refugio aprobado y vinculado a la cuenta de ${correo}.`,
} as const;

export const FILTROS_APROBACIONES: OpcionPildora<FiltroAprobaciones>[] = [
  { valor: 'todas', texto: 'Todas' },
  { valor: 'centro', texto: 'Centros' },
  { valor: 'veterinario', texto: 'Veterinarios' },
  { valor: 'solicitud_centro', texto: 'Solicitudes' },
  { valor: 'refugio', texto: 'Refugios' },
];

export const TEXTOS_MENSAJES = {
  titulo: 'Mensajes',
  buscar: 'Buscar por nombre, correo o asunto',
  responder: 'Responder por correo',
  marcarRespondido: 'Marcar respondido',
  cerrar: 'Cerrar',
  reabrir: 'Reabrir',
  verMas: 'Ver mensaje',
  verMenos: 'Ocultar',
  asuntoRespuesta: (asunto: string) => `Re: ${asunto} — AuraPet`,
  vacio: 'No hay mensajes en este filtro',
  sinResultados: 'Ningún mensaje coincide con tu búsqueda.',
  error: 'No se pudo actualizar el mensaje.',
} as const;

export const FILTROS_MENSAJES: OpcionPildora<FiltroMensajes>[] = [
  { valor: 'pendiente', texto: 'Pendientes' },
  { valor: 'respondido', texto: 'Respondidos' },
  { valor: 'cerrado', texto: 'Cerrados' },
];

export const ESTADO_ELIMINACION_LABEL: Record<EstadoSolicitudEliminacion, string> = {
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
};

export const TEXTOS_ELIMINACIONES = {
  titulo: 'Eliminaciones',
  aprobar: 'Desactivar cuenta',
  rechazar: 'Rechazar',
  sinMotivo: 'No indicó un motivo.',
  confirmarTitulo: '¿Desactivar esta cuenta?',
  confirmarTexto: (nombre: string) => `${nombre} ya no podrá ingresar. Su historial médico se conserva.`,
  si: 'Sí, desactivar',
  no: 'Volver',
  rechazarTitulo: 'Rechazar la solicitud',
  rechazarDetalle: 'La persona verá esta respuesta.',
  rechazarPlaceholder: 'Ej: tienes citas pendientes; cancélalas primero.',
  vacio: 'No hay solicitudes de eliminación',
  error: 'No se pudo resolver la solicitud.',
} as const;

export const TEXTOS_SOLICITUDES_PLAN = {
  titulo: 'Cambios de plan',
  cambio: (actual: string, nuevo: string) => `${actual} → ${nuevo}`,
  pedidoPor: (nombre: string) => `Lo pidió ${nombre}`,
  activar: 'Activar plan',
  rechazar: 'Rechazar',
  confirmarActivarTitulo: '¿Activar el plan?',
  confirmarActivarTexto: (centro: string, plan: string) => `${centro} pasará al plan ${plan} y renovará en 1 mes.`,
  confirmarRechazarTitulo: '¿Rechazar la solicitud?',
  confirmarRechazarTexto: (centro: string) => `${centro} seguirá con su plan actual.`,
  si: 'Sí',
  no: 'Volver',
  vacio: 'No hay cambios de plan pendientes',
  error: 'No se pudo resolver la solicitud de plan.',
} as const;

// ─── Atención desde el celular (fase 2) ─────────────────────────────────

/** Prefijo de los borradores guardados en el teléfono (AsyncStorage). */
export const PREFIJO_BORRADOR = 'aurapet:borrador:';
export const PASO_PESO_KG = 0.1;
export const MAX_DESCRIPCION_ATENCION = 1000;

export const TEXTOS_ATENCION = {
  titulo: 'Atención en curso',
  tituloCorto: 'Atención', // en el encabezado, junto a "En consulta · 18 min"
  enConsulta: (min: number) => `En consulta · ${min} min`,
  dueno: (nombre: string) => `Dueño/a: ${nombre}`,
  alergia: (a: string) => `Alérgico a ${a.toLowerCase()}`,
  motivo: 'Motivo de la consulta',
  queHacer: '¿Qué quieres hacer?',
  registrar: 'Registrar atención',
  registrarDetalle: 'Diagnóstico y tratamiento',
  receta: 'Receta',
  recetaDetalle: (n: number) => (n === 0 ? 'Medicamentos' : n === 1 ? '1 medicamento' : `${n} medicamentos`),
  derivar: 'Derivar',
  derivarDetalle: 'A un especialista',
  derivada: 'Derivado',
  hecho: 'Hecho',
  seGuarda: 'Todo lo que escribes se guarda en el teléfono hasta enviarlo',
  terminar: 'Terminar atención',
  terminando: 'Terminando…',
  errorTerminar: 'No se pudo terminar la atención.',
  noEncontrada: 'Esta cita ya no está en curso.',
  volverAgenda: 'Volver a la agenda',
} as const;

export const CONFIRMAR_TERMINAR_SIN_REGISTRO = {
  titulo: '¿Terminar sin registrar?',
  mensaje: 'Todavía no registras la atención en la ficha. Puedes hacerlo después desde la ficha del paciente.',
  textoSi: 'Terminar igual',
  textoNo: 'Volver',
};

export const TEXTOS_SIN_CONEXION = {
  aviso: 'Sin conexión. Guardamos tu borrador; se enviará al reintentar',
  reintentar: 'Reintentar',
  reintentando: 'Enviando…',
  guardado: 'Borrador guardado hace un momento',
  guardadoA: (hora: string) => `Borrador guardado a las ${hora}`,
} as const;

export const TIPOS_REGISTRO_ATENCION: readonly { valor: TipoRegistro; texto: string; icono: NombreIcono }[] = [
  { valor: 'diagnostico', texto: 'Diagnóstico', icono: 'estetoscopio' },
  { valor: 'control', texto: 'Control', icono: 'reloj' },
  { valor: 'vacuna', texto: 'Vacuna', icono: 'jeringa' },
  { valor: 'cirugia', texto: 'Cirugía', icono: 'tijeras' },
  { valor: 'otro', texto: 'Otro', icono: 'ficha' },
];

export const TEXTOS_REGISTRO_ATENCION = {
  titulo: 'Registrar atención',
  tipo: 'Tipo de atención',
  fecha: 'Fecha',
  fechaAyuda: 'Formato dd-mm-aaaa',
  queEncontraste: '¿Qué encontraste?',
  queEncontrastePlaceholder: 'Ej: dermatitis alérgica en zona abdominal, sin signos de infección',
  tratamiento: 'Tratamiento (opcional)',
  tratamientoPlaceholder: 'Ej: baño medicado 2 veces por semana',
  proximaDosis: 'Próxima dosis (opcional)',
  peso: 'Peso de hoy',
  sinPeso: 'Sin registrar',
  guardar: 'Guardar atención',
  guardando: 'Guardando…',
  faltaDescripcion: 'Escribe lo que encontraste.',
  fechaInvalida: 'Revisa la fecha (dd-mm-aaaa).',
  error: 'No se pudo guardar la atención.',
} as const;

export const MEDICAMENTO_VACIO = { nombre: '', dosis: '', frecuencia: '', duracion: '' };
export const RECETA_VACIA: DatosRecetaAtencion = { medicamentos: [], indicaciones: '', proximoControl: '' };

export const TEXTOS_RECETA_ATENCION = {
  titulo: 'Nueva receta',
  subtitulo: (mascota: string, veterinario: string, fecha: string) => `${mascota} · ${veterinario} · ${fecha}`,
  medicamentos: 'Medicamentos',
  agregar: 'Agregar medicamento',
  sinMedicamentos: 'Agrega al menos un medicamento.',
  indicaciones: 'Indicaciones',
  indicacionesPlaceholder: 'Ej: evitar paseos por pasto alto. Volver si hay heridas abiertas.',
  proximoControl: 'Próximo control (opcional)',
  guardar: 'Guardar y compartir PDF',
  guardando: 'Guardando…',
  error: 'No se pudo guardar la receta.',
  fechaInvalida: 'Revisa la fecha del próximo control (dd-mm-aaaa).',
  // Hoja del medicamento
  nuevoMedicamento: 'Nuevo medicamento',
  editarMedicamento: 'Editar medicamento',
  nombre: 'Medicamento',
  nombrePlaceholder: 'Ej: Apoquel 5,4 mg',
  dosis: 'Dosis',
  dosisPlaceholder: 'Ej: 1 comprimido',
  frecuencia: 'Frecuencia',
  frecuenciaPlaceholder: 'Ej: cada 12 horas',
  duracion: 'Duración',
  duracionPlaceholder: 'Ej: 14 días',
  listo: 'Listo',
  faltanDatos: 'Completa los 4 datos del medicamento.',
  editar: 'Editar',
  quitar: 'Quitar',
  // Lista
  listaTitulo: 'Receta',
  lista: '¡Receta lista!',
  listaTexto: (mascota: string, dueno: string) => `La guardamos en la ficha de ${mascota}. ${dueno} también la verá en su app.`,
  volver: 'Volver a la atención',
  errorPdf: 'No se pudo generar el PDF.',
} as const;

export const CANALES_RECETA: Record<CanalReceta, { texto: string; icono: NombreIcono; color: string; fondo: string }> = {
  whatsapp: { texto: 'WhatsApp', icono: 'mensaje', color: '#FFFFFF', fondo: '#25D366' },
  correo: { texto: 'Correo', icono: 'correo', color: '#0F8F80', fondo: '#DDF3EE' },
  guardar: { texto: 'Guardar PDF', icono: 'descarga', color: '#6D5BD0', fondo: '#E9E4FB' },
};

export const MODOS_DERIVACION: readonly { valor: TipoDestinoDerivacion; texto: string }[] = [
  { valor: 'veterinario', texto: 'Profesionales' },
  { valor: 'centro', texto: 'Centros' },
];

export const DERIVACION_VACIA: DatosDerivacionAtencion = { destino: null, motivo: '' };

export const TEXTOS_DERIVAR_ATENCION = {
  titulo: 'Derivar',
  queEspecialidad: '¿Qué especialidad necesita?',
  queEspecialidadAyuda: 'Elige una o más para ver quién puede recibirlo',
  resumen: (n: number, tipo: TipoDestinoDerivacion, especialidades: string[]) => {
    const quien = tipo === 'veterinario' ? (n === 1 ? 'profesional' : 'profesionales') : n === 1 ? 'centro' : 'centros';
    return especialidades.length ? `${n} ${quien} con ${especialidades.join(' y ')}` : `${n} ${quien}`;
  },
  independiente: 'Independiente',
  sinCoincidencias: 'Nadie tiene todas esas especialidades. Prueba quitando alguna.',
  sinDestinos: 'Todavía no hay a quién derivar.',
  motivo: 'Motivo de la derivación',
  motivoPlaceholder: 'Ej: dermatitis que no responde al tratamiento; sugiero evaluación especializada',
  enviar: 'Enviar derivación',
  enviando: 'Enviando…',
  faltaDestino: 'Elige a quién derivar.',
  faltaMotivo: 'Escribe el motivo de la derivación.',
  error: 'No se pudo enviar la derivación.',
  cargando: 'Cargando colegas…',
  errorCarga: 'No pudimos cargar a quién derivar.',
} as const;

export const TEXTOS_MIS_ESPECIALIDADES = {
  titulo: 'Mis especialidades',
  bajada: 'Marca todas las que ofreces. Los dueños te encontrarán cuando busquen esa especialidad.',
  general: 'Medicina general la tienes siempre',
  otra: 'Otra especialidad (opcional)',
  otraPlaceholder: 'Ej: Fisioterapia',
  seleccionadas: (n: number) => (n === 1 ? '1 seleccionada' : `${n} seleccionadas`),
  guardar: 'Guardar',
  guardando: 'Guardando…',
  guardado: '¡Listo! Guardamos tus especialidades.',
  error: 'No se pudieron guardar tus especialidades.',
  cargando: 'Cargando especialidades…',
} as const;

/** Colores que se turnan en las tarjetas de especialidades. */
export const TONOS_ESPECIALIDADES: TonoTarjeta[] = ['durazno', 'menta', 'lavanda', 'crema'];


// ─── Adopción (Fase 3; textos y reglas iguales a /adopta en la web) ─────

export const OPCIONES_SI_NO: readonly OpcionConIcono<'si' | 'no'>[] = [
  { valor: 'si', texto: 'Sí' },
  { valor: 'no', texto: 'No' },
];

export const BUCKET_ADOPCIONES = 'adopciones';
export const CLAVE_GUARDADOS_ADOPCION = 'aurapet:adopciones-guardadas';
export const RUTA_WEB_SUMATE_REFUGIO = '/adopta/refugios/sumate';
export const rutaWebFichaAdopcion = (id: number) => `/adopta/${id}`;

export const EDAD_SENIOR_ADOPCION: Record<EspecieAdopcion, number> = { perro: 8, gato: 10, otro: 8 };
export const RAZA_SIN_INDICAR: Record<SexoAdopcion, string> = { macho: 'Mestizo', hembra: 'Mestiza' };
export const EDAD_DESCONOCIDA = 'Edad por confirmar';
export const NIVEL_MAXIMO_RASGO = 5;
export const COLUMNAS_ADOPTA = 2;
export const PROPORCION_GALERIA_ADOPCION = 1; // alto de las fotos de la ficha respecto del ancho
export const SEPARACION_GRILLA_ADOPTA = 12;

export const VISTAS_ADOPTA: readonly { valor: VistaAdopta; texto: string }[] = [
  { valor: 'animales', texto: 'Animales' },
  { valor: 'refugios', texto: 'Refugios' },
];

export const OPCIONES_ESPECIE_ADOPCION: readonly OpcionConIcono<FiltroEspecieAdopcion>[] = [
  { valor: 'todos', texto: 'Todos', icono: 'huella' },
  { valor: 'perro', texto: 'Perros', icono: 'perro' },
  { valor: 'gato', texto: 'Gatos', icono: 'gato' },
  { valor: 'otro', texto: 'Otros', icono: 'hueso' },
];
export const ICONO_ESPECIE_ADOPCION: Record<EspecieAdopcion, NombreIcono> = { perro: 'perro', gato: 'gato', otro: 'huella' };

export const OPCIONES_TAMANO_ADOPCION: readonly OpcionConIcono<TamanoAdopcion>[] = [
  { valor: 'pequeno', texto: 'Pequeño' },
  { valor: 'mediano', texto: 'Mediano' },
  { valor: 'grande', texto: 'Grande' },
];
export const OPCIONES_ETAPA_ADOPCION: readonly OpcionConIcono<EtapaAdopcion>[] = [
  { valor: 'cachorro', texto: 'Cachorro' },
  { valor: 'adulto', texto: 'Adulto' },
  { valor: 'senior', texto: 'Senior' },
];
export const OPCIONES_SEXO_ADOPCION: readonly OpcionConIcono<SexoAdopcion>[] = [
  { valor: 'hembra', texto: 'Hembra' },
  { valor: 'macho', texto: 'Macho' },
];
export const TAMANO_ADOPCION_TEXTO: Record<TamanoAdopcion, string> = { pequeno: 'Pequeño', mediano: 'Mediano', grande: 'Grande' };
export const SEXO_ADOPCION_TEXTO: Record<SexoAdopcion, string> = { macho: 'Macho', hembra: 'Hembra' };

export const FILTROS_ADOPCION_VACIOS: FiltrosAdopcion = {
  especie: 'todos',
  soloRevisados: false,
  soloGuardados: false,
  tamano: null,
  etapa: null,
  sexo: null,
  comuna: null,
  refugioId: null,
};

export const TEXTOS_ADOPTA = {
  titulo: 'Adopta',
  subtitulo: 'Cambia dos vidas',
  cifras: { esperando: 'esperan hogar', revisados: 'revisados', conFamilia: 'con familia' },
  buscar: 'Busca por nombre, raza o comuna',
  masFiltros: 'Filtros',
  filtrosTitulo: 'Filtrar animales',
  soloRevisados: 'Solo revisados por veterinario',
  soloGuardados: 'Solo mis guardados',
  tamano: 'Tamaño',
  etapa: 'Edad',
  sexo: 'Sexo',
  comuna: 'Comuna',
  limpiar: 'Limpiar',
  verResultados: (n: number) => (n === 1 ? 'Ver 1 animal' : `Ver ${n} animales`),
  resultados: (n: number) => (n === 1 ? '1 animal' : `${n} animales`),
  sinResultados: 'No encontramos animales con esos filtros',
  sinGuardados: 'Toca el corazón de un animal para guardarlo aquí',
  sinPublicaciones: 'Todavía no hay animales en adopción. ¡Pronto llegarán los primeros!',
  errorCarga: 'No pudimos cargar los animales en adopción.',
  cargando: 'Buscando animales…',
  revisado: 'Revisado por veterinario',
  revisadoCorto: 'Revisado',
  solidario: 'Chequeo solidario',
  enProceso: 'En proceso',
  guardar: 'Guardar',
  quitarGuardado: 'Quitar de guardados',
  darEnAdopcionTitulo: '¿Necesitas darle un hogar a un animal?',
  darEnAdopcionTexto: 'Publícalo gratis: las familias postulan y tú eliges con calma.',
  publicar: 'Dar en adopción',
  misPublicaciones: 'Mis publicaciones',
  gratuitaTitulo: 'En AuraPet la adopción es gratuita',
  gratuitaTexto: 'Nunca pagues por un animal. Si te piden dinero, repórtalo desde su ficha.',
  refugioFiltro: (nombre: string) => `Animales de ${nombre}`,
  quitarRefugio: 'Ver todos',
} as const;

// --- Ficha ---
export const ETIQUETAS_RASGOS_ADOPCION: Record<RasgoAdopcion, string> = {
  energia: 'Energía',
  sociablePerros: 'Con perros',
  sociableGatos: 'Con gatos',
  sociableNinos: 'Con niños',
};
export const RASGOS_ADOPCION: readonly RasgoAdopcion[] = ['energia', 'sociablePerros', 'sociableGatos', 'sociableNinos'];
export const RASGOS_ADOPCION_VACIOS: RasgosAdopcion = { energia: null, sociablePerros: null, sociableGatos: null, sociableNinos: null };

export const TIPO_PUBLICADOR_TEXTO: Record<string, string> = {
  centro: 'Centro veterinario',
  veterinario: 'Veterinario de la red AuraPet',
  equipo: 'Equipo AuraPet',
  refugio: 'Refugio verificado',
  particular: 'Rescatista particular',
};

export const TEXTOS_FICHA_ADOPCION = {
  cargando: 'Cargando la ficha…',
  noEncontrada: 'No encontramos este animal. Puede que ya no esté publicado.',
  volverAdopta: 'Volver a Adopta',
  personalidad: 'Personalidad',
  comoEs: '¿Cómo es?',
  salud: 'Salud',
  historia: 'Su historia',
  vacunas: 'Vacunas',
  alDia: 'Al día',
  pendientes: 'Pendientes',
  esterilizado: (sexo: SexoAdopcion) => (sexo === 'hembra' ? 'Esterilizada' : 'Esterilizado'),
  microchip: 'Microchip',
  peso: 'Peso',
  alergias: 'Alergias',
  si: 'Sí',
  no: 'No',
  sinDato: 'Sin información',
  sinAlergias: 'Ninguna conocida',
  chequeoTitulo: 'Chequeo veterinario',
  chequeoPor: (vet: string, centro: string | null, fecha: string) => `${vet}${centro ? ` · ${centro}` : ''} · ${fecha}`,
  chequeoSolicitado: 'Revisión veterinaria solicitada',
  chequeoSolicitadoDetalle: 'Un veterinario de la red AuraPet lo revisará pronto.',
  publicadoPor: 'Lo cuida',
  adopciones: (n: number) => (n === 1 ? '1 adopción en AuraPet' : `${n} adopciones en AuraPet`),
  quieroAdoptar: (sexo: SexoAdopcion) => (sexo === 'hembra' ? 'Quiero adoptarla' : 'Quiero adoptarlo'),
  botonDeshabilitado: {
    mia: 'Es tu publicación',
    postulado: 'Ya postulaste ✓',
    en_proceso: 'En proceso de adopción',
    adoptado: '¡Ya tiene familia! 🧡',
  } as Record<Exclude<EstadoBotonAdoptar, 'disponible'>, string>,
  verPostulaciones: 'Ver postulaciones',
  compartir: 'Compartir',
  compartirTexto: (nombre: string, url: string) => `${nombre} busca hogar en AuraPet 🐾 ${url}`,
  reportar: 'Reportar publicación',
  ley: 'Al adoptar, actualiza el registro y el microchip a tu nombre (Ley 21.020).',
  fotoDe: (nombre: string, n: number) => `Foto ${n} de ${nombre}`,
} as const;

// --- Postular ---
export const OPCIONES_VIVIENDA_ADOPCION: readonly OpcionConIcono<ViviendaAdopcion>[] = [
  { valor: 'casa', texto: 'Casa', icono: 'inicio' },
  { valor: 'departamento', texto: 'Departamento', icono: 'centro' },
  { valor: 'parcela', texto: 'Parcela', icono: 'huella' },
];
export const OPCIONES_TENENCIA_ADOPCION: readonly OpcionConIcono<TenenciaAdopcion>[] = [
  { valor: 'propia', texto: 'Propia' },
  { valor: 'arrendada', texto: 'Arrendada' },
  { valor: 'familiar', texto: 'De un familiar' },
];
export const PASOS_POSTULACION = ['Tu hogar', 'Tu familia', 'Experiencia', 'Confirmar'] as const;

export const DATOS_POSTULACION_VACIOS: DatosPostulacionAdopcion = {
  vivienda: null,
  tienePatio: null,
  tenencia: null,
  permitenMascotas: null,
  hayNinos: null,
  edadesNinos: '',
  otrasMascotas: null,
  cualesMascotas: '',
  todosDeAcuerdo: null,
  experiencia: '',
  motivo: '',
  aceptaCompromiso: false,
};
export const MIN_MOTIVO_POSTULACION = 10;
export const MAX_TEXTO_POSTULACION = 800;

export const TEXTOS_POSTULACION = {
  titulo: (nombre: string) => `Adoptar a ${nombre}`,
  vivienda: '¿Dónde vives?',
  patio: '¿Tiene patio?',
  tenencia: 'La vivienda es…',
  permitenMascotas: '¿Te permiten tener mascotas?',
  hayNinos: '¿Hay niños en casa?',
  edadesNinos: 'Edades de los niños',
  edadesPlaceholder: 'Ej: 5 y 8 años',
  otrasMascotas: '¿Hay otras mascotas en casa?',
  cualesMascotas: '¿Cuáles?',
  cualesPlaceholder: 'Ej: un gato de 3 años',
  todosDeAcuerdo: '¿Todos en casa están de acuerdo?',
  experiencia: '¿Has tenido mascotas antes? (opcional)',
  experienciaPlaceholder: 'Ej: tuve una perrita por 12 años…',
  motivo: '¿Por qué quieres adoptar?',
  motivoPlaceholder: 'Cuéntale a quien lo cuida qué le puedes ofrecer',
  resumen: 'Revisa tu postulación',
  avisoContacto: 'Al enviar, quien lo publicó podrá ver tu correo y el teléfono de tu perfil para contactarte.',
  compromiso: (nombre: string) =>
    `Me comprometo a cuidar a ${nombre}, llevarle a sus controles y actualizar su registro y microchip a mi nombre.`,
  si: 'Sí',
  no: 'No',
  continuar: 'Continuar',
  enviar: 'Enviar postulación',
  enviando: 'Enviando…',
  error: 'No se pudo enviar la postulación.',
  enviadaTitulo: '¡Postulación enviada!',
  enviadaTexto: (quien: string) => `${quien} revisará tu solicitud y te contactará para coordinar el siguiente paso.`,
  volverFicha: 'Volver a la ficha',
  sinDato: '—',
  errores: {
    elegir: 'Elige una opción',
    edades: 'Cuéntanos las edades',
    cuales: 'Cuéntanos qué mascotas',
    motivo: `Escribe al menos ${MIN_MOTIVO_POSTULACION} caracteres`,
    compromiso: 'Debes aceptar el compromiso para enviar',
  },
} as const;

// --- Reportar ---
export const MOTIVOS_REPORTE: readonly OpcionMotivoReporte[] = [
  { valor: 'dinero', texto: 'Piden dinero', icono: 'etiqueta', color: '#E86F5C', fondo: '#FCE9E5' },
  { valor: 'estafa', texto: 'Posible estafa', icono: 'alerta', color: '#C77A12', fondo: '#FDF0DC' },
  { valor: 'riesgo', texto: 'Animal en riesgo', icono: 'corazon', color: '#D64545', fondo: '#FCE8E8' },
  { valor: 'inapropiado', texto: 'Fotos inapropiadas', icono: 'imagen', color: '#7A5FE0', fondo: '#EEE9FD' },
  { valor: 'adoptado', texto: 'Ya fue adoptado', icono: 'citas', color: '#5F6E82', fondo: '#ECEFF3' },
  { valor: 'otro', texto: 'Otro motivo', icono: 'mensaje', color: '#0F8F80', fondo: '#DDF3EE' },
];
export const MAX_COMENTARIO_REPORTE = 500;

export const TEXTOS_REPORTE = {
  titulo: 'Reportar publicación',
  subtitulo: (nombre: string) => `Sobre ${nombre}`,
  bajada: 'Tu reporte es anónimo para quien publicó. El equipo AuraPet lo revisa en menos de 24 horas.',
  pregunta: '¿Qué está pasando?',
  emergenciaTitulo: '¿Hay maltrato ahora mismo?',
  emergencia: 'Llama a Carabineros (133) o a la PDI (134).',
  comentario: 'Cuéntanos más (opcional)',
  comentarioPlaceholder: 'Lo que viste en la publicación o en la conversación',
  enviar: 'Enviar reporte',
  enviando: 'Enviando…',
  faltaMotivo: 'Elige qué está pasando',
  error: 'No se pudo enviar el reporte.',
  listoTitulo: '¡Gracias por avisarnos!',
  listoTexto: (numero: number) => `Recibimos tu reporte #${numero}. Lo revisaremos pronto y tomaremos medidas si corresponde.`,
  volver: 'Volver a la ficha',
} as const;

// --- Dar en adopción ---
export const MAX_FOTOS_ADOPCION = 6;
export const MAX_MB_FOTO_ADOPCION = 5;
export const CALIDAD_FOTO_ADOPCION = 0.7;
export const MAX_PERSONALIDAD_ADOPCION = 5;
export const MIN_HISTORIA_ADOPCION = 20;
export const OPCIONES_PERSONALIDAD_ADOPCION = [
  'Juguetón', 'Cariñoso', 'Tranquilo', 'Leal', 'Sociable', 'Curioso', 'Independiente',
  'Protector', 'Regalón', 'Ideal para departamento', 'Bueno con niños', 'Le gusta pasear',
] as const;
export const OPCIONES_ESPECIE_PUBLICAR: readonly OpcionConIcono<EspecieMascota>[] = [
  { valor: 'perro', texto: 'Perro', icono: 'perro' },
  { valor: 'gato', texto: 'Gato', icono: 'gato' },
  { valor: 'conejo', texto: 'Conejo', icono: 'huella' },
  { valor: 'ave', texto: 'Ave', icono: 'huella' },
  { valor: 'otro', texto: 'Otro', icono: 'huella' },
];
export const PASOS_PUBLICAR = ['Datos', 'Personalidad', 'Salud', 'Revisar'] as const;

export const DATOS_PUBLICAR_VACIOS: DatosPublicarAdopcion = {
  fotos: [],
  nombre: '',
  especie: null,
  sexo: null,
  anios: '',
  meses: '',
  tamano: null,
  comuna: '',
  solicitaChequeo: true,
  personalidad: [],
  rasgos: RASGOS_ADOPCION_VACIOS,
  frase: '',
  raza: '',
  pesoKg: '',
  vacunasAlDia: false,
  esterilizado: false,
  conMicrochip: false,
  alergias: '',
  historia: '',
  refugioId: null,
};

export const TEXTOS_PUBLICAR = {
  titulo: 'Dar en adopción',
  fotos: 'Fotos',
  fotosAyuda: (n: number) => `La primera es la principal (${n}/${MAX_FOTOS_ADOPCION})`,
  agregarFoto: 'Agregar foto',
  quitarFoto: 'Quitar foto',
  principal: 'Principal',
  hojaFoto: 'Agregar una foto',
  tomarFoto: 'Tomar foto',
  elegirGaleria: 'Elegir de la galería',
  sinPermisoCamara: 'Para tomar la foto, permite el uso de la cámara en los ajustes del teléfono.',
  sinPermisoGaleria: 'Para elegir la foto, permite el acceso a tus fotos en los ajustes del teléfono.',
  nombre: 'Nombre del animal',
  nombrePlaceholder: 'Ej: Luna',
  especie: 'Especie',
  sexo: 'Sexo',
  edad: 'Edad aproximada',
  anios: 'Años',
  meses: 'Meses',
  tamano: 'Tamaño',
  comuna: 'Comuna',
  comunaPlaceholder: 'Ej: Ñuñoa',
  aNombreDe: 'Publicar a nombre de',
  miNombre: 'Mi nombre',
  revision: 'Quiero que un veterinario de AuraPet lo revise',
  sinRevision: 'Sin revisión veterinaria por ahora',
  personalidad: `Personalidad (hasta ${MAX_PERSONALIDAD_ADOPCION})`,
  rasgos: '¿Cómo es? (1 = poco, 5 = mucho)',
  noSe: 'No sé',
  frase: 'Una frase en primera persona (opcional)',
  frasePlaceholder: 'Ej: Me encanta dormir al sol',
  raza: 'Raza (opcional)',
  razaPlaceholder: 'Ej: Mestizo, Labrador',
  peso: 'Peso aproximado (kg, opcional)',
  vacunas: 'Tiene las vacunas al día',
  esterilizado: 'Está esterilizado/a',
  microchip: 'Tiene microchip',
  alergias: 'Alergias o condiciones (opcional)',
  historia: 'Su historia',
  historiaPlaceholder: '¿Cómo llegó contigo? ¿Qué familia le vendría bien?',
  revisaTitulo: 'Así se verá en Adopta',
  continuar: 'Continuar',
  publicar: 'Publicar',
  publicando: 'Publicando…',
  error: 'No se pudo publicar. Intenta de nuevo.',
  listoTitulo: (nombre: string) => `¡${nombre} ya está publicado!`,
  listoTexto: 'Te avisaremos cuando alguien postule. Si pediste revisión, un veterinario de la red lo verá pronto.',
  verPublicacion: 'Ver la publicación',
  errores: {
    fotos: 'Sube al menos una foto',
    fotoPeso: `Cada foto puede pesar hasta ${MAX_MB_FOTO_ADOPCION} MB`,
    fotoMaximo: `Puedes subir hasta ${MAX_FOTOS_ADOPCION} fotos`,
    nombre: 'Escribe su nombre',
    elegir: 'Elige una opción',
    edad: 'Indica años o meses (aproximado)',
    comuna: 'Escribe la comuna',
    personalidad: 'Elige al menos una',
    maxPersonalidad: `Puedes elegir hasta ${MAX_PERSONALIDAD_ADOPCION}`,
    peso: 'Escribe un peso válido',
    historia: `Cuéntanos un poco de su historia (mín. ${MIN_HISTORIA_ADOPCION} caracteres)`,
  },
} as const;

// --- Mis publicaciones y elegir familia ---
export const OPCIONES_FILTRO_PUBLICACIONES: readonly { valor: FiltroPublicaciones; texto: string }[] = [
  { valor: 'activos', texto: 'Activos' },
  { valor: 'en_proceso', texto: 'En proceso' },
  { valor: 'adoptados', texto: 'Adoptados' },
  { valor: 'retirados', texto: 'Retirados' },
];
export const FILTROS_PUBLICACIONES: Record<FiltroPublicaciones, (estado: EstadoPublicacion) => boolean> = {
  activos: (e) => e === 'publicada',
  en_proceso: (e) => e === 'en_proceso',
  adoptados: (e) => e === 'adoptada',
  retirados: (e) => e === 'retirada',
};
export const ESTILO_ESTADO_PUBLICACION: Record<EstadoPublicacion, { texto: string; fondo: string; color: string }> = {
  publicada: { texto: 'Publicado', fondo: '#E3F6EA', color: '#1E8A4C' },
  en_proceso: { texto: 'En proceso', fondo: '#E3EEFB', color: '#2F6FB5' },
  adoptada: { texto: 'Adoptado 🎉', fondo: '#FFE6D5', color: '#D9693A' },
  retirada: { texto: 'Retirado', fondo: '#EDEFF2', color: '#4B5563' },
};
export const ESTILO_ESTADO_POSTULACION: Record<EstadoPostulacion, { texto: string; fondo: string; color: string }> = {
  pendiente: { texto: 'Nueva', fondo: '#FFF1D6', color: '#B7791F' },
  aceptada: { texto: 'Elegida', fondo: '#E3F6EA', color: '#1E8A4C' },
  rechazada: { texto: 'Rechazada', fondo: '#EDEFF2', color: '#4B5563' },
  retirada: { texto: 'Retirada', fondo: '#EDEFF2', color: '#4B5563' },
};
export const HITOS_CAMINO_CASA: readonly { hito: HitoCaminoCasa; texto: string }[] = [
  { hito: 'publicada', texto: 'Publicado' },
  { hito: 'revisada', texto: 'Revisado' },
  { hito: 'postulaciones', texto: 'Postulan' },
  { hito: 'elegida', texto: 'Elegida' },
  { hito: 'adoptada', texto: 'Adoptado' },
];

export const TEXTOS_MIS_PUBLICACIONES = {
  titulo: 'Publicaciones',
  subtitulo: 'Tus animales en adopción',
  cargando: 'Cargando tus publicaciones…',
  vacioTitulo: 'Aún no publicas animales',
  vacioDetalle: 'Cuando des uno en adopción, aquí verás quién postula y podrás elegir familia.',
  vacioFiltro: 'No tienes publicaciones en este estado',
  postulaciones: (total: number, nuevas: number) =>
    `${total === 1 ? '1 postulación' : `${total} postulaciones`}${nuevas ? ` · ${nuevas} ${nuevas === 1 ? 'nueva' : 'nuevas'}` : ''}`,
  sinPostulaciones: 'Sin postulaciones aún',
  familia: (nombre: string) => `Con ${nombre}`,
  aNombreDe: (refugio: string) => `A nombre de ${refugio}`,
  retirar: 'Retirar',
  cancelar: 'Cancelar',
  republicar: 'Volver a publicar',
  confirmarRetiro: (nombre: string) => `¿Retirar a ${nombre} de Adopta? Podrás volver a publicarlo cuando quieras.`,
  oculta: 'Oculta por el equipo AuraPet',
  advertencia: 'Aviso del equipo AuraPet',
  errorAccion: 'No se pudo actualizar la publicación.',
} as const;

export const TEXTOS_POSTULANTES = {
  titulo: 'Elegir familia',
  verFicha: 'Ver su ficha',
  cargando: 'Cargando postulaciones…',
  error: 'No pudimos cargar las postulaciones.',
  sinPostulaciones: 'Todavía nadie postula. Comparte la publicación para que llegue a más personas.',
  resumen: (total: number) => (total === 1 ? '1 persona quiere adoptarlo' : `${total} personas quieren adoptarlo`),
  guia: 'La afinidad es una guía: la decisión es tuya.',
  afinidad: 'afinidad',
  hogar: 'Su hogar',
  familia: 'Su familia',
  experiencia: 'Su experiencia',
  sinExperiencia: 'No contó experiencia previa.',
  porQue: 'Por qué quiere adoptar',
  match: '¿Por qué hacen match?',
  contactar: 'Contactar',
  rechazar: 'Rechazar',
  cancelar: 'Cancelar',
  elegir: 'Elegir esta familia',
  notaEsperan: 'Las demás postulaciones quedan en espera.',
  concretar: (nombre: string) => `Marcar a ${nombre} como adoptado`,
  confirmarRechazo: (nombre: string) => `¿Rechazar la postulación de ${nombre}?`,
  errorAccion: 'No se pudo guardar. Intenta de nuevo.',
  hace: (tiempo: string) => `Postuló ${tiempo}`,
  vivienda: { casa: 'Casa', departamento: 'Departamento', parcela: 'Parcela' } as Record<ViviendaAdopcion, string>,
  /** "Casa propia" pero "Departamento propio" */
  tenencia: (t: TenenciaAdopcion, masculino: boolean) =>
    ({ propia: masculino ? 'propio' : 'propia', arrendada: masculino ? 'arrendado' : 'arrendada', familiar: 'de un familiar' })[t],
  conPatio: 'con patio',
  sinPatio: 'sin patio',
  permiten: 'Le permiten mascotas',
  noPermiten: 'No le permiten mascotas',
  ninos: (edades: string | null) => (edades ? `Niños de ${edades}` : 'Hay niños'),
  sinNinos: 'Sin niños',
  mascotas: (cuales: string | null) => (cuales ? `Otras mascotas: ${cuales}` : 'Tiene otras mascotas'),
  sinMascotas: 'Sin otras mascotas',
  deAcuerdo: 'Todos en casa están de acuerdo',
  noDeAcuerdo: 'No todos en casa están de acuerdo',
  whatsappTexto: (animal: string) => `Hola, te escribo por tu postulación para adoptar a ${animal} en AuraPet 🐾`,
  correoAsunto: (animal: string) => `Tu postulación para adoptar a ${animal} — AuraPet`,
} as const;

export const TEXTOS_CONCRETAR = {
  titulo: (nombre: string) => `¡${nombre} tiene familia!`,
  quien: (persona: string) => `Lo adopta ${persona}`,
  testimonio: 'Cuéntanos cómo le va (opcional)',
  testimonioPlaceholder: 'Ej: ya se adaptó perfecto y ama el parque.',
  traspasar: 'Pasar su ficha a la cuenta de quien adopta',
  traspasarDetalle: 'Su historial y atenciones quedan en su nueva casa.',
  confirmar: 'Confirmar adopción 🎉',
  confirmando: 'Guardando…',
  error: 'No se pudo cerrar la adopción.',
} as const;
export const MAX_TESTIMONIO_ADOPCION = 280;

// Pesos del cálculo de afinidad (lib/afinidadAdopcion.ts), iguales a la web. Es una guía, no un filtro.
export const AFINIDAD = {
  base: 60,
  minimo: 5,
  maximo: 98,
  nivelAlto: 4,
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
  /** Desde cuánto el anillo se pinta verde (si no, ámbar). */
  umbralAlto: 70,
} as const;

export const TEXTOS_AFINIDAD = {
  ninosBien: (n: string, edades: string | null) => `${n} es sociable con niños${edades ? ` y hay niños de ${edades}` : ''}`,
  ninosMal: (n: string) => `${n} no se lleva tan bien con niños: conversen cómo sería la convivencia`,
  mascotasBien: (n: string) => `${n} se lleva bien con otros animales y hay más mascotas en casa`,
  mascotasMal: (n: string) => `${n} no es muy sociable con otros animales y hay mascotas en casa`,
  energiaConPatio: (n: string) => `${n} tiene mucha energía y hay patio para jugar`,
  energiaSinPatio: (n: string) => `${n} tiene energía alta y no hay patio: conversen sobre los paseos`,
  grandeEnDepto: (n: string) => `${n} es grande y viven en departamento`,
  permitenMascotas: 'En su arriendo le permiten mascotas',
  noPermitenMascotas: 'En su arriendo no le permiten mascotas',
  todosDeAcuerdo: 'Todos en casa están de acuerdo',
  noTodosDeAcuerdo: 'No todos en casa están de acuerdo',
  experiencia: 'Ya ha tenido mascotas',
} as const;

// --- Refugios ---
export const OPCIONES_FILTRO_REFUGIOS: readonly OpcionConIcono<FiltroRefugios>[] = [
  { valor: 'todos', texto: 'Todos', icono: 'casa' },
  { valor: 'abiertos', texto: 'Reciben', icono: 'check' },
  { valor: 'perros', texto: 'Perros', icono: 'perro' },
  { valor: 'gatos', texto: 'Gatos', icono: 'gato' },
];
export const ESTILO_RECEPCION_REFUGIO: Record<RecepcionRefugio, { texto: string; color: string; fondo: string }> = {
  abierto: { texto: 'Recibe animales', color: '#1E8A4C', fondo: '#E3F6EA' },
  limitado: { texto: 'Cupos limitados', color: '#B7791F', fondo: '#FFF1D6' },
  sin_cupos: { texto: 'Sin cupos', color: '#B54747', fondo: '#FDE7E7' },
};

export const TEXTOS_REFUGIOS = {
  cifras: { refugios: 'refugios', animales: 'animales', aliados: 'vets aliados' },
  buscar: 'Busca por nombre o comuna',
  cargando: 'Cargando refugios…',
  error: 'No pudimos cargar los refugios.',
  vacio: 'Todavía no hay refugios verificados.',
  sinResultados: 'No encontramos refugios con esos filtros',
  cupos: (ocupados: number, totales: number) => `${ocupados} de ${totales} cupos ocupados`,
  enAdopcion: (n: number) => (n === 1 ? '1 en adopción' : `${n} en adopción`),
  verAnimales: 'Ver sus animales',
  contactar: 'Contactar',
  whatsappTexto: (refugio: string) => `Hola ${refugio}, los encontré en AuraPet 🐾`,
  correoAsunto: 'Contacto desde AuraPet',
  sumateTitulo: '¿Tienes un refugio?',
  sumateTexto: 'Súmalo a AuraPet y publica a sus animales con el sello de refugio verificado.',
  sumate: 'Súmate a AuraPet',
} as const;

export const TEXTOS_HOJA_CONTACTO = {
  titulo: (nombre: string) => `Contactar a ${nombre}`,
  llamar: 'Llamar',
  whatsapp: 'WhatsApp',
  correo: 'Correo',
  sinDatos: 'No dejó datos de contacto.',
} as const;

// ─── Fase 4: moderación (superadmin) ────────────────────────────────────

export const OPCIONES_ESTADO_MODERACION: readonly { valor: EstadoCasoModeracion; texto: string }[] = [
  { valor: 'pendiente', texto: 'Por revisar' },
  { valor: 'resuelto', texto: 'Resueltos' },
  { valor: 'descartado', texto: 'Descartados' },
];

export const TEXTOS_MODERACION = {
  titulo: 'Moderación',
  subtitulo: 'Publicaciones reportadas',
  cargando: 'Cargando reportes…',
  error: 'No pudimos cargar los reportes.',
  vacio: {
    pendiente: 'No hay reportes por revisar. ¡Todo en orden!',
    resuelto: 'Todavía no hay casos resueltos.',
    descartado: 'No hay reportes descartados.',
  } as Record<EstadoCasoModeracion, string>,
  urgente: 'Urgente',
  prueba: 'Prueba',
  reportes: (n: number) => (n === 1 ? '1 reporte' : `${n} reportes`),
  publicado: (quien: string, hace: string) => `Publicado ${hace} por ${quien}`,
  historial: (publicaciones: number, previos: number) =>
    `${publicaciones} ${publicaciones === 1 ? 'publicación' : 'publicaciones'} · ${previos} ${previos === 1 ? 'reporte previo' : 'reportes previos'}`,
  loQueReportaron: 'Lo que reportaron',
  sinComentario: 'Sin comentario',
  ver: 'Ver',
  descartar: 'Descartar',
  advertir: 'Advertir',
  ocultar: 'Ocultar',
  decision: { ocultar: 'Publicación ocultada', advertir: 'Se advirtió a quien publicó', descartar: 'Reporte descartado' } as Record<DecisionModeracion, string>,
  confirmarDescartarTitulo: '¿Descartar los reportes?',
  confirmarDescartarTexto: (nombre: string) => `La publicación de ${nombre} sigue visible tal como está.`,
  si: 'Sí, descartar',
  no: 'Volver',
  modal: {
    advertir: {
      titulo: 'Advertir a quien publicó',
      detalle: 'Verá este aviso en "Mis publicaciones". La publicación sigue visible.',
      placeholder: 'Ej: agrega fotos reales del animal y quita el teléfono de la historia.',
      confirmar: 'Enviar advertencia',
    },
    ocultar: {
      titulo: 'Ocultar la publicación',
      detalle: 'Deja de verse en Adopta. Quien publicó verá el motivo (opcional).',
      placeholder: 'Ej: se pidió dinero por el animal.',
      confirmar: 'Ocultar publicación',
    },
  },
  errorAccion: 'No se pudo guardar la decisión.',
} as const;

// ─── Fase 4: Mi refugio ─────────────────────────────────────────────────

export const OPCIONES_RECEPCION_REFUGIO: readonly OpcionConIcono<RecepcionRefugio>[] = [
  { valor: 'abierto', texto: 'Recibe animales', icono: 'check' },
  { valor: 'limitado', texto: 'Cupos limitados', icono: 'relojArena' },
  { valor: 'sin_cupos', texto: 'Sin cupos', icono: 'cerrar' },
];
export const ESPERA_GUARDAR_CUPOS_MS = 700; // se guardan solos al dejar de tocar − / +

export const TEXTOS_MI_REFUGIO = {
  titulo: 'Mi refugio',
  subtitulo: (nombre: string) => `${nombre} · este mes`,
  cargando: 'Cargando tu refugio…',
  error: 'No pudimos cargar el refugio.',
  cifras: { publicados: 'publicados', postulaciones: 'postulaciones', adoptados: 'adoptados' }, // del mes
  cupos: 'Cupos ocupados',
  deTotal: (total: number) => `de ${total} cupos`,
  actualizado: (hace: string) => `Actualizado ${hace}`,
  guardando: 'Guardando…',
  recepcion: '¿Están recibiendo animales?',
  publicar: 'Publicar un animal',
  publicarDetalle: 'Toma las fotos con el celular y publícalo a nombre del refugio',
  animales: 'Sus animales',
  sinAnimales: 'Todavía no publican animales a nombre del refugio.',
  errorGuardar: 'No se pudo guardar. Intenta de nuevo.',
} as const;

// ─── Adopción solidaria (veterinario) ───────────────────────────────────

export const MAX_URGENTES_SOLIDARIA = 5;
export const MIN_RESUMEN_ATENCION_SOLIDARIA = 3;
export const MAX_RESUMEN_ATENCION_SOLIDARIA = 300;
export const PREFIJO_BORRADOR_SOLIDARIA = 'solidaria-';

export const PESTANAS_SOLIDARIA: readonly { valor: PestanaSolidaria; texto: string }[] = [
  { valor: 'esperando', texto: 'Esperando' },
  { valor: 'todos', texto: 'Todos' },
  { valor: 'mias', texto: 'Mis atenciones' },
];

export const ESTADOS_GENERALES_ATENCION: readonly OpcionConIcono<EstadoGeneralAtencion>[] = [
  { valor: 'sano', texto: 'Sano' },
  { valor: 'en_tratamiento', texto: 'En tratamiento' },
  { valor: 'en_observacion', texto: 'En observación' },
];

export const DATOS_ATENCION_SOLIDARIA_VACIOS = {
  solidario: true,
  monto: '',
  centroId: null,
  resumen: '',
  estadoGeneral: null,
  procedimientos: [] as ProcedimientoFicha[],
  pesoKg: null,
};

export const TEXTOS_SOLIDARIA = {
  titulo: 'Adopción solidaria',
  subtitulo: 'Tu atención les abre la puerta a una familia',
  atendidosGratis: (n: number) => (n === 1 ? '1 animal atendido gratis' : `${n} animales atendidos gratis`),
  conFamilia: (n: number) => (n === 1 ? '1 ya tiene familia' : `${n} ya tienen familia`),
  aliado: 'Aliado solidario',
  pestanaConCantidad: (texto: string, n: number) => `${texto} (${n})`,
  urgentes: 'Más urgentes',
  esperandoHace: (dias: number) => (dias <= 0 ? 'Publicado hoy' : dias === 1 ? 'Esperando hace 1 día' : `Esperando hace ${dias} días`),
  enTuComuna: 'En tu comuna',
  revisionSolicitada: 'Revisión solicitada',
  enProceso: 'En proceso',
  atender: 'Atender',
  atendido: 'Ya lo atendiste',
  atendidoEl: (fecha: string) => `Atendido el ${fecha}`,
  solidaria: 'Solidaria',
  conCosto: 'Con costo',
  aDomicilio: 'A domicilio',
  vacio: {
    esperando: 'Ningún animal está esperando atención. ¡Gracias por estar atento!',
    todos: 'No hay animales en adopción por ahora.',
    mias: 'Todavía no registras atenciones. Cuando atiendas a uno, aparecerá aquí.',
  } as Record<PestanaSolidaria, string>,
  cargando: 'Cargando animales…',
  error: 'No pudimos cargar los animales en adopción.',
  aviso: 'Las atenciones solidarias son gratuitas para el refugio; las con costo se coordinan fuera de AuraPet.',
} as const;

export const TEXTOS_ATENCION_SOLIDARIA = {
  titulo: 'Registrar atención',
  cargando: 'Cargando su ficha…',
  noEncontrado: 'Este animal ya no está en adopción.',
  alergia: (texto: string) => `Alergia: ${texto}`,
  comoFue: '¿Cómo fue la atención?',
  solidaria: 'Solidaria (gratis)',
  conCosto: 'Con costo',
  conCostoDetalle: 'se coordina fuera de AuraPet',
  monto: 'Monto aproximado (opcional)',
  montoPlaceholder: 'Ej: 15000',
  donde: 'Centro donde atendiste',
  resumen: 'Resumen del chequeo',
  resumenPlaceholder: 'Ej: sana, desparasitada, lista para adoptar',
  estado: 'Estado general',
  ficha: 'Su ficha',
  fichaAyuda: 'Marca lo que hiciste hoy. Lo que ya estaba en su ficha queda marcado.',
  procedimientos: {
    vacunas: 'Vacunas al día',
    desparasitacion: 'Desparasitado/a',
    esterilizacion: 'Esterilizado/a',
    microchip: 'Microchip',
  } as Record<ProcedimientoFicha, string>,
  yaEnFicha: 'Ya en su ficha',
  peso: 'Peso',
  sinPeso: 'Sin registrar',
  aviso: 'Al guardar, se actualiza su ficha en Adopta y aparece el sello Revisado por veterinario.',
  guardar: 'Guardar atención',
  guardando: 'Guardando…',
  faltaEstado: 'Elige el estado general',
  faltaResumen: `Escribe un resumen (mín. ${MIN_RESUMEN_ATENCION_SOLIDARIA} caracteres)`,
  error: 'No se pudo guardar la atención.',
  // Confirmación
  gracias: (nombre: string) => `¡Gracias, ${nombre}!`,
  graciasTexto: (animal: string) => `${animal} ya tiene el sello Revisado por veterinario. Las familias lo verán en su ficha.`,
  sello: (solidario: boolean, veterinario: string, fecha: string) => `${solidario ? 'Chequeo solidario' : 'Revisado'} · ${veterinario} · ${fecha}`,
  otro: 'Atender otro animal',
  misAtenciones: 'Ver mis atenciones',
} as const;

export const TEXTOS_ALIADO_SOLIDARIO = {
  titulo: 'Aliado solidario',
  texto: 'Te mostramos en Refugios como veterinario que atiende gratis a animales en adopción',
  atenciones: (n: number) => (n === 1 ? '1 atención solidaria' : `${n} atenciones solidarias`),
  esperando: (n: number) => `${n} esperan`,
  error: 'No se pudo actualizar.',
} as const;
