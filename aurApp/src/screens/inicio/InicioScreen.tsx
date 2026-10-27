import { router } from 'expo-router';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BotonPedirHora } from '@/components/inicio/BotonPedirHora';
import { EncabezadoInicio } from '@/components/inicio/EncabezadoInicio';
import { EncabezadoSinMascotas } from '@/components/inicio/EncabezadoSinMascotas';
import { HuellasFondo } from '@/components/inicio/HuellasFondo';
import { TarjetaFicha } from '@/components/inicio/TarjetaFicha';
import { TarjetaRecordatorio } from '@/components/inicio/TarjetaRecordatorio';
import { TarjetaSintomas } from '@/components/inicio/TarjetaSintomas';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { ALTURA_BARRA_NAVEGACION, COLORES, TEXTOS_CARGA, TEXTOS_INICIO } from '@/constants/constants';
import { inicioScreenStyles as styles } from '@/css/InicioPage';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useInicio } from '@/hooks/useInicio';

const irAPerfil = () => router.navigate('/perfil');
const irACitas = () => router.navigate('/citas');
const agregarMascota = () => router.push('/mascota/nueva');

export default function InicioScreen() {
  const insets = useSafeAreaInsets();
  useBarraEstadoClara();
  const { nombreUsuario, nombreCompleto, mascotas, mascota, resumen, seleccionarMascota, cargando, error, recargar, recargando } =
    useInicio();

  const pedirHora = () => router.push({ pathname: '/pedir-hora', params: mascota ? { mascotaId: mascota.id } : {} });

  const contenido = () => {
    if (cargando) return <EstadoCarga />;
    if (error) return <EstadoVacio icono="cancelar" titulo={error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={recargar} />;
    if (!mascota || !resumen) {
      return (
        <EstadoVacio
          icono="huella"
          titulo={TEXTOS_INICIO.sinMascotasTitulo}
          detalle={TEXTOS_INICIO.sinMascotasDetalle}
          textoAccion={TEXTOS_INICIO.agregarMascota}
          onAccion={agregarMascota}
        />
      );
    }
    const [vacunas, control] = resumen.recordatorios;
    return (
      <>
        <View style={styles.filaBento}>
          <TarjetaFicha
            nombreMascota={mascota.nombre}
            porcentaje={resumen.fichaPorcentaje}
            resumen={resumen.fichaResumen}
            onPress={() => router.push({ pathname: '/mascota/[id]', params: { id: mascota.id } })}
          />
          <View style={styles.columnaBento}>
            <TarjetaRecordatorio recordatorio={vacunas} onPress={() => router.navigate('/historial')} />
            <TarjetaRecordatorio recordatorio={control} onPress={() => router.navigate('/historial')} />
          </View>
        </View>

        <TarjetaSintomas nombreMascota={mascota.nombre} onPress={pedirHora} />

        <View style={styles.contenedorBoton}>
          <BotonPedirHora onPress={pedirHora} />
        </View>
      </>
    );
  };

  return (
    <View style={styles.pantalla}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: ALTURA_BARRA_NAVEGACION + insets.bottom + 36 }}
        refreshControl={<RefreshControl refreshing={recargando} onRefresh={recargar} tintColor={COLORES.blanco} colors={[COLORES.primario]} />}>
        {mascota && resumen ? (
          <EncabezadoInicio
            nombreUsuario={nombreUsuario}
            nombreCompleto={nombreCompleto}
            mascotas={mascotas}
            mascota={mascota}
            resumen={resumen}
            onSeleccionarMascota={seleccionarMascota}
            onAgregarMascota={agregarMascota}
            onIrAPerfil={irAPerfil}
            onVerCita={irACitas}
          />
        ) : (
          <EncabezadoSinMascotas nombreUsuario={nombreUsuario} nombreCompleto={nombreCompleto} onIrAPerfil={irAPerfil} />
        )}

        <View style={styles.cuerpo}>
          <HuellasFondo />
          {contenido()}
        </View>
      </ScrollView>
    </View>
  );
}
