import { StyleSheet } from 'react-native';

import { COLORES, FUENTES, RADIOS } from '@/constants/constants';

// ─── DerivarPacienteScreen ───
export const derivarStyles = StyleSheet.create({
  cuerpo: {
    gap: 16,
  },
  resumen: {
    fontFamily: FUENTES.bold,
    fontSize: 16.5,
    color: COLORES.texto,
  },
  lista: {
    gap: 10,
  },
  pie: {
    gap: 8,
  },
});

// ─── TarjetaDestinoDerivacion ───
export const tarjetaDestinoDerivacionStyles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: RADIOS.md,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.blanco,
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
  nombre: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
    paddingRight: 24,
  },
  lugar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  lugarTexto: {
    flex: 1,
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    fontFamily: FUENTES.bold,
    fontSize: 12,
  },
  check: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: COLORES.primario,
  },
});
