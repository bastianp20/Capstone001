import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { CLAVE_TEMA, PALETA_CLARA, PALETA_OSCURA, TONOS_TARJETA_CLARO, TONOS_TARJETA_OSCURO } from '@/constants/constants';
import type { ContextoTema, PreferenciaTema, ProveedorProps } from '@/interfaces';

const TemaContext = createContext<ContextoTema | undefined>(undefined);

const esPreferencia = (v: string | null): v is PreferenciaTema => v === 'claro' || v === 'oscuro' || v === 'auto';

/**
 * Claro, oscuro o automático (según el teléfono), igual que Configuración → Apariencia en la web.
 * Se guarda en el teléfono; mientras se lee no se dibuja nada (sigue la pantalla de carga nativa).
 */
export const TemaProvider = ({ children }: ProveedorProps) => {
  const sistema = useColorScheme();
  const [preferencia, setPreferencia] = useState<PreferenciaTema | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(CLAVE_TEMA)
      .then((v) => setPreferencia(esPreferencia(v) ? v : 'auto'))
      .catch(() => setPreferencia('auto'));
  }, []);

  if (!preferencia) return null;

  const esOscuro = preferencia === 'oscuro' || (preferencia === 'auto' && sistema === 'dark');
  const cambiarPreferencia = (p: PreferenciaTema) => {
    setPreferencia(p);
    AsyncStorage.setItem(CLAVE_TEMA, p).catch(() => undefined);
  };

  const valor: ContextoTema = {
    preferencia,
    cambiarPreferencia,
    esOscuro,
    colores: esOscuro ? PALETA_OSCURA : PALETA_CLARA,
    tonos: esOscuro ? TONOS_TARJETA_OSCURO : TONOS_TARJETA_CLARO,
  };
  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
};

export const useTema = (): ContextoTema => {
  const ctx = useContext(TemaContext);
  if (!ctx) throw new Error('useTema debe usarse dentro de <TemaProvider>');
  return ctx;
};

/** Colores del tema actual (reemplaza al antiguo COLORES fijo). */
export const useColores = () => useTema().colores;

/** Tonos pastel de tarjetas del tema actual. */
export const useTonosTarjeta = () => useTema().tonos;
