import { FUENTES, MARGEN_PANTALLA, RADIOS } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── FichaAdopcionScreen ───
export const useFichaAdopcionStyles = crearEstilos((COLORES) => ({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  cuerpo: {
    marginTop: -26,
    gap: 16,
    paddingHorizontal: MARGEN_PANTALLA,
    paddingTop: 22,
    borderTopLeftRadius: RADIOS.xl,
    borderTopRightRadius: RADIOS.xl,
    backgroundColor: COLORES.fondo,
  },
  seccion: {
    gap: 12,
    padding: 16,
    borderRadius: RADIOS.lg,
    backgroundColor: COLORES.superficie,
  },
  historia: {
    fontFamily: FUENTES.medium,
    fontSize: 14.5,
    lineHeight: 22,
    color: COLORES.texto,
  },
  reportar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  reportarTexto: {
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.peligro,
  },
  ley: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
  pie: {
    paddingHorizontal: MARGEN_PANTALLA,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  estado: {
    flex: 1,
  },
}));

// ─── GaleriaFotosAdopcion ───
export const useGaleriaFotosStyles = crearEstilos((COLORES, TONOS_TARJETA) => ({
  contenedor: {
    backgroundColor: COLORES.huellas,
  },
  sinFoto: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TONOS_TARJETA.durazno.fondo,
  },
  barra: {
    position: 'absolute',
    left: MARGEN_PANTALLA,
    right: MARGEN_PANTALLA,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acciones: {
    flexDirection: 'row',
    gap: 10,
  },
  puntos: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  punto: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  puntoActivo: {
    width: 18,
    backgroundColor: COLORES.superficie,
  },
}));

// ─── CabeceraFichaAdopcion ───
export const useCabeceraFichaStyles = crearEstilos((COLORES, TONOS_TARJETA) => ({
  contenedor: {
    gap: 10,
  },
  filaNombre: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  nombre: {
    fontFamily: FUENTES.extrabold,
    fontSize: 30,
    letterSpacing: -0.5,
    color: COLORES.texto,
  },
  enProceso: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORES.estados.en_curso.fondo,
    color: COLORES.estados.en_curso.texto,
    fontFamily: FUENTES.bold,
    fontSize: 12,
  },
  detalle: {
    fontFamily: FUENTES.semibold,
    fontSize: 14.5,
    color: COLORES.textoSecundario,
  },
  lugar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    overflow: 'hidden',
    fontFamily: FUENTES.bold,
    fontSize: 12.5,
  },
  frase: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: RADIOS.md,
    backgroundColor: TONOS_TARJETA.crema.fondo,
  },
  fraseTexto: {
    flex: 1,
    fontFamily: FUENTES.semibold,
    fontSize: 14.5,
    lineHeight: 21,
    fontStyle: 'italic',
    color: COLORES.texto,
  },
}));

// ─── BarrasRasgos ───
export const useBarrasRasgosStyles = crearEstilos((COLORES) => ({
  lista: {
    gap: 12,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  etiqueta: {
    width: 96,
    fontFamily: FUENTES.semibold,
    fontSize: 13.5,
    color: COLORES.texto,
  },
  barras: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
  },
  barra: {
    flex: 1,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORES.borde,
  },
  barraLlena: {
    backgroundColor: COLORES.primario,
  },
  sinDato: {
    flex: 1,
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
}));

// ─── SaludAdopcion ───
export const useSaludAdopcionStyles = crearEstilos((COLORES) => ({
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  item: {
    flexBasis: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.fondo,
  },
  itemAncho: {
    flexBasis: '100%',
  },
  icono: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  textos: {
    flex: 1,
    gap: 1,
  },
  etiqueta: {
    fontFamily: FUENTES.medium,
    fontSize: 12,
    color: COLORES.textoSecundario,
  },
  valor: {
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.texto,
  },
}));

// ─── TarjetaChequeoAdopcion ───
export const useTarjetaChequeoStyles = crearEstilos((COLORES, TONOS_TARJETA) => ({
  tarjeta: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: RADIOS.lg,
    backgroundColor: COLORES.primarioSuave,
  },
  solicitado: {
    backgroundColor: TONOS_TARJETA.crema.fondo,
  },
  icono: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: COLORES.superficie,
  },
  cuerpo: {
    flex: 1,
    gap: 4,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
  },
  quien: {
    fontFamily: FUENTES.semibold,
    fontSize: 12.5,
    color: COLORES.primarioOscuro,
  },
  texto: {
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    lineHeight: 19,
    color: COLORES.texto,
  },
}));

// ─── TarjetaPublicador ───
export const useTarjetaPublicadorStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: RADIOS.lg,
    backgroundColor: COLORES.superficie,
  },
  cuerpo: {
    flex: 1,
    gap: 2,
  },
  etiqueta: {
    fontFamily: FUENTES.medium,
    fontSize: 12,
    color: COLORES.textoSecundario,
  },
  nombre: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
}));
