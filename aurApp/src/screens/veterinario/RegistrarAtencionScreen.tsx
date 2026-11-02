import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { ContadorPeso } from '@/components/atencion/ContadorPeso';
import { AvisoSinConexion } from '@/components/ui/AvisoSinConexion';
import { ChipIcono } from '@/components/ui/ChipIcono';
import { EstadoBorrador } from '@/components/ui/EstadoBorrador';
import { GrupoCampo } from '@/components/ui/GrupoCampo';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { MAX_DESCRIPCION_ATENCION, TEXTOS_REGISTRO_ATENCION as T, TIPOS_REGISTRO_ATENCION } from '@/constants/constants';
import { atencionStyles as styles } from '@/css/AtencionPage';
import { chipsMultiplesStyles } from '@/css/Compartido';
import { useAtencion } from '@/hooks/useAtencion';
import { useRegistrarAtencion } from '@/hooks/useRegistrarAtencion';

/** Registrar la atención en la ficha: tipo, fecha, qué encontró, tratamiento y peso de hoy. */
export default function RegistrarAtencionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const a = useAtencion(Number(id));
  const r = useRegistrarAtencion(Number(id), a.mascota?.pesoKg ?? null);
  const subtitulo = [a.cita?.mascota, a.cita?.raza].filter(Boolean).join(' · ');

  return (
    <PantallaFormulario
      titulo={T.titulo}
      subtitulo={subtitulo}
      pie={
        <View style={styles.pie}>
          {!r.sinConexion && <MensajeFormulario tipo="error" texto={r.error} />}
          <EstadoBorrador guardadoEn={r.guardadoEn} />
          <BotonPrincipal texto={T.guardar} textoCargando={T.guardando} cargando={r.guardando} onPress={r.guardar} />
        </View>
      }>
      <View style={styles.cuerpo}>
        <AvisoSinConexion visible={r.sinConexion} reintentando={r.guardando} onReintentar={r.guardar} />
        <GrupoCampo titulo={T.tipo}>
          <View style={chipsMultiplesStyles.contenedor}>
            {TIPOS_REGISTRO_ATENCION.map((t) => (
              <ChipIcono key={t.valor} texto={t.texto} icono={t.icono} activo={r.datos.tipo === t.valor} onPress={() => r.cambiar({ tipo: t.valor })} />
            ))}
          </View>
        </GrupoCampo>
        <CampoTexto etiqueta={T.fecha} icono="citas" value={r.datos.fecha} onChangeText={(fecha) => r.cambiar({ fecha })} ayuda={T.fechaAyuda} keyboardType="numbers-and-punctuation" maxLength={10} />
        <CampoTexto
          etiqueta={T.queEncontraste}
          icono="estetoscopio"
          value={r.datos.descripcion}
          onChangeText={(descripcion) => r.cambiar({ descripcion })}
          placeholder={T.queEncontrastePlaceholder}
          multiline
          maxLength={MAX_DESCRIPCION_ATENCION}
        />
        <CampoTexto
          etiqueta={T.tratamiento}
          icono="pastilla"
          value={r.datos.tratamiento}
          onChangeText={(tratamiento) => r.cambiar({ tratamiento })}
          placeholder={T.tratamientoPlaceholder}
          multiline
          maxLength={MAX_DESCRIPCION_ATENCION}
        />
        {r.esVacuna && (
          <CampoTexto etiqueta={T.proximaDosis} icono="jeringa" value={r.datos.proximaDosis} onChangeText={(proximaDosis) => r.cambiar({ proximaDosis })} ayuda={T.fechaAyuda} keyboardType="numbers-and-punctuation" maxLength={10} />
        )}
        <GrupoCampo titulo={T.peso}>
          <ContadorPeso valor={r.peso} onCambiar={r.cambiarPeso} />
        </GrupoCampo>
      </View>
    </PantallaFormulario>
  );
}
