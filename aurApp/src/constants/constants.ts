import type {
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

export const PESTANAS: PestanaNavegacion[] = [
  { nombreRuta: 'index', titulo: 'Inicio', icono: 'inicio' },
  { nombreRuta: 'citas', titulo: 'Citas', icono: 'citas' },
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
  donde: '¿Dónde quieres atenderte?',
  independiente: 'Veterinario independiente',
  independienteDetalle: 'Sin centro: al confirmar te indicará dónde será la atención.',
  veterinario: 'Veterinario',
  sinPreferencia: 'Sin preferencia',
  sinVeterinarios: 'Este centro todavía no tiene veterinarios verificados.',
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
  faltanDatos: 'Completa la mascota, el lugar, el día, la hora y el motivo.',
  faltaVeterinario: 'Elige el veterinario independiente que te atenderá.',
  error: 'No se pudo solicitar la hora.',
  listoTitulo: '¡Hora solicitada!',
  listoDetalle: (donde: string) =>
    `Enviamos tu solicitud a ${donde}. Queda como "por confirmar" hasta que el veterinario la acepte.`,
  verMisCitas: 'Ver mis citas',
  sinMascotas: 'Primero registra a tu mascota para poder pedir una hora.',
  cargando: 'Cargando centros…',
  errorCarga: 'No pudimos cargar los centros. Revisa tu conexión.',
} as const;

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
  terminarAtencion: 'Terminar atención',
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
  aprobacionesDetalle: 'Centros y veterinarios por revisar',
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
};

export const ICONO_TIPO_SOLICITUD = { centro: 'centro', veterinario: 'estetoscopio', solicitud_centro: 'correo' } as const;

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
} as const;

export const FILTROS_APROBACIONES: OpcionPildora<FiltroAprobaciones>[] = [
  { valor: 'todas', texto: 'Todas' },
  { valor: 'centro', texto: 'Centros' },
  { valor: 'veterinario', texto: 'Veterinarios' },
  { valor: 'solicitud_centro', texto: 'Solicitudes' },
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
