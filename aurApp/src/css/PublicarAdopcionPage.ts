import { FUENTES, RADIOS } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── PublicarAdopcionScreen y sus pasos ───
export const usePublicarAdopcionStyles = crearEstilos((COLORES) => ({
  paso: {
    gap: 20,
  },
  pie: {
    gap: 8,
  },
  filaEdad: {
    flexDirection: 'row',
    gap: 10,
  },
  mitad: {
    flex: 1,
  },
  rasgos: {
    gap: 14,
    padding: 14,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
  },
  interruptores: {
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
  },
}));

// ─── SelectorFotosAdopcion ───
export const useSelectorFotosStyles = crearEstilos((COLORES) => ({
  fila: {
    gap: 10,
    paddingRight: 4,
  },
  foto: {
    width: 92,
    height: 115,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.huellas,
  },
  quitar: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: 'rgba(15, 23, 32, 0.6)',
  },
  principal: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORES.coral,
    color: COLORES.blanco,
    fontFamily: FUENTES.bold,
    fontSize: 10.5,
  },
  agregar: {
    width: 92,
    height: 115,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: RADIOS.sm,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primarioSuave,
  },
  agregarError: {
    borderColor: COLORES.error,
    backgroundColor: COLORES.errorSuave,
  },
  agregarTexto: {
    fontFamily: FUENTES.bold,
    fontSize: 12,
    color: COLORES.primarioOscuro,
    textAlign: 'center',
  },
}));

// ─── SelectorNivel ───
export const useSelectorNivelStyles = crearEstilos((COLORES) => ({
  contenedor: {
    gap: 8,
  },
  titulo: {
    fontFamily: FUENTES.semibold,
    fontSize: 14,
    color: COLORES.texto,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nivel: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
  },
  nivelActivo: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
  },
  nivelTexto: {
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.texto,
  },
  nivelTextoActivo: {
    color: COLORES.blanco,
  },
  noSe: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORES.bordeCampo,
  },
  noSeActivo: {
    borderColor: COLORES.texto,
    backgroundColor: COLORES.texto,
  },
  noSeTexto: {
    fontFamily: FUENTES.semibold,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
  noSeTextoActivo: {
    color: COLORES.blanco,
  },
}));

// ─── VistaPreviaPublicacion ───
export const useVistaPreviaStyles = crearEstilos((COLORES) => ({
  contenedor: {
    gap: 14,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
    textAlign: 'center',
  },
  tarjeta: {
    alignSelf: 'center',
    width: 190,
  },
}));
