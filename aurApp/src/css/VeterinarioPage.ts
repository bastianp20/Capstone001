import { StyleSheet } from 'react-native';

import { COLORES, FUENTES, RADIOS, TONOS_TARJETA } from '@/constants/constants';

// ─── HoyScreen ───
export const hoyStyles = StyleSheet.create({
  indicadores: {
    flexDirection: 'row',
    gap: 10,
    marginTop: -52, // las tarjetas se montan sobre la onda del encabezado
  },
  seccion: {
    gap: 12,
  },
});

// ─── TarjetaSiguientePaciente ───
export const tarjetaSiguientePacienteStyles = StyleSheet.create({
  tarjeta: {
    overflow: 'hidden',
    borderRadius: RADIOS.md,
    borderWidth: 1.5,
    borderColor: COLORES.primario,
    backgroundColor: COLORES.blanco,
    boxShadow: '0 10px 24px rgba(11, 59, 53, 0.10)',
  },
  cinta: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORES.primarioSuave,
  },
  cintaTexto: {
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.primarioOscuro,
  },
  cuerpo: {
    gap: 10,
    padding: 14,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textos: {
    flex: 1,
    gap: 1,
  },
  nombre: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
  descripcion: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  hora: {
    fontFamily: FUENTES.extrabold,
    fontSize: 26,
    color: COLORES.texto,
  },
  acciones: {
    flexDirection: 'row',
    gap: 10,
  },
  boton: {
    flex: 1,
    alignItems: 'stretch',
  },
});

// ─── AgendaDelDia ───
export const agendaDelDiaStyles = StyleSheet.create({
  contenedor: {
    gap: 0,
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  hora: {
    width: 44,
    paddingTop: 14,
    fontFamily: FUENTES.bold,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  guia: {
    width: 12,
    alignItems: 'center',
  },
  punto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 18,
  },
  linea: {
    flex: 1,
    width: 2,
    backgroundColor: COLORES.bordeCampo,
  },
  tarjeta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    padding: 12,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.blanco,
    boxShadow: '0 4px 12px rgba(11, 59, 53, 0.06)',
  },
  presionada: {
    opacity: 0.8,
  },
  textos: {
    flex: 1,
    gap: 1,
  },
  motivo: {
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.texto,
  },
  dueno: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
});

// ─── TarjetaPaciente ───
export const tarjetaPacienteStyles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.blanco,
    boxShadow: '0 4px 14px rgba(11, 59, 53, 0.06)',
  },
  presionada: {
    opacity: 0.85,
  },
  textos: {
    flex: 1,
    gap: 3,
    alignItems: 'flex-start',
  },
  nombre: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
  especie: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
});

// ─── FichaPacienteScreen ───
export const fichaPacienteStyles = StyleSheet.create({
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  nombre: {
    fontFamily: FUENTES.extrabold,
    fontSize: 22,
    color: COLORES.texto,
  },
  descripcion: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dueno: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.blanco,
  },
  duenoTexto: {
    flex: 1,
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
  },
});

// ─── DatoFicha ───
export const datoFichaStyles = StyleSheet.create({
  dato: {
    minWidth: '30%',
    flexGrow: 1,
    gap: 2,
    padding: 12,
    borderRadius: RADIOS.sm,
    backgroundColor: TONOS_TARJETA.menta.fondo,
  },
  etiqueta: {
    fontFamily: FUENTES.semibold,
    fontSize: 11.5,
    color: COLORES.textoSecundario,
  },
  valor: {
    fontFamily: FUENTES.bold,
    fontSize: 14.5,
    color: COLORES.texto,
  },
});

// ─── TarjetaDerivacion ───
export const tarjetaDerivacionStyles = StyleSheet.create({
  tarjeta: {
    gap: 6,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  mascota: {
    flex: 1,
    fontFamily: FUENTES.bold,
    fontSize: 15.5,
    color: COLORES.texto,
  },
  dueno: {
    fontFamily: FUENTES.medium,
    color: COLORES.textoSecundario,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  motivo: {
    fontFamily: FUENTES.semibold,
    fontSize: 14,
    color: COLORES.texto,
  },
  acciones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 4,
  },
});
