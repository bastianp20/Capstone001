import { StyleSheet } from 'react-native';

import { COLORES, FUENTES, RADIOS, TONOS_TARJETA } from '@/constants/constants';

// ─── AtencionScreen / RegistrarAtencionScreen ───
export const atencionStyles = StyleSheet.create({
  cuerpo: {
    gap: 16,
  },
  titulo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 19,
    color: COLORES.texto,
  },
  acciones: {
    flexDirection: 'row',
    gap: 10,
  },
  seGuarda: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
  pie: {
    gap: 8,
  },
});

// ─── PildoraEnConsulta ───
export const pildoraEnConsultaStyles = StyleSheet.create({
  pildora: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  punto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORES.peligro,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 12,
    color: COLORES.texto,
  },
});

// ─── TarjetaPacienteAtencion ───
export const tarjetaPacienteAtencionStyles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: RADIOS.lg,
    backgroundColor: COLORES.blanco,
    boxShadow: '0 10px 24px rgba(11, 59, 53, 0.10)',
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  nombre: {
    fontFamily: FUENTES.extrabold,
    fontSize: 20,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    color: COLORES.textoSecundario,
  },
  alergia: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: COLORES.peligroSuave,
  },
  alergiaTexto: {
    flexShrink: 1,
    fontFamily: FUENTES.bold,
    fontSize: 12.5,
    color: COLORES.peligro,
  },
});

// ─── MotivoConsulta ───
export const motivoConsultaStyles = StyleSheet.create({
  tarjeta: {
    gap: 6,
    padding: 16,
    borderRadius: RADIOS.md,
    backgroundColor: TONOS_TARJETA.crema.fondo,
    borderWidth: 1,
    borderColor: TONOS_TARJETA.crema.iconoFondo,
  },
  etiqueta: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  motivo: {
    fontFamily: FUENTES.bold,
    fontSize: 16.5,
    lineHeight: 22,
    color: COLORES.texto,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: TONOS_TARJETA.crema.iconoFondo,
    fontFamily: FUENTES.semibold,
    fontSize: 12.5,
    color: COLORES.texto,
  },
});

// ─── TarjetaAccionAtencion ───
export const tarjetaAccionAtencionStyles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    minHeight: 150,
    gap: 8,
    padding: 14,
    borderRadius: RADIOS.md,
    borderWidth: 1,
  },
  presionada: {
    transform: [{ scale: 0.97 }],
  },
  icono: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginBottom: 6,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 15.5,
    lineHeight: 20,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
  hecho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hechoTexto: {
    fontFamily: FUENTES.bold,
    fontSize: 12.5,
    color: COLORES.primario,
  },
});

