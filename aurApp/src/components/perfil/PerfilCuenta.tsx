import { router } from 'expo-router';
import { Text } from 'react-native';

import { BotonSecundario } from '@/components/formulario/BotonSecundario';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { TEXTOS_LOGIN, TEXTOS_PERFIL } from '@/constants/constants';
import { perfilScreenStyles as styles } from '@/css/PerfilPage';
import { useAuth } from '@/Auth/AuthContext';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useFotoPerfil } from '@/hooks/useFotoPerfil';
import { useMisRefugios } from '@/hooks/useMisRefugios';
import type { PerfilCuentaProps } from '@/interfaces';
import { nombrePropio } from '@/lib/texto';

import { CabeceraPerfil } from './CabeceraPerfil';
import { HojaFotoPerfil } from './HojaFotoPerfil';
import { MenuPerfil } from './MenuPerfil';

/** Perfil de cualquier rol: foto (opcional), nombre, contenido propio, ajustes, eliminar cuenta y cerrar sesión. */
export function PerfilCuenta({ children, opcionesExtra, rolTexto }: PerfilCuentaProps) {
  useBarraEstadoClara();
  const { usuarioActual, logout } = useAuth();
  const correo = [usuarioActual?.email, rolTexto].filter(Boolean).join(' · ');
  const nombre = nombrePropio(usuarioActual?.nombre ?? '');
  const foto = useFotoPerfil();
  // El superadmin no pide su propia eliminación (la base tampoco se lo permite)
  const puedeEliminar = usuarioActual?.rol !== 'superadmin';
  // El dueño tiene Adopta como pestaña; los demás roles la abren desde aquí
  const conPestanaAdopta = usuarioActual?.rol === 'dueno';
  const misRefugios = useMisRefugios();

  return (
    <PantallaLista encabezado={<EncabezadoPagina titulo={TEXTOS_PERFIL.titulo} centrado />}>
      <CabeceraPerfil nombre={nombre} correo={correo} fotoUrl={foto.fotoUrl} onCambiarFoto={foto.abrir} />
      {children}
      <MenuPerfil
        onDatosPersonales={() => router.push('/cuenta/datos')}
        onAyuda={() => router.push('/cuenta/contacto')}
        opcionesExtra={opcionesExtra}
        onEliminarCuenta={puedeEliminar ? () => router.push('/cuenta/eliminar') : undefined}
        onAdopcion={conPestanaAdopta ? undefined : () => router.push('/adopcion')}
        onMisPublicaciones={() => router.push('/adopcion/mis-publicaciones')}
        misRefugios={misRefugios}
        onMiRefugio={(id) => router.push(`/refugio/${id}`)}
      />
      <BotonSecundario texto={TEXTOS_LOGIN.cerrarSesion} icono="salir" onPress={logout} />
      <Text style={styles.version}>{TEXTOS_PERFIL.versionApp}</Text>
      <HojaFotoPerfil
        visible={foto.abierta}
        nombre={nombre}
        fotoUrl={foto.fotoUrl}
        ocupado={foto.ocupado}
        error={foto.error}
        onTomar={foto.tomar}
        onElegir={foto.elegir}
        onQuitar={foto.quitar}
        onCerrar={foto.cerrar}
      />
    </PantallaLista>
  );
}
