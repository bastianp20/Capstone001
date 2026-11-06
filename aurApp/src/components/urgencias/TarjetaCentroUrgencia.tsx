import { Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { TEXTOS_URGENCIAS as T } from '@/constants/constants';
import { useTarjetaUrgenciaStyles } from '@/css/UrgenciasPage';
import type { TarjetaCentroUrgenciaProps } from '@/interfaces';
import { formatearTelefono } from '@/lib/formatos';
import { textoHorarioCentro } from '@/lib/horarioCentro';
import { comoLlegar, horarioDeHoy, llamar } from '@/lib/urgencias';

import { EtiquetaEstadoUci } from './EtiquetaEstadoUci';
import { useColores } from '@/context/TemaContext';

/** Un centro en Urgencias: si está abierto, 24/7, su UCI y los botones para llamar y llegar. */
export function TarjetaCentroUrgencia({ centro: c, ahora }: TarjetaCentroUrgenciaProps) {
  const COLORES = useColores();
  const styles = useTarjetaUrgenciaStyles();
  const hoy = horarioDeHoy(c.horarios, ahora);
  const textoHoy = c.horarios.length === 0 ? T.sinHorario : hoy ? T.hoy(textoHorarioCentro(hoy)) : T.hoyCerrado;
  const telefono = c.telefono;
  const abierto = COLORES.estados[c.abiertoAhora ? 'confirmada' : 'completada'];

  return (
    <View style={[styles.tarjeta, !c.abiertoAhora && styles.cerrada]}>
      <View style={styles.textos}>
        <Text style={styles.nombre}>{c.nombre}</Text>
        <Text style={styles.direccion}>{`${c.direccion}, ${c.comuna}`}</Text>
      </View>

      <View style={styles.etiquetas}>
        <Etiqueta texto={c.abiertoAhora ? T.abiertoAhora : T.cerradoAhora} conPunto
          colorFondo={abierto.fondo} colorTexto={abierto.texto} />
        {c.urgencias247 && <Etiqueta texto={T.urgencias247} colorFondo={COLORES.peligroSuave} colorTexto={COLORES.peligro} />}
        {c.tieneUci && c.estadoUci && <EtiquetaEstadoUci estado={c.estadoUci} ahora={ahora} />}
      </View>

      {!c.urgencias247 && <Text style={styles.hoy}>{textoHoy}</Text>}

      <View style={styles.acciones}>
        {telefono ? (
          <View style={styles.accion}>
            <BotonPequeno texto={`${T.llamar} ${formatearTelefono(telefono) ?? ''}`} icono="telefono" variante="peligro" onPress={() => llamar(telefono)} />
          </View>
        ) : (
          <Text style={styles.sinTelefono}>{T.sinTelefono}</Text>
        )}
        <View style={styles.accion}>
          <BotonPequeno texto={T.comoLlegar} icono="ubicacion" onPress={() => comoLlegar(c.direccion, c.comuna)} />
        </View>
      </View>
    </View>
  );
}
