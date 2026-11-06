import { Pressable, Text, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { TEXTOS_AVISOS_CITAS as T } from '@/constants/constants';
import { useAvisosCitasStyles } from '@/css/Compartido';
import { useAvisosCitas } from '@/hooks/useAvisosCitas';
import type { AvisosCitasProps } from '@/interfaces';
import { formatFechaHoraCita } from '@/lib/fechas';
import { useColores } from '@/context/TemaContext';

/** Avisos sin leer de horas que un veterinario movió o canceló. Si no hay, no se muestra nada. */
export function AvisosCitas({ centroId }: AvisosCitasProps) {
  const COLORES = useColores();
  const styles = useAvisosCitasStyles();
  const { avisos, ocupado, marcarLeido, marcarTodos } = useAvisosCitas(centroId);
  if (avisos.length === 0) return null;

  return (
    <View style={styles.contenedor} accessibilityLabel={T.titulo}>
      <View style={styles.encabezado}>
        <Icono nombre="campana" tamano={17} color={COLORES.texto} />
        <Text style={styles.titulo}>{T.titulo}</Text>
        <Text style={styles.contador}>{avisos.length}</Text>
        {avisos.length > 1 && (
          <Pressable onPress={marcarTodos} disabled={ocupado} accessibilityRole="button" hitSlop={8} style={styles.todos}>
            <Text style={styles.link}>{T.marcarTodos}</Text>
          </Pressable>
        )}
      </View>

      {avisos.map((a) => (
        <View key={a.id} style={[styles.aviso, a.tipo === 'cita_cancelada' ? styles.cancelada : styles.reagendada]}>
          <View style={styles.cuerpo}>
            <Text style={styles.avisoTitulo}>{a.titulo}</Text>
            {a.fechaAnterior && (
              <Text style={styles.fechas}>
                <Text style={styles.anterior}>{formatFechaHoraCita(a.fechaAnterior)}</Text>
                {a.fechaNueva && <Text style={styles.nueva}>{`  →  ${formatFechaHoraCita(a.fechaNueva)}`}</Text>}
              </Text>
            )}
            <Text style={styles.mensaje}>{a.mensaje}</Text>
          </View>
          <Pressable onPress={() => marcarLeido(a.id)} disabled={ocupado} accessibilityRole="button" accessibilityLabel={T.marcarLeido} hitSlop={10}>
            <Icono nombre="cerrar" tamano={16} color={COLORES.textoSecundario} />
          </Pressable>
        </View>
      ))}
    </View>
  );
}
