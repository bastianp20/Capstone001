import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { Icono } from '@/components/ui/Icono';
import { COLORES, ICONO_ESPECIE_ADOPCION, MOTIVOS_REPORTE, TEXTOS_MODERACION as T, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaCasoModeracionStyles as styles } from '@/css/ModeracionPage';
import type { MotivoReporte, TarjetaCasoModeracionProps } from '@/interfaces';
import { haceCuanto } from '@/lib/adopcion';

const motivo = (valor: MotivoReporte) => MOTIVOS_REPORTE.find((m) => m.valor === valor) ?? MOTIVOS_REPORTE[MOTIVOS_REPORTE.length - 1];

/** Una publicación reportada: quién la publicó, sus reportes y los botones para decidir. */
export function TarjetaCasoModeracion({ caso: c, ocupado, onVer, onDecidir }: TarjetaCasoModeracionProps) {
  const principal = motivo(c.motivoPrincipal);
  return (
    <View style={[styles.tarjeta, c.urgente && !c.decision && styles.urgente]}>
      <View style={styles.cabecera}>
        {c.fotoUrl ? (
          <Image source={{ uri: c.fotoUrl }} style={styles.foto} contentFit="cover" />
        ) : (
          <View style={[styles.foto, styles.sinFoto]}>
            <Icono nombre={ICONO_ESPECIE_ADOPCION[c.especie]} tamano={28} color={TONOS_TARJETA.durazno.icono} />
          </View>
        )}
        <View style={styles.textos}>
          <View style={styles.filaNombre}>
            <Text style={styles.nombre}>{c.nombre}</Text>
            {c.urgente && !c.decision && <Etiqueta texto={T.urgente} colorFondo={COLORES.peligroSuave} colorTexto={COLORES.peligro} icono="alerta" />}
            {c.esPrueba && <Etiqueta texto={T.prueba} colorFondo={COLORES.aviso} colorTexto={COLORES.avisoTexto} />}
          </View>
          <Etiqueta texto={`${principal.texto} · ${T.reportes(c.reportes)}`} colorFondo={principal.fondo} colorTexto={principal.color} />
          <Text style={styles.detalle}>{T.publicado(c.publicador, haceCuanto(c.publicadaEn))}</Text>
          <Text style={styles.detalle}>{T.historial(c.publicaciones, c.reportesPrevios)}</Text>
        </View>
      </View>

      <View style={styles.reportes}>
        <Text style={styles.reportesTitulo}>{T.loQueReportaron}</Text>
        {c.detalle.map((r) => {
          const m = motivo(r.motivo);
          return (
            <View key={`${r.creadaEn}-${r.motivo}`} style={styles.reporte}>
              <View style={[styles.reporteIcono, { backgroundColor: m.fondo }]}>
                <Icono nombre={m.icono} tamano={14} color={m.color} />
              </View>
              <View style={styles.reporteTextos}>
                <Text style={styles.reporteMotivo}>
                  {m.texto} · <Text style={styles.reporteComentario}>{haceCuanto(r.creadaEn)}</Text>
                </Text>
                <Text style={styles.reporteComentario}>{r.comentario?.trim() || T.sinComentario}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {c.decision && <Text style={styles.decision}>{T.decision[c.decision]}</Text>}
      <View style={styles.acciones}>
        <BotonPequeno texto={T.ver} icono="ojo" onPress={onVer} />
        {!c.decision && (
          <>
            <BotonPequeno texto={T.descartar} onPress={() => onDecidir('descartar')} deshabilitado={ocupado} />
            <BotonPequeno texto={T.advertir} icono="alerta" onPress={() => onDecidir('advertir')} deshabilitado={ocupado} />
            <BotonPequeno texto={T.ocultar} icono="ojoTachado" variante="peligro" onPress={() => onDecidir('ocultar')} cargando={ocupado} />
          </>
        )}
      </View>
    </View>
  );
}
