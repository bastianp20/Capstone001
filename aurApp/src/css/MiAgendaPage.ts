import { FUENTES, RADIOS } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── AgendaSemanaVeterinario (pestaña Agenda → "Semana") ───
export const useAgendaSemanaStyles = crearEstilos((COLORES) => ({
  contenedor: {
    gap: 12,
  },
  navegacion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  mes: {
    flex: 1,
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
    textAlign: 'center',
  },
  dias: {
    flexDirection: 'row',
    gap: 6,
  },
  dia: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 8,
    borderRadius: RADIOS.sm,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  diaElegido: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
  },
  diaHoy: {
    borderColor: COLORES.primario,
  },
  diaCorto: {
    fontFamily: FUENTES.semibold,
    fontSize: 11,
    color: COLORES.textoSecundario,
  },
  diaNumero: {
    fontFamily: FUENTES.bold,
    fontSize: 17,
    color: COLORES.texto,
  },
  textoElegido: {
    color: COLORES.blanco,
  },
  punto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORES.coral,
  },
  puntoVacio: {
    backgroundColor: 'transparent',
  },
  lista: {
    gap: 8,
  },
  aviso: {
    gap: 8,
    alignItems: 'flex-start',
  },
}));

// ─── FilaHoraAgenda ───
export const useFilaHoraStyles = crearEstilos((COLORES) => ({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIOS.md,
  },
  hora: {
    width: 50,
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
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
    color: COLORES.textoSecundario,
  },
  libre: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORES.bordeMenta,
    backgroundColor: COLORES.superficie,
  },
  libreTexto: {
    color: COLORES.primarioOscuro,
  },
  tomada: {
    backgroundColor: COLORES.primarioSuave,
  },
  pendiente: {
    backgroundColor: COLORES.estados.pendiente.fondo,
  },
  bloqueada: {
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.estados.completada.fondo,
  },
  pasada: {
    backgroundColor: COLORES.fondo,
    opacity: 0.55,
  },
  presionada: {
    opacity: 0.7,
  },
}));

// ─── ModificarCitaScreen y BloquearHorarioScreen ───
export const useCambioHoraStyles = crearEstilos((COLORES) => ({
  cuerpo: {
    gap: 16,
  },
  resumen: {
    gap: 2,
    padding: 14,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.primarioSuave,
  },
  resumenTitulo: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
  resumenDetalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  seccion: {
    gap: 10,
  },
  etiqueta: {
    fontFamily: FUENTES.bold,
    fontSize: 14.5,
    color: COLORES.texto,
  },
  ayuda: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORES.textoSecundario,
  },
  antesAhora: {
    padding: 12,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.primarioSuave,
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.primarioOscuro,
    overflow: 'hidden',
  },
  avisoPeligro: {
    padding: 12,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.peligroSuave,
    fontFamily: FUENTES.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORES.peligro,
    overflow: 'hidden',
  },
  avisoAmbar: {
    padding: 12,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.aviso,
    fontFamily: FUENTES.semibold,
    fontSize: 13.5,
    color: COLORES.avisoTexto,
    overflow: 'hidden',
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  mitad: {
    flex: 1,
  },
  grupoDia: {
    gap: 6,
  },
  tituloDia: {
    fontFamily: FUENTES.semibold,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  citaAfectada: {
    padding: 10,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.fondo,
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    color: COLORES.texto,
    overflow: 'hidden',
  },
  mensaje: {
    minHeight: 110,
    padding: 12,
    borderRadius: RADIOS.sm,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
    fontFamily: FUENTES.medium,
    fontSize: 14.5,
    lineHeight: 20,
    color: COLORES.texto,
    textAlignVertical: 'top',
  },
  destinatario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.fondo,
  },
  destinatarioTexto: {
    flex: 1,
    fontFamily: FUENTES.semibold,
    fontSize: 14,
    color: COLORES.texto,
  },
  pie: {
    gap: 8,
  },
}));
