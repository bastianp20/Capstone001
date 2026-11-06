import { Pressable, Text, View } from 'react-native';

import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { ChipsOpcion } from '@/components/ui/ChipsOpcion';
import { ESTADOS_UCI, HORAS_VIGENCIA_UCI, MOTIVOS_UCI, TEXTOS_URGENCIAS_CENTRO as T } from '@/constants/constants';
import { useUrgenciasCentroStyles } from '@/css/UrgenciasCentroPage';
import { useColores } from '@/context/TemaContext';
import { usePanelEstadoUci } from '@/hooks/usePanelEstadoUci';
import type { PanelEstadoUciProps } from '@/interfaces';

/** Estado de la UCI en vivo: cuatro botones grandes (un toque y queda) y, si no está operativa, el motivo. */
export function PanelEstadoUci({ centroId, compacto = false }: PanelEstadoUciProps) {
  const styles = useUrgenciasCentroStyles();
  const COLORES = useColores();
  const p = usePanelEstadoUci(centroId);
  const actual = p.estado?.estado ?? null;

  return (
    <View style={styles.tarjeta}>
      <View style={styles.cabecera}>
        <Text style={styles.titulo}>{T.estadoTitulo}</Text>
        <Text style={styles.enVivo}>{T.enVivo}</Text>
      </View>
      {!compacto && <Text style={styles.ayuda}>{T.estadoAyuda}</Text>}

      <View style={styles.estados}>
        {ESTADOS_UCI.map((o) => {
          const activo = actual === o.valor;
          return (
            <Pressable key={o.valor} onPress={() => p.elegir(o.valor)} disabled={p.ocupado || p.cargando}
              accessibilityRole="button" accessibilityState={{ selected: activo, disabled: p.ocupado || p.cargando }}
              accessibilityLabel={`${o.texto}. ${o.ayuda}`}
              style={({ pressed }) => [styles.estado, { backgroundColor: COLORES.estados[o.tono].fondo }, activo && styles.estadoActivo, pressed && styles.presionado]}>
              <Text style={[styles.estadoTexto, { color: COLORES.estados[o.tono].texto }]}>{o.texto}</Text>
              <Text style={[styles.estadoAyuda, { color: COLORES.estados[o.tono].texto }]}>{o.ayuda}</Text>
            </Pressable>
          );
        })}
      </View>

      {p.pidiendoMotivo && (
        <View style={styles.motivo}>
          <Text style={styles.titulo}>{T.motivo}</Text>
          <ChipsOpcion opciones={MOTIVOS_UCI} valor={p.motivo} onCambiar={(v) => v && p.setMotivo(v)} />
          <CampoTexto etiqueta={T.detalle} icono="editar" value={p.detalle} onChangeText={p.setDetalle} maxLength={200} />
          <BotonPequeno texto={T.guardarMotivo} variante="primario" onPress={p.guardarMotivo} cargando={p.ocupado} />
        </View>
      )}

      <MensajeFormulario tipo="error" texto={p.error} />
      {!p.cargando && !p.estado && <Text style={styles.actualizado}>{T.sinActualizar}</Text>}
      {p.estado && p.vigente && <Text style={styles.actualizado}>{T.actualizado(p.hace ?? '')}</Text>}
      {p.estado && !p.vigente && <Text style={styles.desactualizado}>{T.desactualizado(HORAS_VIGENCIA_UCI)}</Text>}
    </View>
  );
}
