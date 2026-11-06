import { type ComponentRef, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';

import { useCampoTextoStyles } from '@/css/Compartido';
import type { CampoTextoProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

/** Campo con ícono y etiqueta dentro de la caja, como en el diseño del login. */
export function CampoTexto({ etiqueta, icono, error, ayuda, accesorioDerecho, onFocus, onBlur, ...inputProps }: CampoTextoProps) {
  const COLORES = useColores();
  const styles = useCampoTextoStyles();
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  const [enfocado, setEnfocado] = useState(false);

  const colorIcono = error ? COLORES.error : enfocado ? COLORES.primario : COLORES.textoSecundario;

  return (
    <View style={styles.contenedor}>
      <Pressable
        onPress={() => input.current?.focus()}
        style={[styles.caja, enfocado && styles.cajaEnfocada, !!error && styles.cajaError]}>
        <Icono nombre={icono} tamano={20} color={colorIcono} />
        <View style={styles.textos}>
          <Text style={[styles.etiqueta, enfocado && styles.etiquetaEnfocada, !!error && styles.etiquetaError]}>
            {etiqueta}
          </Text>
          <TextInput
            ref={input}
            style={[styles.input, inputProps.multiline && styles.inputMultilinea]}
            placeholderTextColor={COLORES.placeholder}
            selectionColor={COLORES.primario}
            accessibilityLabel={etiqueta}
            onFocus={(e) => {
              setEnfocado(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setEnfocado(false);
              onBlur?.(e);
            }}
            {...inputProps}
          />
        </View>
        {accesorioDerecho}
      </Pressable>
      {error ? (
        <Text style={styles.textoError}>{error}</Text>
      ) : ayuda ? (
        <Text style={styles.textoAyuda}>{ayuda}</Text>
      ) : null}
    </View>
  );
}
