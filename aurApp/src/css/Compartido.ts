import { Platform, StyleSheet } from 'react-native';

import { COLORES, FUENTES, MARGEN_PANTALLA, RADIOS } from '@/constants/constants';

// ─── OndaEncabezado ───
export const ondaEncabezadoStyles = StyleSheet.create({
  onda: {
    position: 'absolute',
    left: 0,
    bottom: -1,
  },
});

// ─── CampoTexto / CampoPassword ───
export const campoTextoStyles = StyleSheet.create({
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
    backgroundColor: COLORES.blanco,
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
});

// ─── BotonPrincipal ───
export const botonPrincipalStyles = StyleSheet.create({
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
    opacity: 0.7,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 17,
    color: COLORES.blanco,
  },
});

// ─── MensajeFormulario ───
export const mensajeFormularioStyles = StyleSheet.create({
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
});

// ─── EnlaceTexto ───
export const enlaceTextoStyles = StyleSheet.create({
  texto: {
    fontFamily: FUENTES.semibold,
    fontSize: 14,
    color: COLORES.primario,
    textDecorationLine: 'underline',
  },
  presionado: {
    opacity: 0.6,
  },
});

// ─── BotonSecundario ───
export const botonSecundarioStyles = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.blanco,
  },
  presionado: {
    backgroundColor: COLORES.fondo,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
});

// ─── HuellasDecorativas ───
export const huellasDecorativasStyles = StyleSheet.create({
  capa: {
    ...StyleSheet.absoluteFill,
  },
  huella: {
    position: 'absolute',
  },
});

// ─── EncabezadoVerde ───
export const encabezadoVerdeStyles = StyleSheet.create({
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
});

// ─── CirculoIcono ───
export const circuloIconoStyles = StyleSheet.create({
  circulo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── Etiqueta ───
export const etiquetaStyles = StyleSheet.create({
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
});

// ─── TarjetaPastel ───
export const tarjetaPastelStyles = StyleSheet.create({
  tarjeta: {
    borderRadius: RADIOS.lg,
    padding: 16,
  },
  presionada: {
    transform: [{ scale: 0.98 }],
  },
});

// ─── SelectorPildoras ───
export const selectorPildorasStyles = StyleSheet.create({
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
    backgroundColor: COLORES.blanco,
    boxShadow: '0 2px 6px rgba(11, 59, 53, 0.18)',
  },
  pildoraClara: {
    borderWidth: 1,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.blanco,
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
});

// ─── CampoBusqueda ───
export const campoBusquedaStyles = StyleSheet.create({
  caja: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.blanco,
  },
  input: {
    flex: 1,
    fontFamily: FUENTES.medium,
    fontSize: 15,
    color: COLORES.texto,
    padding: 0,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },
});

// ─── BarraFiltros ───
export const barraFiltrosStyles = StyleSheet.create({
  contenedor: {
    gap: 12,
  },
});

// ─── EncabezadoPagina ───
export const encabezadoPaginaStyles = StyleSheet.create({
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
});

// ─── BotonIcono ───
export const botonIconoStyles = StyleSheet.create({
  boton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  blanco: {
    backgroundColor: COLORES.blanco,
    boxShadow: '0 6px 16px rgba(11, 59, 53, 0.22)',
  },
  translucido: {
    backgroundColor: COLORES.translucidoClaro,
  },
  presionado: {
    transform: [{ scale: 0.94 }],
  },
});

// ─── BotonPequeno ───
export const botonPequenoStyles = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.blanco,
  },
  peligro: {
    borderColor: COLORES.errorSuave,
  },
  primario: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
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
});

// ─── EstadoVacio ───
export const estadoVacioStyles = StyleSheet.create({
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
});

// ─── EstadoCarga ───
export const estadoCargaStyles = StyleSheet.create({
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
});

// ─── PantallaLista ───
export const pantallaListaStyles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  cuerpo: {
    paddingHorizontal: MARGEN_PANTALLA,
    paddingTop: 4,
    gap: 16,
  },
});

// ─── PantallaFormulario ───
export const pantallaFormularioStyles = StyleSheet.create({
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
});

// ─── TituloSeccion ───
export const tituloSeccionStyles = StyleSheet.create({
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
});

// ─── FilaOpcion ───
export const filaOpcionStyles = StyleSheet.create({
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
});

// ─── AvatarIniciales ───
export const avatarInicialesStyles = StyleSheet.create({
  circulo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.blanco,
    borderWidth: 4,
    borderColor: COLORES.primario,
    boxShadow: '0 8px 20px rgba(11, 59, 53, 0.18)',
  },
  texto: {
    fontFamily: FUENTES.extrabold,
    color: COLORES.texto,
  },
});

// ─── AvatarMascota ───
export const avatarMascotaStyles = StyleSheet.create({
  foto: {
    borderWidth: 2,
    borderColor: COLORES.blanco,
  },
  sinFoto: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORES.blanco,
  },
});

// ─── ChipsMultiples ───
export const chipsMultiplesStyles = StyleSheet.create({
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
    backgroundColor: COLORES.blanco,
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
});

// ─── TarjetaOpcion ───
export const tarjetaOpcionStyles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: RADIOS.md,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.blanco,
  },
  seleccionada: {
    borderColor: COLORES.primario,
    backgroundColor: '#F1FAF8',
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
});

// ─── FilaInterruptor ───
export const filaInterruptorStyles = StyleSheet.create({
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
    backgroundColor: COLORES.blanco,
  },
  texto: {
    flex: 1,
    fontFamily: FUENTES.semibold,
    fontSize: 15,
    color: COLORES.texto,
  },
});

// ─── EtiquetaCampo (título encima de un grupo de opciones en formularios) ───
export const etiquetaCampoStyles = StyleSheet.create({
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
});

// ─── ResultadoSolicitud ───
export const resultadoSolicitudStyles = StyleSheet.create({
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
});

// ─── IndicadorNumero ───
export const indicadorNumeroStyles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    gap: 6,
    padding: 14,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.blanco,
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
});

// ─── BarraProgreso ───
export const barraProgresoStyles = StyleSheet.create({
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
});

// ─── MiniGraficoBarras ───
export const miniGraficoStyles = StyleSheet.create({
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
});

// ─── TarjetaAccion ───
export const tarjetaAccionStyles = StyleSheet.create({
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
});

// ─── ModalTexto ───
export const modalTextoStyles = StyleSheet.create({
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
    backgroundColor: COLORES.blanco,
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
});

// ─── TarjetaCitaGestion ───
export const tarjetaCitaGestionStyles = StyleSheet.create({
  tarjeta: {
    gap: 10,
    padding: 14,
    borderRadius: RADIOS.md,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.blanco,
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
});

// ─── Listas agrupadas (agendas, pacientes, solicitudes) ───
export const listaGruposStyles = StyleSheet.create({
  contenedor: {
    gap: 22,
  },
  grupo: {
    gap: 12,
  },
});

// ─── IndicadorPastel ───
export const indicadorPastelStyles = StyleSheet.create({
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
});
