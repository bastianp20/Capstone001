import { Linking } from 'react-native';

// Abrir el teléfono, WhatsApp o el correo con un mensaje listo (sin estado).

/** Teléfono guardado (569XXXXXXXX o 9XXXXXXXX) → solo dígitos con el 56 adelante. */
export const telefonoConCodigo = (telefono: number): string => {
  const digitos = String(telefono).replace(/\D/g, '');
  return digitos.startsWith('56') ? digitos : `56${digitos}`;
};

export const llamar = (telefono: number) => Linking.openURL(`tel:+${telefonoConCodigo(telefono)}`);

export const escribirWhatsapp = (telefono: number, mensaje: string) =>
  Linking.openURL(`https://wa.me/${telefonoConCodigo(telefono)}?text=${encodeURIComponent(mensaje)}`);

export const escribirCorreo = (correo: string, asunto: string) => Linking.openURL(`mailto:${correo}?subject=${encodeURIComponent(asunto)}`);
