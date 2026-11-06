import { Pressable, Text, View } from 'react-native';

import { Etiqueta } from '@/components/ui/Etiqueta';
import { Icono } from '@/components/ui/Icono';
import { ETIQUETAS_ESTADO_CITA, TEXTOS_MI_AGENDA as T } from '@/constants/constants';
import { useFilaHoraStyles } from '@/css/MiAgendaPage';
import type { FilaHoraAgendaProps } from '@/interfaces';
import { citaModificable } from '@/lib/agendaSemana';
import { useColores } from '@/context/TemaContext';

/** Una hora del día: libre (toca para bloquear), con cita (modificar), bloqueada (quitar) o ya pasada. */
export function FilaHoraAgenda({ celda, onPress }: FilaHoraAgendaProps) {
  const COLORES = useColores();
  const styles = useFilaHoraStyles();
  const c = celda.cita;

  if (celda.tipo === 'tomada' && c) {
    return (
      <Pressable onPress={() => onPress(celda)} accessibilityRole="button"
        accessibilityLabel={`${celda.hora}, ${c.mascota}, ${ETIQUETAS_ESTADO_CITA[c.estado]}`}
        style={({ pressed }) => [styles.fila, c.estado === 'pendiente' ? styles.pendiente : styles.tomada,
          !citaModificable(c) && styles.pasada, pressed && styles.presionada]}>
        <Text style={styles.hora}>{celda.hora}</Text>
        <View style={styles.textos}>
          <Text style={styles.titulo}>{c.mascota}</Text>
          <Text style={styles.detalle}>
            {c.dueno}{celda.fueraDeHorario ? ` · ${T.fueraDeHorario}` : ''}{c.reagendada ? ` · ${T.reagendada}` : ''}
          </Text>
        </View>
        <Etiqueta texto={ETIQUETAS_ESTADO_CITA[c.estado]} colorFondo={COLORES.estados[c.estado].fondo} colorTexto={COLORES.estados[c.estado].texto} />
      </Pressable>
    );
  }

  if (celda.tipo === 'bloqueada' && celda.bloqueo) {
    return (
      <Pressable onPress={() => onPress(celda)} accessibilityRole="button" accessibilityLabel={`${celda.hora}, ${T.bloqueado}`}
        style={({ pressed }) => [styles.fila, styles.bloqueada, pressed && styles.presionada]}>
        <Text style={styles.hora}>{celda.hora}</Text>
        <View style={styles.textos}>
          <Text style={styles.titulo}>{T.bloqueado}</Text>
          <Text style={styles.detalle}>{celda.bloqueo.motivo}</Text>
        </View>
        <Icono nombre="candado" tamano={18} color={COLORES.textoSecundario} />
      </Pressable>
    );
  }

  if (celda.tipo === 'pasada') {
    return (
      <View style={[styles.fila, styles.pasada]}>
        <Text style={styles.hora}>{celda.hora}</Text>
      </View>
    );
  }

  return (
    <Pressable onPress={() => onPress(celda)} accessibilityRole="button" accessibilityLabel={`${celda.hora}, ${T.libre}. ${T.tocaParaBloquear}`}
      style={({ pressed }) => [styles.fila, styles.libre, pressed && styles.presionada]}>
      <Text style={styles.hora}>{celda.hora}</Text>
      <View style={styles.textos}>
        <Text style={[styles.titulo, styles.libreTexto]}>{T.libre}</Text>
        <Text style={styles.detalle}>{T.tocaParaBloquear}</Text>
      </View>
    </Pressable>
  );
}
