import { FUENTES, RADIOS } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── TarjetaPublicacionPropia ───
export const useTarjetaPublicacionStyles = crearEstilos((COLORES, TONOS_TARJETA) => ({
  tarjeta: {
    gap: 12,
    padding: 14,
    borderRadius: RADIOS.lg,
    backgroundColor: COLORES.superficie,
    boxShadow: '0 6px 16px rgba(11, 59, 53, 0.06)',
  },
  presionada: {
    opacity: 0.92,
  },
  fila: {
    flexDirection: 'row',
    gap: 12,
  },
  foto: {
    width: 74,
    height: 74,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.huellas,
  },
  sinFoto: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TONOS_TARJETA.durazno.fondo,
  },
  cuerpo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  filaNombre: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nombre: {
    flexShrink: 1,
    fontFamily: FUENTES.extrabold,
    fontSize: 17,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
  postulaciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postulacionesTexto: {
    fontFamily: FUENTES.bold,
    fontSize: 13,
    color: COLORES.primario,
  },
  sinPostulaciones: {
    color: COLORES.textoSecundario,
  },
  acciones: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
}));

// ─── CaminoACasa ───
export const useCaminoACasaStyles = crearEstilos((COLORES) => ({
  fila: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hito: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  punto: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
  },
  puntoHecho: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
  },
  linea: {
    position: 'absolute',
    top: 6,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: COLORES.borde,
  },
  lineaHecha: {
    backgroundColor: COLORES.primario,
  },
  texto: {
    fontFamily: FUENTES.semibold,
    fontSize: 10.5,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
  textoHecho: {
    color: COLORES.primarioOscuro,
  },
}));

// ─── AvisoModeracionPublicacion ───
export const useAvisoModeracionStyles = crearEstilos((COLORES) => ({
  aviso: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: RADIOS.sm,
  },
  cuerpo: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 13.5,
  },
  texto: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORES.texto,
  },
}));

// ─── PostulantesAdopcionScreen ───
export const usePostulantesStyles = crearEstilos((COLORES) => ({
  resumen: {
    gap: 4,
  },
  resumenTitulo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 18,
    color: COLORES.texto,
  },
  guia: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  lista: {
    gap: 10,
  },
}));

// ─── TarjetaPostulante ───
export const useTarjetaPostulanteStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
  },
  elegida: {
    borderWidth: 2,
    borderColor: COLORES.primario,
  },
  apagada: {
    opacity: 0.6,
  },
  cuerpo: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  filaNombre: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nombre: {
    flexShrink: 1,
    fontFamily: FUENTES.bold,
    fontSize: 15.5,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
}));

// ─── AfinidadAnillo ───
export const useAfinidadAnilloStyles = crearEstilos((COLORES) => ({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centro: {
    position: 'absolute',
    alignItems: 'center',
  },
  porcentaje: {
    fontFamily: FUENTES.extrabold,
    color: COLORES.texto,
  },
}));

// ─── HojaPostulante / HojaConcretarAdopcion ───
export const useHojaPostulanteStyles = crearEstilos((COLORES) => ({
  scroll: {
    maxHeight: 520,
  },
  contenido: {
    gap: 14,
    paddingBottom: 4,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cabeceraTextos: {
    flex: 1,
    gap: 3,
  },
  nombre: {
    fontFamily: FUENTES.extrabold,
    fontSize: 18,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
  match: {
    gap: 8,
    padding: 14,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.fondo,
  },
  matchTitulo: {
    fontFamily: FUENTES.bold,
    fontSize: 14.5,
    color: COLORES.texto,
  },
  razon: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  razonTexto: {
    flex: 1,
    fontFamily: FUENTES.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORES.texto,
  },
  nota: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
  botones: {
    flexDirection: 'row',
    gap: 10,
  },
  boton: {
    flex: 1,
  },
  acciones: {
    gap: 10,
  },
}));
