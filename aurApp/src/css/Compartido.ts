import { Platform, StyleSheet } from 'react-native';

import { FUENTES, MARGEN_PANTALLA, RADIOS } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── OndaEncabezado ───
export const useOndaEncabezadoStyles = crearEstilos(() => ({
  onda: {
    position: 'absolute',
    left: 0,
    bottom: -1,
  },
}));

// ─── CampoTexto / CampoPassword ───
export const useCampoTextoStyles = crearEstilos((COLORES) => ({
  contenedor: {
    gap: 6,
  },
  caja: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIOS.md,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
  },
  cajaEnfocada: {
    borderColor: COLORES.primario,
    boxShadow: '0 0 0 4px rgba(15, 143, 128, 0.12)',
  },
  cajaError: {
    borderColor: COLORES.error,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  etiqueta: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
  etiquetaEnfocada: {
    color: COLORES.primario,
  },
  etiquetaError: {
    color: COLORES.error,
  },
  input: {
    fontFamily: FUENTES.semibold,
    fontSize: 16,
    color: COLORES.texto,
    padding: 0,
    margin: 0,
    // Sin el recuadro que pone el navegador al enfocar (solo afecta la versión web)
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },
  inputMultilinea: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  textoError: {
    fontFamily: FUENTES.semibold,
    fontSize: 12.5,
    color: COLORES.error,
    marginLeft: 6,
  },
  textoAyuda: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
    marginLeft: 6,
  },
  botonOjo: {
    padding: 4,
  },
  presionado: {
    opacity: 0.6,
  },
}));

// ─── BotonPrincipal ───
export const useBotonPrincipalStyles = crearEstilos((COLORES) => ({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORES.primario,
    boxShadow: '0 12px 24px rgba(15, 143, 128, 0.30)',
  },
  presionado: {
    backgroundColor: COLORES.primarioOscuro,
    transform: [{ scale: 0.98 }],
  },
  inactivo: {
    opacity: 0.55,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 17,
    color: COLORES.blanco,
  },
  primario: {},
  primarioPresionado: {},
  coral: {
    backgroundColor: COLORES.coral,
    boxShadow: '0 12px 24px rgba(255, 122, 89, 0.35)',
  },
  coralPresionado: {
    backgroundColor: COLORES.coralOscuro,
  },
  peligro: {
    backgroundColor: COLORES.peligro,
    boxShadow: '0 12px 24px rgba(214, 69, 69, 0.28)',
  },
  peligroPresionado: {
    backgroundColor: COLORES.peligroPresionado,
  },
}));

// ─── MensajeFormulario ───
export const useMensajeFormularioStyles = crearEstilos((COLORES) => ({
  caja: {
    borderRadius: RADIOS.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  cajaError: {
    backgroundColor: COLORES.errorSuave,
  },
  cajaAviso: {
    backgroundColor: COLORES.primarioSuave,
  },
  texto: {
    fontFamily: FUENTES.semibold,
    fontSize: 13.5,
    lineHeight: 19,
  },
  textoError: {
    color: COLORES.error,
  },
  textoAviso: {
    color: COLORES.primarioOscuro,
  },
}));

// ─── EnlaceTexto ───
export const useEnlaceTextoStyles = crearEstilos((COLORES) => ({
  texto: {
    fontFamily: FUENTES.semibold,
    fontSize: 14,
    color: COLORES.primario,
    textDecorationLine: 'underline',
  },
  presionado: {
    opacity: 0.6,
  },
}));

// ─── BotonSecundario ───
export const useBotonSecundarioStyles = crearEstilos((COLORES) => ({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
  },
  presionado: {
    backgroundColor: COLORES.fondo,
  },
  verde: {
    borderColor: COLORES.primario,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
}));

// ─── HuellasDecorativas ───
export const useHuellasDecorativasStyles = crearEstilos(() => ({
  capa: {
    ...StyleSheet.absoluteFill,
  },
  huella: {
    position: 'absolute',
  },
}));

// ─── EncabezadoVerde ───
export const useEncabezadoVerdeStyles = crearEstilos((COLORES) => ({
  contenedor: {
    backgroundColor: COLORES.primario,
  },
  extensionSuperior: {
    position: 'absolute',
    top: -800,
    left: 0,
    right: 0,
    height: 800,
    backgroundColor: COLORES.primario,
  },
}));

// ─── CirculoIcono ───
export const useCirculoIconoStyles = crearEstilos(() => ({
  circulo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

// ─── Etiqueta ───
export const useEtiquetaStyles = crearEstilos(() => ({
  etiqueta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  punto: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 11.5,
    letterSpacing: 0.2,
  },
}));

// ─── TarjetaPastel ───
export const useTarjetaPastelStyles = crearEstilos(() => ({
  tarjeta: {
    borderRadius: RADIOS.lg,
    padding: 16,
  },
  presionada: {
    transform: [{ scale: 0.98 }],
  },
}));

// ─── SelectorPildoras ───
export const useSelectorPildorasStyles = crearEstilos((COLORES) => ({
  contenedor: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 2,
    padding: 4,
    borderRadius: 22,
  },
  contenedorSobrePrimario: {
    backgroundColor: COLORES.translucidoClaro,
  },
  contenedorClaro: {
    padding: 0,
    gap: 8,
  },
  pildora: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
  activaSobrePrimario: {
    backgroundColor: COLORES.superficie,
    boxShadow: '0 2px 6px rgba(11, 59, 53, 0.18)',
  },
  pildoraClara: {
    borderWidth: 1,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
  },
  activaClaro: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
  },
  texto: {
    fontFamily: FUENTES.semibold,
    fontSize: 13,
  },
  textoSobrePrimario: {
    color: COLORES.textoSobrePrimarioSuave,
  },
  textoClaro: {
    color: COLORES.texto,
  },
  textoActivoSobrePrimario: {
    fontFamily: FUENTES.bold,
    color: COLORES.primarioOscuro,
  },
  textoActivoClaro: {
    fontFamily: FUENTES.bold,
    color: COLORES.blanco,
  },
  cantidad: {
    opacity: 0.7,
  },
}));

// ─── CampoBusqueda ───
export const useCampoBusquedaStyles = crearEstilos((COLORES) => ({
  caja: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  input: {
    flex: 1,
    fontFamily: FUENTES.medium,
    fontSize: 15,
    color: COLORES.texto,
    padding: 0,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },
}));

// ─── BarraFiltros ───
export const useBarraFiltrosStyles = crearEstilos(() => ({
  contenedor: {
    gap: 12,
  },
}));

// ─── EncabezadoPagina ───
export const useEncabezadoPaginaStyles = crearEstilos((COLORES) => ({
  contenedor: {
    paddingHorizontal: MARGEN_PANTALLA,
    paddingBottom: 58, // espacio para la onda
    gap: 14,
  },
  contenedorCentrado: {
    paddingBottom: 64,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
  },
  filaCentrada: {
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  textosCentrados: {
    flex: 0,
    alignItems: 'center',
  },
  titulo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 28,
    letterSpacing: -0.4,
    color: COLORES.blanco,
  },
  tituloConSubtitulo: {
    fontSize: 24,
  },
  tituloCentrado: {
    fontSize: 18,
    fontFamily: FUENTES.bold,
  },
  subtitulo: {
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    color: COLORES.textoSobrePrimarioSuave,
  },
}));

// ─── BotonIcono ───
export const useBotonIconoStyles = crearEstilos((COLORES) => ({
  boton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  blanco: {
    backgroundColor: COLORES.superficie,
    boxShadow: '0 6px 16px rgba(11, 59, 53, 0.22)',
  },
  translucido: {
    backgroundColor: COLORES.translucidoClaro,
  },
  presionado: {
    transform: [{ scale: 0.94 }],
  },
}));

// ─── BotonPequeno ───
export const useBotonPequenoStyles = crearEstilos((COLORES) => ({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
  },
  peligro: {
    borderColor: COLORES.errorSuave,
  },
  primario: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
  },
  coral: {
    borderColor: COLORES.coral,
    backgroundColor: COLORES.coral,
  },
  presionado: {
    opacity: 0.7,
  },
  deshabilitado: {
    opacity: 0.45,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 13.5,
  },
}));

// ─── EstadoVacio ───
export const useEstadoVacioStyles = crearEstilos((COLORES) => ({
  contenedor: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
    paddingHorizontal: 12,
  },
  titulo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 19,
    color: COLORES.texto,
    textAlign: 'center',
    marginTop: 8,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
  accion: {
    alignSelf: 'stretch',
    marginTop: 12,
  },
}));

// ─── EstadoCarga ───
export const useEstadoCargaStyles = crearEstilos((COLORES) => ({
  contenedor: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 48,
  },
  texto: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
}));

// ─── PantallaLista ───
export const usePantallaListaStyles = crearEstilos((COLORES) => ({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  cuerpo: {
    paddingHorizontal: MARGEN_PANTALLA,
    paddingTop: 4,
    gap: 16,
  },
}));

// ─── PantallaFormulario ───
export const usePantallaFormularioStyles = crearEstilos((COLORES) => ({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  scroll: {
    flexGrow: 1,
  },
  cuerpo: {
    paddingHorizontal: MARGEN_PANTALLA,
    paddingTop: 4,
    gap: 18,
  },
  pie: {
    paddingHorizontal: MARGEN_PANTALLA,
    paddingTop: 12,
    backgroundColor: COLORES.fondo,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
  },
}));

// ─── TituloSeccion ───
export const useTituloSeccionStyles = crearEstilos((COLORES) => ({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  texto: {
    fontFamily: FUENTES.extrabold,
    fontSize: 18,
    color: COLORES.texto,
  },
}));

// ─── FilaOpcion ───
export const useFilaOpcionStyles = crearEstilos((COLORES) => ({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  separador: {
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
  },
  presionada: {
    backgroundColor: COLORES.fondo,
  },
  texto: {
    flex: 1,
    fontFamily: FUENTES.semibold,
    fontSize: 15.5,
    color: COLORES.texto,
  },
  valor: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
}));

// ─── AvatarIniciales ───
export const useAvatarInicialesStyles = crearEstilos((COLORES) => ({
  circulo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.superficie,
    borderWidth: 4,
    borderColor: COLORES.primario,
    boxShadow: '0 8px 20px rgba(11, 59, 53, 0.18)',
  },
  texto: {
    fontFamily: FUENTES.extrabold,
    color: COLORES.texto,
  },
}));

// ─── AvatarMascota ───
export const useAvatarMascotaStyles = crearEstilos((COLORES) => ({
  foto: {
    borderWidth: 2,
    borderColor: COLORES.superficie,
  },
  sinFoto: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORES.superficie,
  },
}));

// ─── ChipsMultiples ───
export const useChipsMultiplesStyles = crearEstilos((COLORES) => ({
  contenedor: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
  },
  chipMarcado: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
  },
  texto: {
    fontFamily: FUENTES.semibold,
    fontSize: 13.5,
    color: COLORES.texto,
  },
  textoMarcado: {
    color: COLORES.blanco,
  },
}));

// ─── TarjetaOpcion ───
export const useTarjetaOpcionStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: RADIOS.md,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
  },
  seleccionada: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.fondoMenta,
  },
  presionada: {
    opacity: 0.85,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    lineHeight: 17,
    color: COLORES.textoSecundario,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORES.bordeCampo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioMarcado: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
  },
}));

// ─── FilaInterruptor ───
export const useFilaInterruptorStyles = crearEstilos((COLORES) => ({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 16,
    borderRadius: RADIOS.md,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
  },
  texto: {
    flex: 1,
    fontFamily: FUENTES.semibold,
    fontSize: 15,
    color: COLORES.texto,
  },
}));

// ─── EtiquetaCampo (título encima de un grupo de opciones en formularios) ───
export const useEtiquetaCampoStyles = crearEstilos((COLORES) => ({
  grupo: {
    gap: 10,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
  },
  ayuda: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    lineHeight: 17,
    color: COLORES.textoSecundario,
  },
  error: {
    fontFamily: FUENTES.semibold,
    fontSize: 12.5,
    color: COLORES.error,
  },
}));

// ─── ResultadoSolicitud ───
export const useResultadoSolicitudStyles = crearEstilos((COLORES) => ({
  contenedor: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 24,
  },
  titulo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 24,
    color: COLORES.texto,
    textAlign: 'center',
    marginTop: 10,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 15,
    lineHeight: 22,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
  boton: {
    alignSelf: 'stretch',
    marginTop: 18,
  },
}));

// ─── IndicadorNumero ───
export const useIndicadorNumeroStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    flex: 1,
    gap: 6,
    padding: 14,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
    boxShadow: '0 6px 18px rgba(11, 59, 53, 0.08)',
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  etiqueta: {
    flexShrink: 1,
    fontFamily: FUENTES.semibold,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  valor: {
    fontFamily: FUENTES.extrabold,
    fontSize: 26,
    color: COLORES.texto,
  },
}));

// ─── BarraProgreso ───
export const useBarraProgresoStyles = crearEstilos((COLORES) => ({
  fondo: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: COLORES.borde,
  },
  relleno: {
    height: 6,
    borderRadius: 3,
  },
}));

// ─── MiniGraficoBarras ───
export const useMiniGraficoStyles = crearEstilos((COLORES) => ({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  columna: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  zona: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  barra: {
    width: '100%',
    borderRadius: 6,
  },
  etiqueta: {
    fontFamily: FUENTES.semibold,
    fontSize: 10.5,
    color: COLORES.textoSecundario,
  },
  etiquetaDestacada: {
    fontFamily: FUENTES.extrabold,
    color: COLORES.primarioOscuro,
  },
}));

// ─── TarjetaAccion ───
export const useTarjetaAccionStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: RADIOS.md,
  },
  textos: {
    flex: 1,
    gap: 1,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
  },
  cantidad: {
    fontFamily: FUENTES.extrabold,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
}));

// ─── ModalTexto ───
export const useModalTextoStyles = crearEstilos((COLORES) => ({
  fondo: {
    flex: 1,
    justifyContent: 'center',
    padding: MARGEN_PANTALLA,
    backgroundColor: 'rgba(26, 31, 39, 0.45)',
  },
  cerrarFondo: {
    ...StyleSheet.absoluteFill,
  },
  tarjeta: {
    gap: 12,
    padding: 20,
    borderRadius: RADIOS.lg,
    backgroundColor: COLORES.superficie,
  },
  titulo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 19,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORES.textoSecundario,
  },
  input: {
    minHeight: 96,
    padding: 12,
    borderRadius: RADIOS.sm,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    fontFamily: FUENTES.medium,
    fontSize: 15,
    color: COLORES.texto,
    textAlignVertical: 'top',
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },
  acciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
}));

// ─── TarjetaCitaGestion ───
export const useTarjetaCitaGestionStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    gap: 10,
    padding: 14,
    borderRadius: RADIOS.md,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  presionada: {
    opacity: 0.85,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textos: {
    flex: 1,
    gap: 1,
  },
  mascota: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
  },
  descripcion: {
    fontFamily: FUENTES.medium,
    color: COLORES.textoSecundario,
  },
  dueno: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  hora: {
    fontFamily: FUENTES.extrabold,
    fontSize: 15,
    color: COLORES.texto,
  },
  motivo: {
    fontFamily: FUENTES.semibold,
    fontSize: 14.5,
    color: COLORES.texto,
  },
  extra: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  etiquetas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  acciones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 2,
  },
  flecha: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
}));

// ─── Listas agrupadas (agendas, pacientes, solicitudes) ───
export const useListaGruposStyles = crearEstilos(() => ({
  contenedor: {
    gap: 22,
  },
  grupo: {
    gap: 12,
  },
}));

// ─── IndicadorPastel ───
export const useIndicadorPastelStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    flex: 1,
    gap: 2,
    padding: 14,
    justifyContent: 'center',
  },
  etiqueta: {
    fontFamily: FUENTES.semibold,
    fontSize: 14,
    color: COLORES.texto,
  },
  valor: {
    fontFamily: FUENTES.extrabold,
    fontSize: 22,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
}));

// ─── AvatarPersona ───
export const useAvatarPersonaStyles = crearEstilos((COLORES) => ({
  foto: {
    backgroundColor: COLORES.primarioSuave,
  },
  borde: {
    borderWidth: 2,
    borderColor: COLORES.superficie,
  },
}));

// ─── FilaAvatares ───
export const useFilaAvataresStyles = crearEstilos((COLORES) => ({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    borderRadius: 999,
  },
  mas: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.primarioSuave,
    borderWidth: 2,
    borderColor: COLORES.superficie,
  },
  masTexto: {
    fontFamily: FUENTES.bold,
    fontSize: 11,
    color: COLORES.primarioOscuro,
  },
}));

// ─── IndicadorPasos ───
export const useIndicadorPasosStyles = crearEstilos((COLORES) => ({
  contenedor: {
    alignItems: 'center',
    gap: 8,
  },
  barras: {
    flexDirection: 'row',
    gap: 4,
  },
  barra: {
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORES.borde,
  },
  barraHecha: {
    backgroundColor: COLORES.primario,
  },
  nombres: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
  nombreActual: {
    fontFamily: FUENTES.bold,
    color: COLORES.texto,
  },
}));

// ─── ChipIcono ───
export const useChipIconoStyles = crearEstilos((COLORES) => ({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
  },
  activo: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
  },
  presionado: {
    opacity: 0.8,
  },
  texto: {
    fontFamily: FUENTES.semibold,
    fontSize: 13.5,
  },
}));

// ─── ControlSegmentado ───
export const useControlSegmentadoStyles = crearEstilos((COLORES) => ({
  contenedor: {
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 4,
    borderRadius: 26,
    backgroundColor: COLORES.borde,
  },
  opcion: {
    minWidth: 128,
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
  },
  activa: {
    backgroundColor: COLORES.segmentoActivo,
  },
  texto: {
    fontFamily: FUENTES.semibold,
    fontSize: 14.5,
    color: COLORES.texto,
  },
  textoActivo: {
    color: COLORES.blanco,
  },
}));

// ─── HojaInferior ───
export const useHojaInferiorStyles = crearEstilos((COLORES) => ({
  fondo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  velo: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: COLORES.velo,
  },
  hoja: {
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: RADIOS.xl,
    borderTopRightRadius: RADIOS.xl,
    backgroundColor: COLORES.superficie,
  },
  agarre: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORES.borde,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 17,
    color: COLORES.texto,
    textAlign: 'center',
  },
}));

// ─── OpcionHoja ───
export const useOpcionHojaStyles = crearEstilos((COLORES) => ({
  opcion: {
    flex: 1,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: RADIOS.md,
  },
  presionada: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  deshabilitada: {
    opacity: 0.5,
  },
  cuadro: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  cuadroPeligro: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  texto: {
    flex: 1,
    fontFamily: FUENTES.semibold,
    fontSize: 15,
    color: COLORES.texto,
  },
  textoPeligro: {
    color: COLORES.blanco,
  },
}));

// ─── TarjetaListaIconos ───
export const useTarjetaListaIconosStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    gap: 10,
    padding: 16,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  texto: {
    flex: 1,
    fontFamily: FUENTES.medium,
    fontSize: 14.5,
    lineHeight: 20,
    color: COLORES.texto,
  },
}));

// ─── TarjetaAviso ───
export const useTarjetaAvisoStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.aviso,
  },
  centrada: {
    justifyContent: 'center',
  },
  cuerpo: {
    flex: 1,
    gap: 4,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
  texto: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORES.texto,
  },
  textoCentrado: {
    textAlign: 'center',
  },
}));

// ─── Casilla ───
export const useCasillaStyles = crearEstilos((COLORES) => ({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  caja: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: COLORES.textoSecundario,
    backgroundColor: COLORES.superficie,
  },
  cajaMarcada: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
  },
  texto: {
    flex: 1,
    fontFamily: FUENTES.medium,
    fontSize: 14.5,
    lineHeight: 20,
    color: COLORES.texto,
  },
}));

// ─── LineaEstados ───
export const useLineaEstadosStyles = crearEstilos((COLORES) => ({
  paso: {
    flexDirection: 'row',
    gap: 14,
  },
  columna: {
    alignItems: 'center',
    width: 28,
  },
  punto: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  hecho: {
    backgroundColor: COLORES.primario,
  },
  actual: {
    borderWidth: 3,
    borderColor: COLORES.primario,
    backgroundColor: COLORES.superficie,
  },
  pendiente: {
    backgroundColor: COLORES.borde,
  },
  centro: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORES.primario,
  },
  linea: {
    width: 2,
    flex: 1,
    minHeight: 22,
    backgroundColor: COLORES.borde,
  },
  lineaHecha: {
    backgroundColor: COLORES.primario,
  },
  texto: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 18,
    fontFamily: FUENTES.medium,
    fontSize: 15,
    color: COLORES.texto,
  },
  textoActual: {
    fontFamily: FUENTES.bold,
  },
  textoPendiente: {
    color: COLORES.textoSecundario,
  },
}));

// ─── AvisoSinConexion ───
export const useAvisoSinConexionStyles = crearEstilos((COLORES) => ({
  franja: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.aviso,
  },
  texto: {
    flex: 1,
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    lineHeight: 19,
    color: COLORES.avisoTexto,
  },
  reintentar: {
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.primario,
  },
}));

// ─── EstadoBorrador ───
export const useEstadoBorradorStyles = crearEstilos((COLORES) => ({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  texto: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
}));

// ─── BotonAgregar ───
export const useBotonAgregarStyles = crearEstilos((COLORES) => ({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: RADIOS.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORES.primario,
    backgroundColor: 'rgba(15, 143, 128, 0.04)',
  },
  presionado: {
    backgroundColor: COLORES.primarioSuave,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.primario,
  },
}));

// ─── ChipsOpcion (una opción, con ícono opcional; usa el mismo chip que ChipIcono) ───
export const useChipsOpcionStyles = crearEstilos(() => ({
  contenedor: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
}));

// ─── FilaChipsIcono ───
export const useFilaChipsIconoStyles = crearEstilos(() => ({
  contenido: {
    gap: 8,
    paddingRight: 4,
  },
}));

// ─── HojaContacto ───
export const useHojaContactoStyles = crearEstilos((COLORES) => ({
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  sinDatos: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
}));

// ─── HojaElegirFoto ───
export const useHojaElegirFotoStyles = crearEstilos(() => ({
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
}));

// ─── ContadorNumero (peso de la atención, cupos del refugio) ───
export const useContadorNumeroStyles = crearEstilos((COLORES) => ({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boton: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIOS.md,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
  },
  deshabilitado: {
    opacity: 0.4,
  },
  signo: {
    fontFamily: FUENTES.bold,
    fontSize: 26,
    color: COLORES.texto,
  },
  valor: {
    flex: 1,
    marginHorizontal: 10,
    fontFamily: FUENTES.extrabold,
    fontSize: 30,
    color: COLORES.texto,
    textAlign: 'center',
  },
}));

// ─── TarjetaProgreso ("Completa tu perfil": veterinario y centro) ───
export const useTarjetaProgresoStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    gap: 12,
    padding: 16,
    borderRadius: RADIOS.lg,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
  porcentaje: {
    fontFamily: FUENTES.semibold,
    fontSize: 13.5,
    color: COLORES.primarioOscuro,
  },
  paso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: RADIOS.sm,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORES.bordeCampo,
  },
  pasoPresionado: {
    backgroundColor: COLORES.primarioSuave,
  },
  pasoTexto: {
    flex: 1,
    fontFamily: FUENTES.semibold,
    fontSize: 14,
    color: COLORES.texto,
  },
}));

// ─── CampoHora ("09:30") ───
export const useCampoHoraStyles = crearEstilos((COLORES) => ({
  contenedor: {
    flex: 1,
    gap: 4,
  },
  etiqueta: {
    fontFamily: FUENTES.medium,
    fontSize: 12,
    color: COLORES.textoSecundario,
  },
  input: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: RADIOS.sm,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
    fontFamily: FUENTES.semibold,
    fontSize: 16,
    color: COLORES.texto,
  },
  deshabilitado: {
    opacity: 0.45,
  },
}));

// ─── AvisosCitas (Inicio del dueño y Resumen del centro) ───
export const useAvisosCitasStyles = crearEstilos((COLORES) => ({
  contenedor: {
    gap: 8,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
  contador: {
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 11,
    backgroundColor: COLORES.coral,
    fontFamily: FUENTES.bold,
    fontSize: 12,
    color: COLORES.blanco,
    textAlign: 'center',
    overflow: 'hidden',
  },
  todos: {
    marginLeft: 'auto',
  },
  link: {
    fontFamily: FUENTES.semibold,
    fontSize: 13,
    color: COLORES.primario,
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: RADIOS.md,
    borderLeftWidth: 4,
    backgroundColor: COLORES.superficie,
  },
  reagendada: {
    borderLeftColor: COLORES.primario,
  },
  cancelada: {
    borderLeftColor: COLORES.peligro,
  },
  cuerpo: {
    flex: 1,
    gap: 4,
  },
  avisoTitulo: {
    fontFamily: FUENTES.bold,
    fontSize: 14.5,
    color: COLORES.texto,
  },
  fechas: {
    fontFamily: FUENTES.semibold,
    fontSize: 13,
  },
  anterior: {
    color: COLORES.textoSecundario,
    textDecorationLine: 'line-through',
  },
  nueva: {
    color: COLORES.primarioOscuro,
  },
  mensaje: {
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    lineHeight: 19,
    color: COLORES.textoSecundario,
  },
}));
