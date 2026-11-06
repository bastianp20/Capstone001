import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

// Tipos generados desde la base (npm run gen:types en auraPet-Backend).
// Es una copia de auraPet/src/lib/database.types.ts: cuando cambie la base, cópialo de nuevo.
import type { Database } from './database.types';

// Mismas credenciales que la web, en .env.local (ignorado por git).
// En Expo, solo las variables que empiezan con EXPO_PUBLIC_ llegan a la app.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    'Faltan EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env.local. ' +
      'Si acabas de crearlo, reinicia `npx expo start`.',
  );
}

// Al compilar, Expo evalúa la app en Node (sin window ni almacenamiento).
// Ahí no se guarda ni se recupera sesión; en el teléfono y en el navegador, sí.
const enServidor = Platform.OS === 'web' && typeof window === 'undefined';

export const supabase = createClient<Database>(url, publishableKey, {
  auth: {
    // En el teléfono no hay localStorage: la sesión se guarda en AsyncStorage
    // y se recupera sola al volver a abrir la app.
    storage: enServidor ? undefined : AsyncStorage,
    autoRefreshToken: !enServidor,
    persistSession: !enServidor,
    detectSessionInUrl: false,
  },
});

// Renueva el token solo mientras la app está abierta en primer plano
// (recomendación de Supabase para React Native).
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (estado) => {
    if (estado === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
