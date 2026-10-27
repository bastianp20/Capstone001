import { router } from 'expo-router';
import { Text } from 'react-native';

import { BotonSecundario } from '@/components/formulario/BotonSecundario';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { TEXTOS_LOGIN, TEXTOS_PERFIL } from '@/constants/constants';
import { perfilScreenStyles as styles } from '@/css/PerfilPage';
import { useAuth } from '@/Auth/AuthContext';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import type { PerfilCuentaProps } from '@/interfaces';
import { nombrePropio } from '@/lib/texto';

import { CabeceraPerfil } from './CabeceraPerfil';
import { MenuPerfil } from './MenuPerfil';

/** Perfil de cualquier rol: avatar, nombre, contenido propio, ajustes y cerrar sesión. */
export function PerfilCuenta({ children, opcionesExtra, rolTexto }: PerfilCuentaProps) {
  useBarraEstadoClara();
  const { usuarioActual, logout } = useAuth();
  const correo = [usuarioActual?.email, rolTexto].filter(Boolean).join(' · ');

  return (
    <PantallaLista encabezado={<EncabezadoPagina titulo={TEXTOS_PERFIL.titulo} centrado />}>
      <CabeceraPerfil nombre={nombrePropio(usuarioActual?.nombre ?? '')} correo={correo} />
      {children}
      <MenuPerfil
        onDatosPersonales={() => router.push('/cuenta/datos')}
        onAyuda={() => router.push('/cuenta/contacto')}
        opcionesExtra={opcionesExtra}
      />
      <BotonSecundario texto={TEXTOS_LOGIN.cerrarSesion} icono="salir" onPress={logout} />
      <Text style={styles.version}>{TEXTOS_PERFIL.versionApp}</Text>
    </PantallaLista>
  );
}
