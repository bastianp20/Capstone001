import { FUENTES, RADIOS } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── Pasos (PedirHoraScreen y sus pasos) ───
export const usePasosPedirHoraStyles = crearEstilos((COLORES) => ({
  paso: {
    gap: 16,
  },
  pie: {
    gap: 8,
  },
  resumen: {
    fontFamily: FUENTES.bold,
    fontSize: 17,
    lineHeight: 23,
    color: COLORES.texto,
  },
  lista: {
    gap: 12,
  },
  lugar: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORES.primarioSuave,
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.primarioOscuro,
  },
}));

// ─── FiltroEspecialidades ───
export const useFiltroEspecialidadesStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    gap: 4,
    padding: 16,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  titulo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 18,
    color: COLORES.texto,
  },
  ayuda: {
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    color: COLORES.textoSecundario,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  quitar: {
    marginLeft: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  quitarTexto: {
    fontFamily: FUENTES.semibold,
    fontSize: 13.5,
    color: COLORES.textoSecundario,
    textDecorationLine: 'underline',
  },
}));

// ─── TarjetaDestinoCita ───
export const useTarjetaDestinoCitaStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 16,
    borderRadius: RADIOS.md,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  seleccionada: {
    borderWidth: 2,
    borderColor: COLORES.primario,
    boxShadow: '0 10px 22px rgba(15, 143, 128, 0.14)',
  },
  presionada: {
    opacity: 0.9,
  },
  cuerpo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 16.5,
    color: COLORES.texto,
    paddingRight: 22,
  },
  detalle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detalleTexto: {
    flex: 1,
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    color: COLORES.textoSecundario,
  },
  pie: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  chip: {
    maxWidth: '100%',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    fontFamily: FUENTES.bold,
    fontSize: 12,
  },
  check: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: COLORES.primario,
  },
}));

// ─── MiniMascotaCita ───
export const useMiniMascotaCitaStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: RADIOS.md,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  texto: {
    flex: 1,
    fontFamily: FUENTES.medium,
    fontSize: 15,
    color: COLORES.texto,
  },
  nombre: {
    fontFamily: FUENTES.bold,
  },
  cambiar: {
    fontFamily: FUENTES.bold,
    fontSize: 14.5,
    color: COLORES.primario,
  },
}));

// ─── GrillaDias ───
export const useGrillaDiasStyles = crearEstilos((COLORES) => ({
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dia: {
    width: 62,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: RADIOS.sm,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
  },
  diaActivo: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
  },
  diaSemana: {
    fontFamily: FUENTES.bold,
    fontSize: 11,
    color: COLORES.textoSecundario,
  },
  numero: {
    fontFamily: FUENTES.extrabold,
    fontSize: 20,
    lineHeight: 24,
    color: COLORES.texto,
  },
  mes: {
    fontFamily: FUENTES.bold,
    fontSize: 11,
    color: COLORES.textoSecundario,
  },
  textoActivo: {
    color: COLORES.blanco,
  },
}));

// ─── GrillaHoras ───
export const useGrillaHorasStyles = crearEstilos((COLORES) => ({
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hora: {
    width: 74,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
  },
  horaActiva: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.texto,
  },
  textoActivo: {
    color: COLORES.blanco,
  },
}));
