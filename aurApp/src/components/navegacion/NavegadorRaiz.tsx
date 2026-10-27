import { DefaultTheme, Stack, ThemeProvider, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';

import { useAuth } from '@/Auth/AuthContext';
import { COLORES } from '@/constants/constants';
import { CentroProvider, useCentro } from '@/context/CentroContext';
import { DatosDuenoProvider } from '@/context/DatosDuenoContext';
import { SuperadminProvider } from '@/context/SuperadminContext';
import { VeterinarioProvider } from '@/context/VeterinarioContext';
import { useArranqueApp } from '@/hooks/useArranqueApp';

import { PantallaSinCentro } from './PantallaSinCentro';
import { PantallaCargaInicial } from './PantallaCargaInicial';

const temaAuraPet = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: COLORES.fondo, primary: COLORES.primario },
};

/**
 * Qué ve cada cuenta (como LoginRol en la web):
 * · sin sesión → login
 * · dueño → sus pestañas · veterinario → su agenda · administrativo → el panel de su centro
 * · veterinario que además administra un centro → su agenda, y desde Perfil pasa al centro
 * · superadmin → su panel
 */
function Rutas() {
  const { usuarioActual } = useAuth();
  const centro = useCentro();
  const rol = usuarioActual?.rol;
  const conSesion = !!usuarioActual;
  const administraCentro = centro.centros.length > 0;
  const vetEnCentro = rol === 'veterinario' && centro.modoCentro;

  // El veterinario cambia entre su agenda y el centro: primero se abre la ruta (guard) y luego se navega.
  const modoAnterior = useRef(false);
  useEffect(() => {
    if (rol === 'veterinario' && centro.modoCentro !== modoAnterior.current) {
      router.replace(centro.modoCentro ? '/centro' : '/veterinario');
    }
    modoAnterior.current = centro.modoCentro;
  }, [rol, centro.modoCentro]);

  if (rol === 'administrativo') {
    if (centro.cargando && !administraCentro) return <PantallaCargaInicial />;
    if (!administraCentro) return <PantallaSinCentro />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Protected guard={rol === 'dueno'}>
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="pedir-hora" />
        <Stack.Screen name="mascota/nueva" />
        <Stack.Screen name="mascota/[id]" />
      </Stack.Protected>
      <Stack.Protected guard={rol === 'veterinario'}>
        <Stack.Screen name="veterinario" options={{ animation: 'fade' }} />
      </Stack.Protected>
      <Stack.Protected guard={administraCentro && (rol === 'administrativo' || vetEnCentro)}>
        <Stack.Screen name="centro" options={{ animation: 'fade' }} />
      </Stack.Protected>
      <Stack.Protected guard={rol === 'superadmin'}>
        <Stack.Screen name="admin" options={{ animation: 'fade' }} />
      </Stack.Protected>
      <Stack.Protected guard={conSesion}>
        <Stack.Screen name="cuenta/datos" />
        <Stack.Screen name="cuenta/contacto" />
      </Stack.Protected>
      <Stack.Protected guard={!conSesion}>
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
      </Stack.Protected>
    </Stack>
  );
}

export function NavegadorRaiz() {
  const listo = useArranqueApp();

  useEffect(() => {
    if (listo) SplashScreen.hideAsync();
  }, [listo]);

  // Mientras tanto se sigue viendo la pantalla de carga nativa.
  if (!listo) return null;

  return (
    <ThemeProvider value={temaAuraPet}>
      <DatosDuenoProvider>
        <VeterinarioProvider>
          <CentroProvider>
            <SuperadminProvider>
              <StatusBar style="dark" />
              <Rutas />
            </SuperadminProvider>
          </CentroProvider>
        </VeterinarioProvider>
      </DatosDuenoProvider>
    </ThemeProvider>
  );
}
