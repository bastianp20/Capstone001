import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { TablaHorarios } from '@/components/centro/TablaHorarios';
import { BotonSecundario } from '@/components/formulario/BotonSecundario';
import { MenuPerfil } from '@/components/perfil/MenuPerfil';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { FilaOpcion } from '@/components/ui/FilaOpcion';
import { Icono } from '@/components/ui/Icono';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import { COLORES, TEXTOS_CARGA, TEXTOS_LOGIN, TEXTOS_MI_CENTRO as T } from '@/constants/constants';
import { useAuth } from '@/Auth/AuthContext';
import { useCentro } from '@/context/CentroContext';
import { miCentroStyles as styles } from '@/css/CentroPage';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { formatearTelefono } from '@/lib/formatos';

/** Datos y horarios del centro, accesos a editar y a planes, y la cuenta de quien administra. */
export default function MiCentroScreen() {
  useBarraEstadoClara();
  const { usuarioActual, logout } = useAuth();
  const c = useCentro();
  const d = c.datos?.detalle;
  const esVeterinario = usuarioActual?.rol === 'veterinario';

  const contenido = () => {
    if (c.cargando) return <EstadoCarga />;
    if (c.error || !d) return <EstadoVacio icono="cancelar" titulo={c.error ?? TEXTOS_CARGA.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={c.recargar} />;
    const telefono = formatearTelefono(d.telefono);
    return (
      <>
        <View style={styles.tarjeta}>
          <Text style={styles.nombre}>{d.nombre}</Text>
          {d.esPrueba && <Etiqueta texto={T.dePrueba} colorFondo={COLORES.estados.pendiente.fondo} colorTexto={COLORES.estados.pendiente.texto} />}
          <View style={styles.fila}>
            <Icono nombre="ubicacion" tamano={18} color={COLORES.primario} />
            <Text style={styles.texto}>
              {d.direccion}, {d.comuna}
            </Text>
          </View>
          {telefono && (
            <View style={styles.fila}>
              <Icono nombre="telefono" tamano={18} color={COLORES.primario} />
              <Text style={styles.texto}>{telefono}</Text>
            </View>
          )}
          {d.especialidades.length > 0 && (
            <View style={styles.especialidades}>
              {d.especialidades.map((e) => (
                <Etiqueta key={e} texto={e} colorFondo={COLORES.primarioSuave} colorTexto={COLORES.primarioOscuro} />
              ))}
            </View>
          )}
        </View>

        <TituloSeccion texto={T.horarios} />
        <TablaHorarios horarios={d.horarios} />
      </>
    );
  };

  return (
    <PantallaLista recargando={c.recargando} onRecargar={c.recargar} encabezado={<EncabezadoPagina titulo={T.titulo} />}>
      {contenido()}
      <MenuPerfil
        onDatosPersonales={() => router.push('/cuenta/datos')}
        onAyuda={() => router.push('/cuenta/contacto')}
        opcionesExtra={
          <>
            <FilaOpcion icono="editar" tono="menta" texto={T.editar} onPress={() => router.push('/centro/editar')} />
            <FilaOpcion icono="plan" tono="durazno" texto={T.planes} onPress={() => router.push('/centro/planes')} />
            {esVeterinario && <FilaOpcion icono="hoy" tono="crema" texto={T.volverAgenda} onPress={() => c.cambiarModoCentro(false)} />}
          </>
        }
      />
      {!esVeterinario && <BotonSecundario texto={TEXTOS_LOGIN.cerrarSesion} icono="salir" onPress={logout} />}
    </PantallaLista>
  );
}
