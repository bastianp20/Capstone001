import { StyleSheet } from 'react-native';

import { COLORES, FUENTES, RADIOS } from '@/constants/constants';

// ─── AdoptaScreen ───
export const adoptaStyles = StyleSheet.create({
  acciones: {
    flexDirection: 'row',
    gap: 8,
  },
  barra: {
    gap: 12,
  },
  filaBusqueda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  busqueda: {
    flex: 1,
  },
  resultados: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
  },
});

// ─── CifrasAdopcion (sobre el verde del encabezado) ───
export const cifrasAdopcionStyles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    gap: 8,
  },
  cifra: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.translucidoClaro,
  },
  valor: {
    fontFamily: FUENTES.extrabold,
    fontSize: 20,
    color: COLORES.blanco,
  },
  texto: {
    fontFamily: FUENTES.medium,
    fontSize: 11.5,
    color: COLORES.textoSobrePrimarioSuave,
  },
});

// ─── BotonFiltros ───
export const botonFiltrosStyles = StyleSheet.create({
  boton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.blanco,
  },
  activo: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primarioSuave,
  },
  numero: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORES.coral,
    color: COLORES.blanco,
    fontFamily: FUENTES.bold,
    fontSize: 11.5,
    lineHeight: 20,
    textAlign: 'center',
  },
});

// ─── GrillaAnimalesAdopcion / TarjetaAnimalAdopcion ───
export const grillaAnimalesStyles = StyleSheet.create({
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export const tarjetaAnimalStyles = StyleSheet.create({
  tarjeta: {
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.blanco,
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(11, 59, 53, 0.08)',
  },
  presionada: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  foto: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: COLORES.huellas,
  },
  sinFoto: {
    width: '100%',
    aspectRatio: 4 / 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guardar: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  enProceso: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORES.estados.en_curso.fondo,
    color: COLORES.estados.en_curso.texto,
    fontFamily: FUENTES.bold,
    fontSize: 11,
  },
  cuerpo: {
    gap: 3,
    padding: 12,
  },
  nombre: {
    fontFamily: FUENTES.extrabold,
    fontSize: 16.5,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
  sello: {
    marginTop: 4,
  },
});

// ─── BotonGuardar ───
export const botonGuardarStyles = StyleSheet.create({
  boton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
  },
  presionado: {
    transform: [{ scale: 0.9 }],
  },
});

// ─── SelloRevisado ───
export const selloRevisadoStyles = StyleSheet.create({
  sello: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: COLORES.primarioSuave,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 11.5,
    color: COLORES.primarioOscuro,
  },
});

// ─── FiltroRefugioActivo ───
export const filtroRefugioActivoStyles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.primarioSuave,
  },
  texto: {
    flex: 1,
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.primarioOscuro,
  },
  quitar: {
    fontFamily: FUENTES.bold,
    fontSize: 13.5,
    color: COLORES.primario,
  },
});

// ─── TarjetaDarEnAdopcion ───
export const tarjetaDarEnAdopcionStyles = StyleSheet.create({
  tarjeta: {
    gap: 12,
    padding: 18,
    borderRadius: RADIOS.lg,
    backgroundColor: '#FFE6D5',
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icono: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: COLORES.blanco,
  },
  textos: {
    flex: 1,
    gap: 3,
  },
  titulo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 16,
    color: COLORES.texto,
  },
  texto: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORES.texto,
  },
  botones: {
    flexDirection: 'row',
    gap: 10,
  },
});

// ─── HojaFiltrosAdopcion ───
export const hojaFiltrosAdopcionStyles = StyleSheet.create({
  contenido: {
    gap: 18,
    paddingBottom: 4,
  },
  scroll: {
    maxHeight: 460,
  },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  limpiar: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  limpiarTexto: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.textoSecundario,
  },
  boton: {
    flex: 1,
  },
});

// ─── TarjetaRefugio ───
export const tarjetaRefugioStyles = StyleSheet.create({
  tarjeta: {
    borderRadius: RADIOS.lg,
    backgroundColor: COLORES.blanco,
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(11, 59, 53, 0.08)',
  },
  portada: {
    width: '100%',
    height: 120,
    backgroundColor: COLORES.primarioSuave,
  },
  logo: {
    position: 'absolute',
    top: 88,
    left: 16,
    width: 60,
    height: 60,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: COLORES.blanco,
    backgroundColor: COLORES.blanco,
  },
  logoVacio: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.primarioSuave,
  },
  recepcion: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
    fontFamily: FUENTES.bold,
    fontSize: 11.5,
  },
  cuerpo: {
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 34,
    paddingBottom: 16,
  },
  nombre: {
    fontFamily: FUENTES.extrabold,
    fontSize: 17,
    color: COLORES.texto,
  },
  lugar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  lugarTexto: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  descripcion: {
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    lineHeight: 19,
    color: COLORES.texto,
  },
  cupos: {
    gap: 6,
  },
  cuposFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cuposTexto: {
    fontFamily: FUENTES.semibold,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
  enAdopcion: {
    fontFamily: FUENTES.bold,
    fontSize: 12.5,
    color: COLORES.primario,
  },
  botones: {
    flexDirection: 'row',
    gap: 10,
  },
});

// ─── TarjetaSumateRefugio ───
export const tarjetaSumateStyles = StyleSheet.create({
  tarjeta: {
    gap: 10,
    padding: 18,
    borderRadius: RADIOS.lg,
    backgroundColor: '#E9E4FB',
  },
  titulo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 16,
    color: COLORES.texto,
  },
  texto: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORES.texto,
  },
});
