import { StyleSheet } from 'react-native';

import { COLORES, FUENTES, RADIOS, TONOS_TARJETA } from '@/constants/constants';

// ─── ListaCitas ───
export const listaCitasStyles = StyleSheet.create({
  contenedor: {
    gap: 22,
  },
  grupo: {
    gap: 12,
  },
});

// ─── TarjetaCita ───
export const tarjetaCitaStyles = StyleSheet.create({
  tarjeta: {
    borderRadius: RADIOS.md,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.blanco,
  },
  detallada: {
    borderWidth: 1.5,
    borderColor: COLORES.primario,
    backgroundColor: '#EAF7F4',
    boxShadow: '0 10px 24px rgba(11, 59, 53, 0.10)',
  },
  pendiente: {
    borderColor: TONOS_TARJETA.crema.iconoFondo,
    backgroundColor: TONOS_TARJETA.crema.fondo,
  },
  fila: {
    flexDirection: 'row',
    gap: 14,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  fechaCompacta: {
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.texto,
  },
  motivo: {
    flex: 1,
    fontFamily: FUENTES.bold,
    fontSize: 16.5,
    color: COLORES.texto,
  },
  mascota: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nombreMascota: {
    fontFamily: FUENTES.semibold,
    fontSize: 14,
    color: COLORES.texto,
  },
  lugar: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORES.textoSecundario,
  },
  rechazo: {
    fontFamily: FUENTES.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: COLORES.error,
  },
  pie: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(15, 143, 128, 0.15)',
    paddingTop: 12,
  },
});

// ─── BloqueFechaCita ───
export const bloqueFechaCitaStyles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    gap: 8,
  },
  calendario: {
    width: 64,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: RADIOS.sm,
    backgroundColor: TONOS_TARJETA.menta.iconoFondo,
  },
  dia: {
    fontFamily: FUENTES.bold,
    fontSize: 12,
    color: COLORES.primarioOscuro,
  },
  numero: {
    fontFamily: FUENTES.extrabold,
    fontSize: 26,
    lineHeight: 30,
    color: COLORES.texto,
  },
  mes: {
    fontFamily: FUENTES.bold,
    fontSize: 12,
    color: COLORES.primarioOscuro,
  },
  hora: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
  },
});

// ─── AccionesCita ───
export const accionesCitaStyles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
  },
});
