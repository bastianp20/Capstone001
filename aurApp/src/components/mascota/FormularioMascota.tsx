import { View } from 'react-native';

import { CampoTexto } from '@/components/formulario/CampoTexto';
import { FilaInterruptor } from '@/components/ui/FilaInterruptor';
import { GrupoCampo } from '@/components/ui/GrupoCampo';
import { SelectorPildoras } from '@/components/ui/SelectorPildoras';
import { ESPECIES_MASCOTA, SEXOS_MASCOTA, TEXTOS_MASCOTA as T } from '@/constants/constants';
import { formularioMascotaStyles as styles } from '@/css/MascotaPage';
import type { FormularioMascotaProps } from '@/interfaces';

/** Campos de la ficha de una mascota (mismas columnas que la tabla mascotas). */
export function FormularioMascota({ datos, onCambiar, errores }: FormularioMascotaProps) {
  return (
    <View style={styles.formulario}>
      <CampoTexto
        etiqueta={T.nombre}
        icono="huella"
        value={datos.nombre}
        onChangeText={(v) => onCambiar('nombre', v)}
        placeholder={T.nombrePlaceholder}
        autoCapitalize="words"
        error={errores.nombre}
        maxLength={60}
      />

      <GrupoCampo titulo={T.especie}>
        <SelectorPildoras opciones={ESPECIES_MASCOTA} seleccionado={datos.especie} onSeleccionar={(v) => onCambiar('especie', v)} />
      </GrupoCampo>

      <GrupoCampo titulo={T.sexo}>
        <SelectorPildoras opciones={SEXOS_MASCOTA} seleccionado={datos.sexo} onSeleccionar={(v) => onCambiar('sexo', v)} />
      </GrupoCampo>

      <FilaInterruptor texto={T.esterilizado} valor={datos.esterilizado} onCambiar={(v) => onCambiar('esterilizado', v)} />

      <CampoTexto
        etiqueta={T.raza}
        icono="etiqueta"
        value={datos.raza}
        onChangeText={(v) => onCambiar('raza', v)}
        placeholder={T.razaPlaceholder}
        autoCapitalize="sentences"
        maxLength={60}
      />
      <CampoTexto
        etiqueta={T.nacimiento}
        icono="citas"
        value={datos.fechaNacimiento}
        onChangeText={(v) => onCambiar('fechaNacimiento', v)}
        placeholder={T.nacimientoPlaceholder}
        keyboardType="numbers-and-punctuation"
        error={errores.fechaNacimiento}
        maxLength={10}
      />
      <CampoTexto
        etiqueta={T.peso}
        icono="peso"
        value={datos.pesoKg}
        onChangeText={(v) => onCambiar('pesoKg', v)}
        placeholder={T.pesoPlaceholder}
        keyboardType="decimal-pad"
        error={errores.pesoKg}
        maxLength={6}
      />
      <CampoTexto
        etiqueta={T.alergias}
        icono="cancelar"
        value={datos.alergias}
        onChangeText={(v) => onCambiar('alergias', v)}
        placeholder={T.alergiasPlaceholder}
        multiline
        maxLength={200}
      />
      <CampoTexto
        etiqueta={T.condiciones}
        icono="estetoscopio"
        value={datos.condicionesCronicas}
        onChangeText={(v) => onCambiar('condicionesCronicas', v)}
        placeholder={T.condicionesPlaceholder}
        multiline
        maxLength={200}
      />
      <CampoTexto
        etiqueta={T.microchip}
        icono="ficha"
        value={datos.microchip}
        onChangeText={(v) => onCambiar('microchip', v)}
        placeholder={T.microchipPlaceholder}
        keyboardType="number-pad"
        maxLength={20}
      />
    </View>
  );
}
