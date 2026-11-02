import { Pressable, ScrollView, Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { FilaInterruptor } from '@/components/ui/FilaInterruptor';
import { HojaInferior } from '@/components/ui/HojaInferior';
import { PreguntaOpciones } from '@/components/ui/PreguntaOpciones';
import { OPCIONES_ETAPA_ADOPCION, OPCIONES_SEXO_ADOPCION, OPCIONES_TAMANO_ADOPCION, TEXTOS_ADOPTA as T } from '@/constants/constants';
import { hojaFiltrosAdopcionStyles as styles } from '@/css/AdoptaPage';
import type { HojaFiltrosAdopcionProps } from '@/interfaces';

/** Hoja "Filtrar animales": revisados, guardados, tamaño, edad, sexo y comuna. */
export function HojaFiltrosAdopcion({ visible, filtros: f, comunas, resultados, onCambiar, onLimpiar, onCerrar }: HojaFiltrosAdopcionProps) {
  const opcionesComuna = comunas.map((c) => ({ valor: c, texto: c }));
  return (
    <HojaInferior visible={visible} titulo={T.filtrosTitulo} onCerrar={onCerrar}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
        <FilaInterruptor texto={T.soloRevisados} valor={f.soloRevisados} onCambiar={(v) => onCambiar('soloRevisados', v)} />
        <FilaInterruptor texto={T.soloGuardados} valor={f.soloGuardados} onCambiar={(v) => onCambiar('soloGuardados', v)} />
        <PreguntaOpciones titulo={T.tamano} opciones={OPCIONES_TAMANO_ADOPCION} valor={f.tamano} onCambiar={(v) => onCambiar('tamano', v)} permitirQuitar />
        <PreguntaOpciones titulo={T.etapa} opciones={OPCIONES_ETAPA_ADOPCION} valor={f.etapa} onCambiar={(v) => onCambiar('etapa', v)} permitirQuitar />
        <PreguntaOpciones titulo={T.sexo} opciones={OPCIONES_SEXO_ADOPCION} valor={f.sexo} onCambiar={(v) => onCambiar('sexo', v)} permitirQuitar />
        {opcionesComuna.length > 1 && (
          <PreguntaOpciones titulo={T.comuna} opciones={opcionesComuna} valor={f.comuna} onCambiar={(v) => onCambiar('comuna', v)} permitirQuitar />
        )}
      </ScrollView>
      <View style={styles.pie}>
        <Pressable onPress={onLimpiar} accessibilityRole="button" style={styles.limpiar}>
          <Text style={styles.limpiarTexto}>{T.limpiar}</Text>
        </Pressable>
        <View style={styles.boton}>
          <BotonPrincipal texto={T.verResultados(resultados)} onPress={onCerrar} />
        </View>
      </View>
    </HojaInferior>
  );
}
