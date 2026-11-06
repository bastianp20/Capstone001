import { FUENTES, RADIOS } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── AdopcionSolidariaScreen ───
export const useSolidariaStyles = crearEstilos((COLORES) => ({
  urgentes: {
    gap: 10,
  },
  filaUrgentes: {
    gap: 10,
    paddingRight: 4,
  },
  lista: {
    gap: 12,
  },
  aviso: {
    padding: 14,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.aviso,
    fontFamily: FUENTES.medium,
    fontSize: 13,
    lineHeight: 19,
    color: COLORES.texto,
    textAlign: 'center',
    overflow: 'hidden',
  },
}));

// ─── TarjetaImpactoSolidario (dentro del encabezado verde) ───
export const useTarjetaImpactoStyles = crearEstilos((COLORES, TONOS_TARJETA) => ({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: RADIOS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: COLORES.translucidoClaro,
  },
  textos: {
    flex: 1,
    gap: 4,
  },
  numero: {
    fontFamily: FUENTES.extrabold,
    fontSize: 21,
    lineHeight: 26,
    color: COLORES.blanco,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    color: COLORES.textoSobrePrimarioSuave,
  },
  insignia: {
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: TONOS_TARJETA.durazno.iconoFondo,
    backgroundColor: COLORES.coral,
    boxShadow: '0 6px 16px rgba(242, 99, 63, 0.35)',
  },
  insigniaTexto: {
    fontFamily: FUENTES.bold,
    fontSize: 11,
    lineHeight: 13,
    color: COLORES.blanco,
    textAlign: 'center',
  },
}));

// ─── TarjetaUrgenteSolidaria ───
export const useTarjetaUrgenteStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    width: 222,
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    borderRadius: RADIOS.md,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  foto: {
    width: 64,
    height: 72,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.huellas,
  },
  cuerpo: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },
  nombre: {
    fontFamily: FUENTES.bold,
    fontSize: 14.5,
    color: COLORES.texto,
  },
}));

// ─── TarjetaAnimalSolidario / TarjetaAtencionPropia ───
export const useTarjetaAnimalSolidarioStyles = crearEstilos((COLORES, TONOS_TARJETA) => ({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
    boxShadow: '0 4px 14px rgba(11, 59, 53, 0.07)',
  },
  presionada: {
    opacity: 0.92,
  },
  foto: {
    width: 76,
    height: 76,
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
    gap: 3,
  },
  nombre: {
    fontFamily: FUENTES.extrabold,
    fontSize: 16,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
  quien: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  quienTexto: {
    flex: 1,
    fontFamily: FUENTES.semibold,
    fontSize: 12.5,
    color: COLORES.texto,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 3,
  },
  lado: {
    alignItems: 'flex-end',
    gap: 8,
  },
  atendido: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  atendidoTexto: {
    fontFamily: FUENTES.bold,
    fontSize: 11.5,
    color: COLORES.primario,
  },
  resumen: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORES.texto,
  },
}));

// ─── RegistrarAtencionSolidariaScreen ───
export const useAtencionSolidariaStyles = crearEstilos((COLORES) => ({
  cuerpo: {
    gap: 20,
  },
  tipos: {
    flexDirection: 'row',
    gap: 10,
  },
  ficha: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
  },
  aviso: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORES.textoSecundario,
  },
  pie: {
    gap: 8,
  },
}));

// ─── TarjetaTipoAtencion ───
export const useTarjetaTipoAtencionStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    flex: 1,
    gap: 4,
    padding: 14,
    borderRadius: RADIOS.md,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
  },
  seleccionada: {
    borderWidth: 2,
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primarioSuave,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titulo: {
    flexShrink: 1,
    fontFamily: FUENTES.bold,
    fontSize: 14.5,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 11.5,
    color: COLORES.textoSecundario,
  },
}));

// ─── FilaFichaAtencion ───
export const useFilaFichaAtencionStyles = crearEstilos((COLORES) => ({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  textos: {
    flex: 1,
    gap: 1,
  },
  texto: {
    fontFamily: FUENTES.semibold,
    fontSize: 14.5,
    color: COLORES.texto,
  },
  yaEnFicha: {
    fontFamily: FUENTES.medium,
    fontSize: 12,
    color: COLORES.primario,
  },
}));

// ─── AtencionSolidariaGuardada ───
export const useAtencionGuardadaStyles = crearEstilos((COLORES) => ({
  contenedor: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
  },
  titulo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 28,
    color: COLORES.coralOscuro,
    textAlign: 'center',
  },
  texto: {
    fontFamily: FUENTES.medium,
    fontSize: 15.5,
    lineHeight: 22,
    color: COLORES.texto,
    textAlign: 'center',
  },
  sello: {
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: RADIOS.lg,
    backgroundColor: COLORES.superficie,
    boxShadow: '0 8px 20px rgba(11, 59, 53, 0.08)',
  },
  selloFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selloNombre: {
    fontFamily: FUENTES.bold,
    fontSize: 17,
    color: COLORES.texto,
  },
  impacto: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
  },
  impactoTexto: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
  impactoFlecha: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: COLORES.primarioSuave,
  },
  botones: {
    alignSelf: 'stretch',
    gap: 10,
  },
}));

// ─── TarjetaAliadoSolidario (perfil del veterinario) ───
export const useTarjetaAliadoStyles = crearEstilos((COLORES, TONOS_TARJETA) => ({
  tarjeta: {
    gap: 6,
    padding: 16,
    borderRadius: RADIOS.lg,
    borderWidth: 1.5,
    borderColor: TONOS_TARJETA.durazno.iconoFondo,
    backgroundColor: COLORES.superficie,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textos: {
    flex: 1,
    gap: 3,
  },
  titulo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 16.5,
    color: COLORES.coralOscuro,
  },
  texto: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORES.texto,
  },
  atenciones: {
    alignSelf: 'flex-end',
    fontFamily: FUENTES.medium,
    fontSize: 12,
    color: COLORES.textoSecundario,
  },
}));
