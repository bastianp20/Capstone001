import { ScrollView, Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { BotonSecundario } from '@/components/formulario/BotonSecundario';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { HojaInferior } from '@/components/ui/HojaInferior';
import { Icono } from '@/components/ui/Icono';
import { TarjetaListaIconos } from '@/components/ui/TarjetaListaIconos';
import { COLORES, TEXTOS_POSTULANTES as T } from '@/constants/constants';
import { hojaPostulanteStyles as styles } from '@/css/MisPublicacionesPage';
import type { HojaPostulanteProps } from '@/interfaces';
import { haceCuanto, lineasFamilia, lineasHogar } from '@/lib/adopcion';

import { AfinidadAnillo } from './AfinidadAnillo';

/** Detalle de una postulación: afinidad y por qué, hogar, familia, experiencia, motivo, contactar y decidir. */
export function HojaPostulante({
  postulante,
  nombreAnimal,
  puedeElegir,
  puedeConcretar,
  ocupado,
  error,
  onElegir,
  onRechazar,
  onConcretar,
  onContactar,
  onCerrar,
}: HojaPostulanteProps) {
  const p = postulante?.postulacion;
  const afinidad = postulante?.afinidad;
  return (
    <HojaInferior visible={!!postulante} titulo="" onCerrar={onCerrar}>
      {p && afinidad && (
        <>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
            <View style={styles.cabecera}>
              <AfinidadAnillo porcentaje={afinidad.porcentaje} tamano={68} />
              <View style={styles.cabeceraTextos}>
                <Text style={styles.nombre}>{p.nombre}</Text>
                <Text style={styles.detalle}>{T.hace(haceCuanto(p.creadaEn))}</Text>
              </View>
            </View>
            <View style={styles.match}>
              <Text style={styles.matchTitulo}>{T.match}</Text>
              {afinidad.razones.map((r) => (
                <View key={r.texto} style={styles.razon}>
                  <Icono nombre={r.tipo === 'ok' ? 'check' : 'alerta'} tamano={16} color={r.tipo === 'ok' ? COLORES.primario : COLORES.estados.pendiente.texto} grosor={2.4} />
                  <Text style={styles.razonTexto}>{r.texto}</Text>
                </View>
              ))}
              <Text style={styles.detalle}>{T.guia}</Text>
            </View>
            <TarjetaListaIconos titulo={T.hogar} items={lineasHogar(p)} />
            <TarjetaListaIconos titulo={T.familia} items={lineasFamilia(p)} />
            <TarjetaListaIconos titulo={T.experiencia} items={[{ icono: 'historial', texto: p.experiencia?.trim() || T.sinExperiencia }]} />
            <TarjetaListaIconos titulo={T.porQue} items={[{ icono: 'mensaje', texto: p.motivo }]} />
          </ScrollView>
          <MensajeFormulario tipo="error" texto={error} />
          <View style={styles.acciones}>
            <BotonSecundario texto={T.contactar} icono="telefono" tono="verde" onPress={onContactar} />
            {puedeElegir && (
              <>
                <View style={styles.botones}>
                  <View style={styles.boton}>
                    <BotonSecundario texto={T.rechazar} icono="cerrar" onPress={onRechazar} cargando={ocupado} />
                  </View>
                  <View style={styles.boton}>
                    <BotonPrincipal texto={T.elegir} onPress={onElegir} cargando={ocupado} />
                  </View>
                </View>
                <Text style={styles.nota}>{T.notaEsperan}</Text>
              </>
            )}
            {puedeConcretar && <BotonPrincipal texto={T.concretar(nombreAnimal)} onPress={onConcretar} tono="coral" />}
          </View>
        </>
      )}
    </HojaInferior>
  );
}
