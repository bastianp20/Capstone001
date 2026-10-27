import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { ResultadoSolicitud } from '@/components/ui/ResultadoSolicitud';
import { GrupoCampo } from '@/components/ui/GrupoCampo';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { SelectorPildoras } from '@/components/ui/SelectorPildoras';
import { ASUNTOS_CONTACTO, MAX_CARACTERES_CONTACTO, TEXTOS_CONTACTO as T } from '@/constants/constants';
import { contactoStyles as styles } from '@/css/CuentaPage';
import { useFormularioContacto } from '@/hooks/useFormularioContacto';

const OPCIONES_ASUNTO = ASUNTOS_CONTACTO.map((a) => ({ valor: a, texto: a }));

export default function ContactoScreen() {
  const c = useFormularioContacto();

  if (c.enviado) {
    return (
      <PantallaFormulario titulo={T.titulo}>
        <ResultadoSolicitud titulo={T.enviadoTitulo} detalle={T.enviado} textoBoton={T.volver} onPress={router.back} />
      </PantallaFormulario>
    );
  }

  return (
    <PantallaFormulario
      titulo={T.titulo}
      pie={<BotonPrincipal texto={T.enviar} textoCargando={T.enviando} cargando={c.enviando} onPress={c.enviar} />}>
      <View style={styles.formulario}>
        <Text style={styles.intro}>{T.intro}</Text>
        <GrupoCampo titulo={T.asunto}>
          <SelectorPildoras opciones={OPCIONES_ASUNTO} seleccionado={c.asunto} onSeleccionar={c.setAsunto} />
        </GrupoCampo>
        <CampoTexto
          etiqueta={T.mensaje}
          icono="enviar"
          value={c.mensaje}
          onChangeText={c.setMensaje}
          placeholder={T.mensajePlaceholder}
          multiline
          maxLength={MAX_CARACTERES_CONTACTO}
          ayuda={`${c.mensaje.length}/${MAX_CARACTERES_CONTACTO}`}
        />
        <MensajeFormulario tipo="error" texto={c.error} />
      </View>
    </PantallaFormulario>
  );
}
