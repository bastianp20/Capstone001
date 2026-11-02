import { Text, View } from 'react-native';

import { TEXTOS_HOJA_CONTACTO as T } from '@/constants/constants';
import { hojaContactoStyles as styles } from '@/css/Compartido';
import type { HojaContactoProps } from '@/interfaces';
import { escribirCorreo, escribirWhatsapp, llamar } from '@/lib/contacto';

import { HojaInferior } from './HojaInferior';
import { OpcionHoja } from './OpcionHoja';

/** Hoja para contactar a alguien: llamar, WhatsApp (con un mensaje listo) o correo. */
export function HojaContacto({ visible, contacto, onCerrar }: HojaContactoProps) {
  const telefono = contacto?.telefono ?? null;
  const correo = contacto?.correo ?? null;
  return (
    <HojaInferior visible={visible} titulo={contacto ? T.titulo(contacto.nombre) : ''} onCerrar={onCerrar}>
      {telefono && contacto && (
        <View style={styles.fila}>
          <OpcionHoja icono="telefono" texto={T.llamar} tono="menta" onPress={() => llamar(telefono)} />
          <OpcionHoja icono="chat" texto={T.whatsapp} tono="lavanda" onPress={() => escribirWhatsapp(telefono, contacto.mensajeWhatsapp)} />
        </View>
      )}
      {correo && contacto && <OpcionHoja icono="correo" texto={T.correo} tono="durazno" onPress={() => escribirCorreo(correo, contacto.asuntoCorreo)} />}
      {!telefono && !correo && <Text style={styles.sinDatos}>{T.sinDatos}</Text>}
    </HojaInferior>
  );
}
