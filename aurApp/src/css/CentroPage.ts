import { StyleSheet } from 'react-native';

import { COLORES, FUENTES, RADIOS } from '@/constants/constants';

// ─── ResumenCentroScreen ───
export const resumenCentroStyles = StyleSheet.create({
  bento: {
    flexDirection: 'row',
    gap: 12,
    marginTop: -44, // se monta sobre la onda del encabezado
  },
  columna: {
    flex: 1,
    gap: 12,
  },
  seccion: {
    gap: 12,
  },
});

// ─── TarjetaCitasSemana ───
export const tarjetaCitasSemanaStyles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    gap: 4,
    padding: 14,
  },
  etiqueta: {
    fontFamily: FUENTES.semibold,
    fontSize: 14,
    color: COLORES.texto,
  },
  valor: {
    fontFamily: FUENTES.extrabold,
    fontSize: 30,
    color: COLORES.texto,
    marginBottom: 6,
  },
});

// ─── TarjetaSuscripcion ───
export const tarjetaSuscripcionStyles = StyleSheet.create({
  tarjeta: {
    gap: 8,
    padding: 16,
    borderRadius: RADIOS.md,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.blanco,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etiqueta: {
    fontFamily: FUENTES.semibold,
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
  plan: {
    fontFamily: FUENTES.extrabold,
    fontSize: 19,
    color: COLORES.texto,
  },
  detalle: {
    flexShrink: 1,
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
});

// ─── ListaAhoraCentro ───
export const listaAhoraCentroStyles = StyleSheet.create({
  tarjeta: {
    borderRadius: RADIOS.md,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.blanco,
  },
  fila: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  separador: {
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
  },
  hora: {
    minWidth: 48,
    fontFamily: FUENTES.extrabold,
    fontSize: 14,
    color: COLORES.texto,
  },
  textos: {
    flex: 1,
    gap: 3,
    alignItems: 'flex-start',
  },
  mascota: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
  },
  motivo: {
    fontFamily: FUENTES.medium,
    color: COLORES.textoSecundario,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  etiquetas: {
    flexDirection: 'row',
    marginTop: 2,
  },
});

// ─── TarjetaHorarioHoy ───
export const tarjetaHorarioHoyStyles = StyleSheet.create({
  tarjeta: {
    padding: 14,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    color: COLORES.texto,
  },
  texto: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORES.texto,
  },
});

// ─── EquipoScreen / FilaMiembro ───
export const filaMiembroStyles = StyleSheet.create({
  tarjeta: {
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.blanco,
    boxShadow: '0 6px 18px rgba(11, 59, 53, 0.08)',
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  separador: {
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
  },
  textos: {
    flex: 1,
    gap: 1,
  },
  nombre: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
});

// ─── TablaHorarios ───
export const tablaHorariosStyles = StyleSheet.create({
  tarjeta: {
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.blanco,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  separador: {
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
  },
  dia: {
    fontFamily: FUENTES.semibold,
    fontSize: 14.5,
    color: COLORES.texto,
  },
  horas: {
    alignItems: 'flex-end',
  },
  hora: {
    fontFamily: FUENTES.bold,
    fontSize: 14.5,
    color: COLORES.texto,
  },
  cerrado: {
    color: COLORES.textoSecundario,
    fontFamily: FUENTES.medium,
  },
  colacion: {
    fontFamily: FUENTES.medium,
    fontSize: 12,
    color: COLORES.textoSecundario,
  },
});

// ─── MiCentroScreen ───
export const miCentroStyles = StyleSheet.create({
  tarjeta: {
    gap: 10,
    padding: 16,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.blanco,
  },
  nombre: {
    fontFamily: FUENTES.extrabold,
    fontSize: 20,
    color: COLORES.texto,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  texto: {
    flex: 1,
    fontFamily: FUENTES.medium,
    fontSize: 14.5,
    color: COLORES.texto,
  },
  especialidades: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});

// ─── TarjetaPlan ───
export const tarjetaPlanStyles = StyleSheet.create({
  tarjeta: {
    gap: 4,
    padding: 16,
    borderRadius: RADIOS.md,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.blanco,
  },
  actual: {
    borderColor: COLORES.primario,
    backgroundColor: '#F1FAF8',
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nombre: {
    flex: 1,
    fontFamily: FUENTES.extrabold,
    fontSize: 18,
    color: COLORES.texto,
  },
  precio: {
    fontFamily: FUENTES.extrabold,
    fontSize: 24,
    color: COLORES.primarioOscuro,
  },
  porMes: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    color: COLORES.textoSecundario,
  },
  accion: {
    alignItems: 'flex-end',
    paddingTop: 6,
  },
});

// ─── EditarCentroScreen ───
export const editarCentroStyles = StyleSheet.create({
  formulario: {
    gap: 16,
  },
});
