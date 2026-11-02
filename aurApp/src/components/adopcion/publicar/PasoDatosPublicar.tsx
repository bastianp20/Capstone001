import { View } from 'react-native';

import { CampoTexto } from '@/components/formulario/CampoTexto';
import { FilaInterruptor } from '@/components/ui/FilaInterruptor';
import { GrupoCampo } from '@/components/ui/GrupoCampo';
import { PreguntaOpciones } from '@/components/ui/PreguntaOpciones';
import { OPCIONES_ESPECIE_PUBLICAR, OPCIONES_SEXO_ADOPCION, OPCIONES_TAMANO_ADOPCION, TEXTOS_PUBLICAR as T } from '@/constants/constants';
import { publicarAdopcionStyles as styles } from '@/css/PublicarAdopcionPage';
import type { PasoDatosPublicarProps } from '@/interfaces';

import { SelectorFotosAdopcion } from './SelectorFotosAdopcion';

const A_MI_NOMBRE = 'personal';

/** Paso 1 · Datos: fotos, nombre, especie, sexo, edad, tamaño, comuna y a nombre de quién. */
export function PasoDatosPublicar({ datos: d, errores: e, onCambiar, misRefugios, onAgregarFoto, onQuitarFoto }: PasoDatosPublicarProps) {
  const opcionesNombre = [{ valor: A_MI_NOMBRE, texto: T.miNombre }, ...misRefugios.map((r) => ({ valor: String(r.id), texto: r.nombre, icono: 'casa' as const }))];
  return (
    <View style={styles.paso}>
      <SelectorFotosAdopcion fotos={d.fotos} onAgregar={onAgregarFoto} onQuitar={onQuitarFoto} error={e.fotos} />
      <CampoTexto etiqueta={T.nombre} icono="huella" value={d.nombre} onChangeText={(v) => onCambiar('nombre', v)} placeholder={T.nombrePlaceholder} error={e.nombre} maxLength={40} />
      <PreguntaOpciones titulo={T.especie} opciones={OPCIONES_ESPECIE_PUBLICAR} valor={d.especie} onCambiar={(v) => onCambiar('especie', v)} error={e.especie} />
      <PreguntaOpciones titulo={T.sexo} opciones={OPCIONES_SEXO_ADOPCION} valor={d.sexo} onCambiar={(v) => onCambiar('sexo', v)} error={e.sexo} />
      <GrupoCampo titulo={T.edad} error={e.anios}>
        <View style={styles.filaEdad}>
          <View style={styles.mitad}>
            <CampoTexto etiqueta={T.anios} icono="citas" value={d.anios} onChangeText={(v) => onCambiar('anios', v.replace(/\D/g, ''))} keyboardType="number-pad" maxLength={2} />
          </View>
          <View style={styles.mitad}>
            <CampoTexto etiqueta={T.meses} icono="reloj" value={d.meses} onChangeText={(v) => onCambiar('meses', v.replace(/\D/g, ''))} keyboardType="number-pad" maxLength={2} />
          </View>
        </View>
      </GrupoCampo>
      <PreguntaOpciones titulo={T.tamano} opciones={OPCIONES_TAMANO_ADOPCION} valor={d.tamano} onCambiar={(v) => onCambiar('tamano', v)} error={e.tamano} />
      <CampoTexto etiqueta={T.comuna} icono="ubicacion" value={d.comuna} onChangeText={(v) => onCambiar('comuna', v)} placeholder={T.comunaPlaceholder} error={e.comuna} maxLength={60} />
      {misRefugios.length > 0 && (
        <PreguntaOpciones
          titulo={T.aNombreDe}
          opciones={opcionesNombre}
          valor={d.refugioId === null ? A_MI_NOMBRE : String(d.refugioId)}
          onCambiar={(v) => onCambiar('refugioId', !v || v === A_MI_NOMBRE ? null : Number(v))}
        />
      )}
      <View style={styles.interruptores}>
        <FilaInterruptor texto={T.revision} valor={d.solicitaChequeo} onCambiar={(v) => onCambiar('solicitaChequeo', v)} />
      </View>
    </View>
  );
}
