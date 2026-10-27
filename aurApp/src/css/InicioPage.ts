import { StyleSheet } from 'react-native';

import { COLORES, FUENTES, MARGEN_PANTALLA, RADIOS, TONOS_TARJETA } from '@/constants/constants';

// ─── InicioScreen ───
export const inicioScreenStyles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  cuerpo: {
    paddingHorizontal: MARGEN_PANTALLA,
    paddingTop: 22,
    gap: 14,
  },
  filaBento: {
    flexDirection: 'row',
    gap: 14,
    minHeight: 210,
  },
  columnaBento: {
    flex: 1,
    gap: 14,
  },
  contenedorBoton: {
    paddingTop: 12,
  },
});

// ─── EncabezadoInicio ───
export const encabezadoInicioStyles = StyleSheet.create({
  contenedor: {
    paddingHorizontal: MARGEN_PANTALLA,
    paddingBottom: 6,
  },
  filaSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  saludo: {
    flex: 1,
    fontFamily: FUENTES.bold,
    fontSize: 24,
    color: COLORES.textoSobrePrimario,
  },
  botonCampana: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.translucidoClaro,
  },
  puntoNotificacion: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORES.acento,
    borderWidth: 2,
    borderColor: COLORES.primario,
  },
  presionado: {
    opacity: 0.7,
  },
  filaPrincipal: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  columnaFoto: {
    alignItems: 'center',
    // La foto queda a media altura de la columna, con la tarjeta de la cita a su lado
    alignSelf: 'center',
  },
  sinMascotas: {
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: -14,
  },
  columnaInfo: {
    flex: 1,
    gap: 6,
    paddingBottom: 4,
  },
  nombre: {
    fontFamily: FUENTES.extrabold,
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: -0.5,
    color: COLORES.textoSobrePrimario,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    color: COLORES.textoSobrePrimarioSuave,
    marginBottom: 6,
  },
  tarjetaCita: {
    marginTop: 12,
  },
});

// ─── FotoMascota ───
export const fotoMascotaStyles = StyleSheet.create({
  marco: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.primarioSuave,
    borderWidth: 5,
    borderColor: COLORES.blanco,
    boxShadow: '0 10px 24px rgba(11, 59, 53, 0.25)',
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
});

// ─── SelectorMascotas ───
export const selectorMascotasStyles = StyleSheet.create({
  botonAgregar: {
    width: 30,
    height: 30,
    marginLeft: 2,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.translucidoClaro,
  },
  presionado: {
    opacity: 0.7,
  },
});

// ─── TarjetaProximaCita ───
export const tarjetaProximaCitaStyles = StyleSheet.create({
  tarjeta: {
    backgroundColor: COLORES.blanco,
    borderRadius: RADIOS.md,
    padding: 14,
    gap: 6,
    boxShadow: '0 12px 28px rgba(11, 59, 53, 0.16)',
  },
  presionada: {
    transform: [{ scale: 0.98 }],
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.texto,
  },
  motivo: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
    marginTop: 2,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 12,
    lineHeight: 16,
    color: COLORES.textoSecundario,
  },
});

// ─── TarjetaFicha ───
export const tarjetaFichaStyles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
    textAlign: 'center',
  },
  anillo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centroAnillo: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  porcentaje: {
    fontFamily: FUENTES.extrabold,
    fontSize: 22,
    color: COLORES.texto,
  },
  resumen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  textoResumen: {
    flexShrink: 1,
    fontFamily: FUENTES.semibold,
    fontSize: 12.5,
    color: COLORES.texto,
    textAlign: 'center',
  },
});

// ─── TarjetaRecordatorio ───
export const tarjetaRecordatorioStyles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
    gap: 8,
  },
  textos: {
    gap: 2,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 14.5,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.semibold,
    fontSize: 13,
  },
});

// ─── TarjetaSintomas ───
export const tarjetaSintomasStyles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textos: {
    flex: 1,
    gap: 3,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORES.textoSecundario,
  },
});

// ─── BotonPedirHora ───
export const botonPedirHoraStyles = StyleSheet.create({
  boton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 58,
    paddingHorizontal: 34,
    borderRadius: 29,
    backgroundColor: COLORES.primario,
    boxShadow: '0 12px 24px rgba(15, 143, 128, 0.35)',
  },
  presionado: {
    backgroundColor: COLORES.primarioOscuro,
    transform: [{ scale: 0.97 }],
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 17,
    color: COLORES.blanco,
  },
});

// ─── HuellasFondo ───
export const huellasFondoStyles = StyleSheet.create({
  capa: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  manchaIzquierda: {
    position: 'absolute',
    top: -30,
    left: -70,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: TONOS_TARJETA.menta.fondo,
    opacity: 0.7,
  },
  manchaDerecha: {
    position: 'absolute',
    top: 300,
    right: -60,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: TONOS_TARJETA.menta.fondo,
    opacity: 0.5,
  },
});
