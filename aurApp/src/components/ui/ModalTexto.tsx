import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';

import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';

import { useModalTextoStyles } from '@/css/Compartido';
import { useAltoTeclado } from '@/hooks/useAltoTeclado';
import type { ModalTextoProps } from '@/interfaces';

import { BotonPequeno } from './BotonPequeno';
import { useColores } from '@/context/TemaContext';

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
  const COLORES = useColores();
  const styles = useModalTextoStyles();
  const [texto, setTexto] = useState('');
  const altoTeclado = useAltoTeclado();

  // Cada vez que se abre, parte vacía
  useEffect(() => {
    if (visible) setTexto('');
  }, [visible]);

  const sinTexto = obligatorio && !texto.trim();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={[styles.fondo, { paddingBottom: altoTeclado }]}>
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
      </View>
    </Modal>
  );
}
