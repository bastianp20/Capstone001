import { StyleSheet } from 'react-native';

import { COLORES, FUENTES, RADIOS, SEPARACION_GRILLA_MASCOTAS } from '@/constants/constants';

// ─── PerfilScreen ───
export const perfilScreenStyles = StyleSheet.create({
  version: {
    fontFamily: FUENTES.medium,
    fontSize: 12,
    color: COLORES.textoSecundario,
    textAlign: 'center',
    marginTop: -6,
  },
});

// ─── CabeceraPerfil ───
export const cabeceraPerfilStyles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    gap: 2,
    marginTop: -70, // el avatar se monta sobre la onda del encabezado
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
});

// ─── GrillaMascotas ───
export const grillaMascotasStyles = StyleSheet.create({
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SEPARACION_GRILLA_MASCOTAS,
  },
});

// ─── TarjetaMascotaPerfil ───
export const tarjetaMascotaPerfilStyles = StyleSheet.create({
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
});

// ─── TarjetaAgregarMascota ───
export const tarjetaAgregarMascotaStyles = StyleSheet.create({
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
    backgroundColor: COLORES.blanco,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 13,
    color: COLORES.texto,
    textAlign: 'center',
  },
});

// ─── MenuPerfil ───
export const menuPerfilStyles = StyleSheet.create({
  tarjeta: {
    overflow: 'hidden',
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.blanco,
    boxShadow: '0 6px 18px rgba(11, 59, 53, 0.08)',
  },
});
