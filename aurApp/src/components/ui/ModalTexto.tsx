import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { COLORES } from '@/constants/constants';
import { modalTextoStyles as styles } from '@/css/Compartido';
import type { ModalTextoProps } from '@/interfaces';

import { BotonPequeno } from './BotonPequeno';

/** Ventana para escribir un texto antes de una acción: motivo de rechazo, resultado, respuesta. */
export function ModalTexto({
  visible,
  titulo,
  detalle,
  placeholder,
  textoConfirmar,
  obligatorio,
  peligro,
  cargando,
  error,
  onConfirmar,
  onCerrar,
}: ModalTextoProps) {
  const [texto, setTexto] = useState('');

  // Cada vez que se abre, parte vacía
  useEffect(() => {
    if (visible) setTexto('');
  }, [visible]);

  const sinTexto = obligatorio && !texto.trim();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <KeyboardAvoidingView style={styles.fondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.cerrarFondo} onPress={onCerrar} accessibilityLabel="Cerrar" />
        <View style={styles.tarjeta}>
          <Text style={styles.titulo}>{titulo}</Text>
          {detalle && <Text style={styles.detalle}>{detalle}</Text>}
          <TextInput
            style={styles.input}
            value={texto}
            onChangeText={setTexto}
            placeholder={placeholder}
            placeholderTextColor={COLORES.placeholder}
            selectionColor={COLORES.primario}
            multiline
            maxLength={500}
            autoFocus
            accessibilityLabel={titulo}
          />
          <MensajeFormulario tipo="error" texto={error ?? ''} />
          <View style={styles.acciones}>
            <BotonPequeno texto="Cancelar" onPress={onCerrar} />
            <BotonPequeno
              texto={textoConfirmar}
              variante={peligro ? 'peligro' : 'primario'}
              cargando={cargando}
              deshabilitado={sinTexto}
              onPress={() => onConfirmar(texto)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
