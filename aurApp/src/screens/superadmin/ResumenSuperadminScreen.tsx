import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { EnlaceTexto } from '@/components/formulario/EnlaceTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { TarjetaSolicitud } from '@/components/superadmin/TarjetaSolicitud';
import { AvatarIniciales } from '@/components/ui/AvatarIniciales';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { IndicadorNumero } from '@/components/ui/IndicadorNumero';
import { ModalTexto } from '@/components/ui/ModalTexto';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { TarjetaAccion } from '@/components/ui/TarjetaAccion';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import { TEXTOS_APROBACIONES, TEXTOS_CARGA, TEXTOS_SUPERADMIN as T } from '@/constants/constants';
import { useAuth } from '@/Auth/AuthContext';
import { useSuperadmin } from '@/context/SuperadminContext';
import { resumenSuperadminStyles as styles } from '@/css/SuperadminPage';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useResolverSolicitud } from '@/hooks/useResolverSolicitud';
import { primerNombre } from '@/lib/texto';

const POR_APROBAR_EN_RESUMEN = 2;

export default function ResumenSuperadminScreen() {
  useBarraEstadoClara();
  const { usuarioActual } = useAuth();
  const s = useSuperadmin();
  const r = useResolverSolicitud();
  const d = s.datos;

  const contenido = () => {
    if (s.cargando) return <EstadoCarga />;
    if (s.error || !d) return <EstadoVacio icono="cancelar" titulo={s.error ?? TEXTOS_CARGA.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={s.recargar} />;

    const mensajesPendientes = d.mensajes.filter((m) => m.estado === 'pendiente').length;
    const eliminacionesPendientes = d.eliminaciones.filter((e) => e.estado === 'pendiente').length;
    const sinPendientes = !d.solicitudes.length && !mensajesPendientes && !eliminacionesPendientes && !d.solicitudesPlan.length;

    return (
      <>
        <View style={styles.grilla}>
          <View style={styles.fila}>
            <IndicadorNumero etiqueta={T.usuarios} valor={d.resumen.usuarios} icono="perfil" />
            <IndicadorNumero etiqueta={T.centrosActivos} valor={d.resumen.centrosActivos} icono="centro" />
          </View>
          <View style={styles.fila}>
            <IndicadorNumero etiqueta={T.citasMes} valor={d.resumen.citasMes} icono="citas" />
            <IndicadorNumero etiqueta={T.veterinarios} valor={d.resumen.veterinarios} icono="estetoscopio" />
          </View>
        </View>

        <View style={styles.seccion}>
          <TituloSeccion texto={T.atencion} />
          {sinPendientes && <MensajeFormulario tipo="aviso" texto={T.todoAlDia} />}
          {d.solicitudes.length > 0 && (
            <TarjetaAccion icono="aprobaciones" tono="crema" titulo={T.aprobaciones} detalle={T.aprobacionesDetalle} cantidad={d.solicitudes.length} onPress={() => router.navigate('/admin/aprobaciones')} />
          )}
          {mensajesPendientes > 0 && (
            <TarjetaAccion icono="mensaje" tono="lavanda" titulo={T.mensajes} detalle={T.mensajesDetalle} cantidad={mensajesPendientes} onPress={() => router.navigate('/admin/mensajes')} />
          )}
          {eliminacionesPendientes > 0 && (
            <TarjetaAccion icono="usuarioX" tono="durazno" titulo={T.eliminaciones} detalle={T.eliminacionesDetalle} cantidad={eliminacionesPendientes} onPress={() => router.push('/admin/eliminaciones')} />
          )}
          {d.solicitudesPlan.length > 0 && (
            <TarjetaAccion icono="plan" tono="menta" titulo={T.planes} detalle={T.planesDetalle} cantidad={d.solicitudesPlan.length} onPress={() => router.push('/admin/planes')} />
          )}
        </View>

        {d.solicitudes.length > 0 && (
          <View style={styles.seccion}>
            <TituloSeccion texto={T.porAprobar} />
            <MensajeFormulario tipo="error" texto={r.error} />
            {d.solicitudes.slice(0, POR_APROBAR_EN_RESUMEN).map((sol) => (
              <TarjetaSolicitud key={sol.clave} solicitud={sol} ocupado={r.ocupadaClave === sol.clave} onAprobar={r.aprobar} onRechazar={r.pedirRechazo} />
            ))}
            {d.solicitudes.length > POR_APROBAR_EN_RESUMEN && (
              <EnlaceTexto texto={T.verTodas} onPress={() => router.navigate('/admin/aprobaciones')} alineacion="centro" />
            )}
          </View>
        )}
      </>
    );
  };

  return (
    <PantallaLista
      recargando={s.recargando}
      onRecargar={s.recargar}
      encabezado={
        <EncabezadoPagina
          titulo={T.titulo}
          subtitulo={T.saludo(primerNombre(usuarioActual?.nombre ?? ''))}
          accion={
            <Pressable onPress={() => router.navigate('/admin/perfil')} accessibilityRole="button" accessibilityLabel="Perfil">
              <AvatarIniciales nombre={usuarioActual?.nombre ?? ''} tamano={44} />
            </Pressable>
          }
        />
      }>
      {contenido()}
      <ModalTexto
        visible={!!r.rechazando}
        titulo={TEXTOS_APROBACIONES.rechazarTitulo}
        detalle={r.rechazando ? TEXTOS_APROBACIONES.rechazarDetalle(r.rechazando.nombre) : undefined}
        placeholder={TEXTOS_APROBACIONES.rechazarPlaceholder}
        textoConfirmar={TEXTOS_APROBACIONES.rechazar}
        obligatorio
        peligro
        cargando={r.rechazandoOcupado}
        error={r.errorRechazo}
        onConfirmar={r.confirmarRechazo}
        onCerrar={r.cerrarRechazo}
      />
    </PantallaLista>
  );
}
