import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from '@/Auth/AuthContext';
import { NavegadorRaiz } from '@/components/navegacion/NavegadorRaiz';
import { TemaProvider } from '@/context/TemaContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <TemaProvider>
      <AuthProvider>
        <NavegadorRaiz />
      </AuthProvider>
    </TemaProvider>
  );
}
