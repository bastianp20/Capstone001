import { Linking } from 'react-native';

/** Abre la dirección en la app de mapas del teléfono (o en Google Maps en el navegador). */
export const abrirEnMapa = (direccion: string) =>
  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`);
