import { View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { FilaInterruptor } from '@/components/ui/FilaInterruptor';
import { HojaInferior } from '@/components/ui/HojaInferior';
import { TarjetaAviso } from '@/components/ui/TarjetaAviso';
import { MAX_TESTIMONIO_ADOPCION, TEXTOS_CONCRETAR as T } from '@/constants/constants';
import { hojaPostulanteStyles as styles } from '@/css/MisPublicacionesPage';
import type { HojaConcretarAdopcionProps } from '@/interfaces';

/** "¡Tiene familia!": testimonio opcional, traspasar la ficha a quien adopta y confirmar. */
export function HojaConcretarAdopcion({
  visible,
  nombreAnimal,
  persona,
  testimonio,
  onTestimonio,
  traspasar,
  onTraspasar,
  ocupado,
  error,
  onConfirmar,
  onCerrar,
}: HojaConcretarAdopcionProps) {
  return (
    <HojaInferior visible={visible} titulo={T.titulo(nombreAnimal)} onCerrar={onCerrar}>
      <View style={styles.contenido}>
        <TarjetaAviso icono="corazon" texto={T.quien(persona)} />
        <CampoTexto
          etiqueta={T.testimonio}
          icono="mensaje"
          value={testimonio}
          onChangeText={onTestimonio}
          placeholder={T.testimonioPlaceholder}
          multiline
          maxLength={MAX_TESTIMONIO_ADOPCION}
        />
        <FilaInterruptor texto={T.traspasar} valor={traspasar} onCambiar={onTraspasar} />
        <TarjetaAviso texto={T.traspasarDetalle} />
        <MensajeFormulario tipo="error" texto={error} />
        <BotonPrincipal texto={T.confirmar} textoCargando={T.confirmando} cargando={ocupado} onPress={onConfirmar} tono="coral" />
      </View>
    </HojaInferior>
  );
}
