import { FUENTES, MARGEN_PANTALLA } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── LoginScreen ───
export const useLoginScreenStyles = crearEstilos((COLORES) => ({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  scroll: {
    flexGrow: 1,
  },
  cuerpo: {
    flex: 1,
    paddingHorizontal: MARGEN_PANTALLA + 4,
    paddingTop: 22,
    gap: 22,
  },
}));

// ─── EncabezadoLogin ───
export const useEncabezadoLoginStyles = crearEstilos((COLORES) => ({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textoLogo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 28,
    letterSpacing: -0.3,
    color: COLORES.blanco,
  },
  mascotas: {
    // Sobresale un poco por debajo de la onda para dar profundidad
    marginBottom: -12,
  },
}));

// ─── TituloLogin ───
export const useTituloLoginStyles = crearEstilos((COLORES) => ({
  contenedor: {
    alignItems: 'center',
    gap: 6,
  },
  titulo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 28,
    letterSpacing: -0.4,
    color: COLORES.texto,
    textAlign: 'center',
  },
  subtitulo: {
    fontFamily: FUENTES.medium,
    fontSize: 15,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
}));

// ─── FormularioIngresar / FormularioCrearCuenta / FormularioRecuperar ───
export const useFormularioLoginStyles = crearEstilos(() => ({
  formulario: {
    gap: 14,
  },
  espacioBoton: {
    paddingTop: 6,
  },
}));

// ─── PieLogin ───
export const usePieLoginStyles = crearEstilos((COLORES) => ({
  contenedor: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: 18,
    paddingTop: 8,
  },
  textoCuenta: {
    fontFamily: FUENTES.medium,
    fontSize: 15,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
  enlaceCuenta: {
    fontFamily: FUENTES.bold,
    color: COLORES.primario,
  },
  textoCentro: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
  enlaceCentro: {
    fontFamily: FUENTES.bold,
    color: COLORES.texto,
  },
  presionado: {
    opacity: 0.6,
  },
}));
