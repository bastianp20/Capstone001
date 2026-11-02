import { Text, View } from 'react-native';

import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { Casilla } from '@/components/ui/Casilla';
import { ChipsMultiples } from '@/components/ui/ChipsMultiples';
import { GrupoCampo } from '@/components/ui/GrupoCampo';
import { TarjetaAviso } from '@/components/ui/TarjetaAviso';
import { TarjetaListaIconos } from '@/components/ui/TarjetaListaIconos';
import { MAX_COMENTARIO_ELIMINACION, MOTIVOS_ELIMINACION, QUE_PASA_ELIMINAR, TEXTOS_ELIMINAR_CUENTA as T } from '@/constants/constants';
import { eliminarCuentaStyles as styles } from '@/css/CuentaPage';
import type { FormularioEliminarCuentaProps } from '@/interfaces';

import { IlustracionDespedida } from './IlustracionDespedida';

/** Qué pasa, qué se conserva, por qué se va (opcional) y "entiendo". */
export function FormularioEliminarCuenta({ motivos, onMotivo, comentario, onComentario, entiende, onEntiende, rechazoAnterior }: FormularioEliminarCuentaProps) {
  return (
    <View style={styles.formulario}>
      <View style={styles.cabecera}>
        <IlustracionDespedida />
        <Text style={styles.lamentamos}>{T.lamentamos}</Text>
      </View>
      {rechazoAnterior !== null && <MensajeFormulario tipo="error" texto={[T.rechazada, rechazoAnterior].filter(Boolean).join(' ')} />}
      <TarjetaListaIconos titulo={T.quePasa} items={QUE_PASA_ELIMINAR} />
      <TarjetaAviso titulo={T.queSeConserva} texto={T.conserva} icono="escudo" />
      <GrupoCampo titulo={T.porQue}>
        <ChipsMultiples opciones={MOTIVOS_ELIMINACION} seleccionadas={motivos} onAlternar={onMotivo} />
      </GrupoCampo>
      <CampoTexto
        etiqueta={T.comentario}
        icono="mensaje"
        value={comentario}
        onChangeText={onComentario}
        multiline
        maxLength={MAX_COMENTARIO_ELIMINACION}
        ayuda={`${comentario.length}/${MAX_COMENTARIO_ELIMINACION}`}
      />
      <Casilla texto={T.entiendo} marcada={entiende} onCambiar={onEntiende} />
    </View>
  );
}
