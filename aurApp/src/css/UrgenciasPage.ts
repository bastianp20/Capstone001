import { FUENTES, RADIOS } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── UrgenciasScreen ───
export const useUrgenciasStyles = crearEstilos((COLORES) => ({
  cuerpo: {
    gap: 14,
  },
  consejo: {
    padding: 14,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.peligroSuave,
    fontFamily: FUENTES.semibold,
    fontSize: 13.5,
    lineHeight: 19,
    color: COLORES.peligro,
    overflow: 'hidden',
  },
  lista: {
    gap: 10,
  },
  seccion: {
    gap: 10,
  },
}));

// ─── FiltrosUrgencias ───
export const useFiltrosUrgenciasStyles = crearEstilos((COLORES) => ({
  contenedor: {
    gap: 6,
    padding: 12,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
  },
}));

// ─── TarjetaCentroUrgencia y TarjetaVetUrgencia ───
export const useTarjetaUrgenciaStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    gap: 10,
    padding: 16,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
  },
  cerrada: {
    opacity: 0.75,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  nombre: {
    fontFamily: FUENTES.bold,
    fontSize: 16.5,
    color: COLORES.texto,
  },
  direccion: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  etiquetas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  hoy: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.texto,
  },
  acciones: {
    flexDirection: 'row',
    gap: 8,
  },
  accion: {
    flex: 1,
  },
  sinTelefono: {
    flex: 1,
    alignSelf: 'center',
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
}));

// ─── TarjetaEntradaUrgencias (login e inicio del dueño) ───
export const useEntradaUrgenciasStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    gap: 8,
    padding: 16,
    borderRadius: RADIOS.md,
    borderWidth: 1.5,
    borderColor: COLORES.bordePeligro,
    backgroundColor: COLORES.peligroSuave,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titulo: {
    flex: 1,
    fontFamily: FUENTES.bold,
    fontSize: 15.5,
    color: COLORES.peligro,
  },
  texto: {
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    lineHeight: 19,
    color: COLORES.texto,
  },
  boton: {
    alignSelf: 'flex-start',
  },
}));
