import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EncabezadoLogin } from '@/components/login/EncabezadoLogin';
import { FormularioCrearCuenta } from '@/components/login/FormularioCrearCuenta';
import { FormularioIngresar } from '@/components/login/FormularioIngresar';
import { FormularioRecuperar } from '@/components/login/FormularioRecuperar';
import { PieLogin } from '@/components/login/PieLogin';
import { TituloLogin } from '@/components/login/TituloLogin';
import { TarjetaEntradaUrgencias } from '@/components/urgencias/TarjetaEntradaUrgencias';
import { ALTO_ENCABEZADO_LOGIN, TEXTOS_LOGIN, TEXTOS_RECUPERAR_PASSWORD } from '@/constants/constants';
import { useLoginScreenStyles } from '@/css/LoginPage';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useFormularioLogin } from '@/hooks/useFormularioLogin';
import { useScrollConTeclado } from '@/hooks/useScrollConTeclado';
import { abrirSolicitudCentro } from '@/lib/enlacesWeb';

const TITULOS = {
  ingresar: TEXTOS_LOGIN.ingresar,
  crear: TEXTOS_LOGIN.crear,
  recuperar: TEXTOS_RECUPERAR_PASSWORD,
} as const;

export default function LoginScreen() {
  const styles = useLoginScreenStyles();
  const insets = useSafeAreaInsets();
  useBarraEstadoClara();
  const teclado = useScrollConTeclado();

  const {
    modo,
    cambiarModo,
    formulario,
    cambiarCampo,
    mostrarPassword,
    cambiarMostrarPassword,
    error,
    aviso,
    enviando,
    ingresar,
    crearCuenta,
    enviarRecuperacion,
  } = useFormularioLogin();

  return (
    <View ref={teclado.contenedorRef} style={[styles.pantalla, { paddingBottom: teclado.alto }]}>
      <ScrollView
        ref={teclado.scrollRef}
        {...teclado.scrollProps}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: teclado.alto ? 24 : insets.bottom + 24 }]}>
        <EncabezadoLogin alto={ALTO_ENCABEZADO_LOGIN} />

        <View style={styles.cuerpo}>
          <TituloLogin titulo={TITULOS[modo].titulo} subtitulo={TITULOS[modo].subtitulo} />

          {modo === 'ingresar' && (
            <FormularioIngresar
              formulario={formulario}
              onCambiar={cambiarCampo}
              mostrarPassword={mostrarPassword}
              onCambiarMostrarPassword={cambiarMostrarPassword}
              enviando={enviando}
              error={error}
              aviso={aviso}
              onIngresar={ingresar}
              onOlvidePassword={() => cambiarModo('recuperar')}
            />
          )}

          {modo === 'crear' && (
            <FormularioCrearCuenta
              formulario={formulario}
              onCambiar={cambiarCampo}
              mostrarPassword={mostrarPassword}
              onCambiarMostrarPassword={cambiarMostrarPassword}
              enviando={enviando}
              error={error}
              onCrear={crearCuenta}
            />
          )}

          {modo === 'recuperar' && (
            <FormularioRecuperar
              email={formulario.email}
              onCambiarEmail={(v) => cambiarCampo('email', v)}
              enviando={enviando}
              error={error}
              aviso={aviso}
              onEnviar={enviarRecuperacion}
              onVolver={() => cambiarModo('ingresar')}
            />
          )}

          <PieLogin modo={modo} onCambiarModo={cambiarModo} onSolicitarCentro={abrirSolicitudCentro} />
          {modo === 'ingresar' && <TarjetaEntradaUrgencias />}
        </View>
      </ScrollView>
    </View>
  );
}
