import { FUENTES, RADIOS, SEPARACION_GRILLA_MASCOTAS } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── PerfilScreen ───
export const usePerfilScreenStyles = crearEstilos((COLORES) => ({
  version: {
    fontFamily: FUENTES.medium,
    fontSize: 12,
    color: COLORES.textoSecundario,
    textAlign: 'center',
    marginTop: -6,
  },
}));

// ─── CabeceraPerfil ───
export const useCabeceraPerfilStyles = crearEstilos((COLORES) => ({
  contenedor: {
    alignItems: 'center',
    gap: 2,
    marginTop: -70, // el avatar se monta sobre la onda del encabezado
  },
  foto: {
    position: 'relative',
  },
  marco: {
    borderRadius: 50,
    padding: 3,
    backgroundColor: COLORES.superficie,
    boxShadow: '0 8px 20px rgba(11, 59, 53, 0.18)',
  },
  camara: {
    position: 'absolute',
    right: -2,
    bottom: 2,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    borderWidth: 3,
    borderColor: COLORES.superficie,
    backgroundColor: COLORES.coral,
  },
  nombre: {
    fontFamily: FUENTES.extrabold,
    fontSize: 22,
    color: COLORES.texto,
    textAlign: 'center',
    marginTop: 10,
  },
  correo: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    color: COLORES.textoSecundario,
  },
}));

// ─── GrillaMascotas ───
export const useGrillaMascotasStyles = crearEstilos(() => ({
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SEPARACION_GRILLA_MASCOTAS,
  },
}));

// ─── TarjetaMascotaPerfil ───
export const useTarjetaMascotaPerfilStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: RADIOS.md,
  },
  presionada: {
    transform: [{ scale: 0.97 }],
  },
  nombre: {
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.texto,
    marginTop: 4,
  },
  especie: {
    fontFamily: FUENTES.medium,
    fontSize: 12,
    color: COLORES.textoSecundario,
  },
}));

// ─── TarjetaAgregarMascota ───
export const useTarjetaAgregarMascotaStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 130,
    padding: 8,
    borderRadius: RADIOS.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORES.bordeCampo,
  },
  presionada: {
    backgroundColor: COLORES.superficie,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 13,
    color: COLORES.texto,
    textAlign: 'center',
  },
}));

// ─── MenuPerfil ───
export const useMenuPerfilStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    overflow: 'hidden',
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
    boxShadow: '0 6px 18px rgba(11, 59, 53, 0.08)',
  },
}));

// ─── HojaFotoPerfil ───
export const useHojaFotoPerfilStyles = crearEstilos((COLORES) => ({
  vista: {
    alignSelf: 'center',
    marginBottom: 4,
  },
  cargando: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
    backgroundColor: 'rgba(15, 23, 32, 0.45)',
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  ayuda: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
  cancelar: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  cancelarTexto: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
}));

// ─── HojaApariencia ───
export const useHojaAparienciaStyles = crearEstilos((COLORES) => ({
  bajada: {
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    lineHeight: 19,
    color: COLORES.textoSecundario,
  },
}));
