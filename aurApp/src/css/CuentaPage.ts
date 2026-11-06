import { FUENTES } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── DatosPersonalesScreen ───
export const useDatosPersonalesStyles = crearEstilos(() => ({
  formulario: {
    gap: 16,
  },
}));

// ─── ContactoScreen ───
export const useContactoStyles = crearEstilos((COLORES) => ({
  formulario: {
    gap: 16,
  },
  intro: {
    fontFamily: FUENTES.medium,
    fontSize: 15,
    lineHeight: 22,
    color: COLORES.textoSecundario,
  },
}));

// ─── EliminarCuentaScreen / FormularioEliminarCuenta ───
export const useEliminarCuentaStyles = crearEstilos((COLORES) => ({
  formulario: {
    gap: 16,
  },
  cabecera: {
    alignItems: 'center',
    gap: 12,
  },
  lamentamos: {
    fontFamily: FUENTES.semibold,
    fontSize: 16,
    lineHeight: 23,
    color: COLORES.texto,
    textAlign: 'center',
  },
  pie: {
    gap: 6,
  },
  enlace: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  enlaceVerde: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.primario,
  },
  enlaceNeutro: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
}));

// ─── SolicitudEliminacionEnviada ───
export const useSolicitudEnviadaStyles = crearEstilos((COLORES) => ({
  contenedor: {
    gap: 14,
    paddingTop: 8,
  },
  halo: {
    alignSelf: 'center',
    padding: 10,
    borderRadius: 70,
    backgroundColor: 'rgba(15, 143, 128, 0.08)',
  },
  titulo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 22,
    color: COLORES.texto,
    textAlign: 'center',
  },
  texto: {
    fontFamily: FUENTES.medium,
    fontSize: 15.5,
    lineHeight: 22,
    color: COLORES.texto,
    textAlign: 'center',
  },
  linea: {
    paddingTop: 6,
    paddingHorizontal: 8,
  },
}));
