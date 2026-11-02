import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BotonGuardar } from '@/components/adopcion/BotonGuardar';
import { BarrasRasgos } from '@/components/adopcion/ficha/BarrasRasgos';
import { CabeceraFichaAdopcion } from '@/components/adopcion/ficha/CabeceraFichaAdopcion';
import { GaleriaFotosAdopcion } from '@/components/adopcion/ficha/GaleriaFotosAdopcion';
import { PieFichaAdopcion } from '@/components/adopcion/ficha/PieFichaAdopcion';
import { SaludAdopcion } from '@/components/adopcion/ficha/SaludAdopcion';
import { TarjetaChequeoAdopcion } from '@/components/adopcion/ficha/TarjetaChequeoAdopcion';
import { TarjetaPublicador } from '@/components/adopcion/ficha/TarjetaPublicador';
import { BotonIcono } from '@/components/ui/BotonIcono';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { Icono } from '@/components/ui/Icono';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import { COLORES, TEXTOS_CARGA, TEXTOS_FICHA_ADOPCION as T } from '@/constants/constants';
import { fichaAdopcionStyles as styles } from '@/css/FichaAdopcionPage';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useFichaAdopcion } from '@/hooks/useFichaAdopcion';

/** Ficha de un animal en adopción: fotos, cómo es, salud, chequeo, historia, quién lo cuida y adoptar. */
export default function FichaAdopcionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const adopcionId = Number(id);
  const f = useFichaAdopcion(adopcionId);
  const insets = useSafeAreaInsets();
  useBarraEstadoClara();

  if (f.cargando && !f.ficha) {
    return (
      <PantallaFormulario titulo={T.cargando}>
        <EstadoCarga texto={T.cargando} />
      </PantallaFormulario>
    );
  }
  if (!f.ficha) {
    return (
      <PantallaFormulario titulo="">
        <EstadoVacio
          icono="huella"
          titulo={f.error ?? T.noEncontrada}
          textoAccion={f.error ? TEXTOS_CARGA.reintentar : T.volverAdopta}
          onAccion={f.error ? f.recargar : router.back}
        />
      </PantallaFormulario>
    );
  }

  const ficha = f.ficha;
  return (
    <View style={styles.pantalla}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <GaleriaFotosAdopcion
          fotos={ficha.fotos}
          nombre={ficha.nombre}
          onVolver={router.back}
          acciones={
            <>
              <BotonIcono icono="compartir" etiqueta={T.compartir} onPress={f.compartir} variante="blanco" tamano={42} />
              <BotonGuardar guardado={f.guardado} onPress={f.alternarGuardado} tamano={42} />
            </>
          }
        />
        <View style={styles.cuerpo}>
          <CabeceraFichaAdopcion ficha={ficha} />
          <TarjetaChequeoAdopcion chequeo={ficha.chequeo} solicitado={ficha.solicitaChequeo} />
          <View style={styles.seccion}>
            <TituloSeccion texto={T.comoEs} />
            <BarrasRasgos rasgos={ficha.rasgos} />
          </View>
          <View style={styles.seccion}>
            <TituloSeccion texto={T.salud} />
            <SaludAdopcion ficha={ficha} />
          </View>
          {!!ficha.historia && (
            <View style={styles.seccion}>
              <TituloSeccion texto={T.historia} />
              <Text style={styles.historia}>{ficha.historia}</Text>
            </View>
          )}
          <TarjetaPublicador publicador={ficha.publicador} />
          <Text style={styles.ley}>{T.ley}</Text>
          {!ficha.esMia && (
            <Pressable onPress={() => router.push({ pathname: '/adopcion/[id]/reportar', params: { id: adopcionId, nombre: ficha.nombre } })} accessibilityRole="button" style={styles.reportar}>
              <Icono nombre="bandera" tamano={16} color={COLORES.peligro} />
              <Text style={styles.reportarTexto}>{T.reportar}</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
      <View style={[styles.pie, { paddingBottom: insets.bottom + 12 }]}>
        <PieFichaAdopcion
          estado={f.estadoBoton}
          sexo={ficha.sexo}
          onAdoptar={() => router.push(`/adopcion/${adopcionId}/postular`)}
          onVerPostulaciones={() => router.push(`/adopcion/publicacion/${adopcionId}`)}
        />
      </View>
    </View>
  );
}
