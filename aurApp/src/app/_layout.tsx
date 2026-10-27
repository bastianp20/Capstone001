import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from '@/Auth/AuthContext';
import { NavegadorRaiz } from '@/components/navegacion/NavegadorRaiz';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <NavegadorRaiz />
    </AuthProvider>
  );
}
